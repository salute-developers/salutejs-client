import Long from 'long';

import { createClient } from '../client/client';
import { AppInfo, EmotionId, OriginalMessageType, SystemMessageDataType } from '../../typings';
import { AssistantSettings } from '../assistant';
import { MutexedObject } from '../mutexedObject';

import { createMusicRecognizer } from './recognizers/musicRecognizer';
import { createSpeechRecognizer } from './recognizers/speechRecognizer';
import { createVoiceListener, VoiceListenerStatus } from './listener/voiceListener';
import { createVoicePlayer } from './player/voicePlayer';
import { resolveAudioContext, isAudioSupported } from './audioContext';

export interface TtsEvent {
    status: 'start' | 'stop';
    messageId: number;
    appInfo: AppInfo;
}

export const createVoice = (
    client: ReturnType<typeof createClient>,
    settings: MutexedObject<AssistantSettings>,
    emit: (event: {
        asr?: { text: string; last?: boolean; mid?: OriginalMessageType['messageId'] }; // lasr и mid нужен для отправки исх бабла в чат
        emotion?: EmotionId;
        tts?: TtsEvent;
        listener?: { status: VoiceListenerStatus };
    }) => void,
    /// пока onReady не вызван, треки не воспроизводятся
    /// когда случится onReady, очередь треков начнет проигрываться
    onReady?: () => void,
) => {
    let voicePlayer: ReturnType<typeof createVoicePlayer>;
    const listener = createVoiceListener();
    const musicRecognizer = createMusicRecognizer(listener);
    const speechRecognizer = createSpeechRecognizer(listener);
    const subscriptions: Array<() => void> = [];
    const appInfoDict: Record<string, AppInfo> = {};
    const mesIdQueue: Array<string> = [];

    /** в процессе инициализации ассистента */
    let isInitializing = false;
    let isPlaying = false; // проигрывается/не проигрывается озвучка
    let autolistenMesId: string | null = null; // id сообщения, после проигрывания которого, нужно активировать слушание

    /** останавливает слушание голоса, возвращает true - если слушание было активно */
    const stopListening = (): boolean => {
        const result = speechRecognizer.status === 'active' || musicRecognizer.status === 'active';

        autolistenMesId = null;
        if (
            speechRecognizer.status === 'active' ||
            (speechRecognizer.status === 'inactive' && listener.status === 'started')
        ) {
            client.sendCancel(speechRecognizer.messageId);
            speechRecognizer.stop();
            return true;
        }

        if (musicRecognizer.status === 'active') {
            musicRecognizer.stop();
            client.sendCancel(musicRecognizer.messageId);
            return true;
        }

        return result;
    };

    /** Останавливает слушание и воспроизведение */
    const stop = () => {
        // здесь важен порядок остановки голоса
        stopListening();
        voicePlayer?.stop();
    };

    /** Активирует слушание голоса
     * если было активно слушание или проигрывание - останавливает, слушание в этом случае не активируется
     */
    const listen = async ({ begin }: { begin?: ArrayBuffer[] } = {}, isAutoListening = false): Promise<void> => {
        if (stopListening()) {
            return;
        }

        if (isPlaying) {
            voicePlayer?.stop();
            return;
        }

        if (settings.current.disableListening) {
            return;
        }

        // повторные вызовы не пройдут, пока пользователь не разрешит/запретит аудио
        if (listener.status === 'stopped' && !isInitializing) {
            isInitializing = true;

            const unsubscribe = listener.on('status', () => {
                isInitializing = false;
                unsubscribe();
            });

            return client.init().then(() =>
                client.createVoiceStream(
                    ({ sendVoice, messageId, onMessage }) => {
                        begin?.forEach((chunk) => sendVoice(new Uint8Array(chunk), false));

                        return speechRecognizer.start({
                            sendVoice,
                            messageId,
                            onMessage,
                        });
                    },
                    {
                        source: {
                            sourceType: isAutoListening ? 'autoListening' : 'lavashar',
                        },
                    },
                ),
            );
        }
    };

    /** Активирует распознавание музыки
     * если было активно слушание или проигрывание - останавливает, распознование музыки в этом случае не активируется
     */
    const shazam = () => {
        if (stopListening()) {
            return;
        }

        if (isPlaying) {
            voicePlayer?.stop();
        }

        if (settings.current.disableListening) {
            return;
        }

        // повторные вызовы не пройдут, пока пользователь не разрешит/запретит аудио
        if (listener.status === 'stopped' && !isInitializing) {
            isInitializing = true;

            const unsubscribe = listener.on('status', () => {
                isInitializing = false;
                unsubscribe();
            });

            client.init().then(() =>
                client.createVoiceStream(
                    ({ sendVoice, messageId, onMessage }) =>
                        musicRecognizer.start({
                            sendVoice,
                            messageId,
                            onMessage,
                        }),
                    {
                        source: {
                            sourceType: 'lavashar',
                        },
                    },
                ),
            );
        }
    };

    if (isAudioSupported) {
        resolveAudioContext((context) => {
            /// создаем плеер только если поддерживается аудио
            /// и только когда готов AudioContext
            voicePlayer = createVoicePlayer(context, { startVoiceDelay: 1 });

            // начало проигрывания озвучки
            subscriptions.push(
                voicePlayer.on('play', (mesId: string) => {
                    isPlaying = true;
                    emit({ emotion: 'talk' });
                    emit({ tts: { status: 'start', messageId: Number(mesId), appInfo: appInfoDict[mesId] } });
                }),
            );

            subscriptions.push(
                voicePlayer.on('stop', (mesId: string) => {
                    client.sendCancel(Number(mesId));
                }),
            );

            // окончание проигрывания озвучки
            subscriptions.push(
                voicePlayer.on('end', (mesId: string) => {
                    isPlaying = false;
                    emit({ emotion: 'idle' });
                    emit({ tts: { status: 'stop', messageId: Number(mesId), appInfo: appInfoDict[mesId] } });

                    if (mesId === autolistenMesId) {
                        listen();
                    }

                    // очистка сохраненных appInfo и messageId
                    let idx = 0;
                    do {
                        delete appInfoDict[mesIdQueue[0]];
                    } while (mesIdQueue[idx++] !== mesId && mesIdQueue.length > idx);

                    mesIdQueue.splice(0, idx);
                }),
            );

            // оповещаем о готовности к воспроизведению звука
            onReady && onReady();
        });
    }

    // обработка входящей озвучки
    subscriptions.push(
        client.on('voice', (data, message) => {
            if (settings.current.disableDubbing) {
                return;
            }

            voicePlayer?.append(data, message.messageId.toString(), message.last === 1);
        }),
    );

    // гипотезы распознавания речи
    subscriptions.push(
        speechRecognizer.on('hypotesis', (text: string, isLast: boolean, mid: number | Long) => {
            emit({
                asr: {
                    text: listener.status === 'listen' && !settings.current.disableListening ? text : '',
                    last: isLast,
                    mid,
                },
            });
        }),
    );

    // статусы слушания речи
    subscriptions.push(
        listener.on('status', (status: VoiceListenerStatus) => {
            emit({ listener: { status } });

            if (status === 'listen') {
                voicePlayer?.setActive(false);
                emit({ emotion: 'listen' });
            } else if (status === 'stopped') {
                voicePlayer?.setActive(!settings.current.disableDubbing);
                emit({ asr: { text: '' }, emotion: 'idle' });
            }
        }),
    );

    // активация автослушания
    subscriptions.push(
        client.on('systemMessage', (systemMessage: SystemMessageDataType, originalMessage: OriginalMessageType) => {
            const { auto_listening: autoListening } = systemMessage;
            const messageId = originalMessage.messageId.toString();

            if (typeof systemMessage.app_info !== 'undefined') {
                appInfoDict[messageId] = systemMessage.app_info;
                mesIdQueue.push(messageId);
            }

            if (autoListening) {
                /// если озвучка включена - сохраняем mesId чтобы включить слушание после озвучки
                /// если озвучка выключена - включаем слушание сразу

                if (settings.current.disableDubbing === false) {
                    autolistenMesId = messageId;
                } else {
                    listen({}, autoListening);
                }
            }
        }),
    );

    subscriptions.push(
        settings.on('change-request', (nextSettings) => {
            const { disableDubbing, disableListening } = nextSettings;

            /// Важен порядок обработки флагов слушания и озвучки —
            /// сначала слушание, потом озвучка
            disableListening && stopListening();
            // Такой вызов необходим, чтобы включая озвучку она тут же проигралась (при её наличии), и наоборот
            settings.current.disableDubbing !== disableDubbing && voicePlayer?.setActive(!disableDubbing);
        }),
    );

    return {
        destroy: () => {
            stopListening();
            voicePlayer?.setActive(false);
            subscriptions.splice(0, subscriptions.length).map((unsubscribe) => unsubscribe());
        },
        listen,
        shazam,
        stop,
        stopPlaying: () => {
            voicePlayer?.stop();
        },
    };
};
