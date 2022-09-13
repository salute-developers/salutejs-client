import { createSettingsReducer } from '../assistant';
import { createClient } from '../client/client';
import { AppInfo, EmotionId, OriginalMessageType, SystemMessageDataType } from '../../typings';

import { VoiceListenerStatus } from './listener/voiceListener';
import { createVoicePlayer } from './player/voicePlayer';
import { resolveAudioContext, isAudioSupported } from './audioContext';
import { createRecognizers } from './recognizers/createRecognizers';

export interface TtsEvent {
    status: 'start' | 'stop';
    messageId: number;
    appInfo: AppInfo;
}

export const createVoice = (
    client: ReturnType<typeof createClient>,
    settings: ReturnType<typeof createSettingsReducer>['settings'],
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
    const { speechRecognizer, musicRecognizer, on: onRecognizers, destroy: destroyRecognizers } = createRecognizers();
    const subscriptions: Array<() => void> = [];
    const appInfoDict: Record<string, AppInfo> = {};
    const mesIdQueue: Array<string> = [];

    let voicePlayer: ReturnType<typeof createVoicePlayer>;
    let isPlaying = false; // проигрывается/не проигрывается озвучка
    let autolistenMesId: string | null = null; // id сообщения, после проигрывания которого, нужно активировать слушание

    /** останавливает слушание голоса, возвращает true - если слушание было активно */
    const stopListening = (): boolean => {
        autolistenMesId = null;

        return [speechRecognizer, musicRecognizer].reduce((result, recognizer) => {
            const isListenStarted = recognizer.status === 'listen';
            const isActive = recognizer.status !== 'stopped';

            if (isActive) {
                recognizer.stop();

                if (isListenStarted) {
                    client.sendCancel(recognizer.messageId);
                }

                return true;
            }

            return result;
        }, false);
    };

    /** Останавливает слушание и воспроизведение */
    const stop = () => {
        // здесь важен порядок остановки голоса
        stopListening();
        voicePlayer?.stop();
    };

    const record = async (
        recognizer: typeof speechRecognizer | typeof musicRecognizer,
        bufferBegin?: ArrayBuffer[],
    ) => {
        if (stopListening()) {
            return;
        }

        if (isPlaying) {
            voicePlayer?.stop();
            return;
        }

        if (settings.disableListening) {
            return;
        }

        // повторные вызовы не пройдут, пока пользователь не разрешит/запретит аудио
        if (recognizer.status === 'stopped') {
            const { sendVoice, messageId, onMessage, sendSystemMessage } = await client.resolveVoiceStream();

            await recognizer.start({
                messageId,
                onMessage,
                sendVoice: (...args) => {
                    // При первом вызове подкладываем начальные чанки
                    bufferBegin?.forEach((chunk) => sendVoice(new Uint8Array(chunk), false));
                    bufferBegin = undefined;

                    sendVoice(...args);
                },
            });

            if (recognizer.status === 'stopped') {
                return;
            }

            client.sendMeta(sendSystemMessage, true);
        }
    };

    /** Активирует слушание голоса
     * если было активно слушание или проигрывание - останавливает, слушание в этом случае не активируется
     */
    const listen = ({ begin }: { begin?: ArrayBuffer[] } = {}): Promise<void> => {
        return record(speechRecognizer, begin);
    };

    /** Активирует распознавание музыки
     * если было активно слушание или проигрывание - останавливает, распознование музыки в этом случае не активируется
     */
    const shazam = (): Promise<void> => {
        return record(musicRecognizer);
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
            if (settings.disableDubbing) {
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
                    text: speechRecognizer.status === 'listen' && !settings.disableListening ? text : '',
                    last: isLast,
                    mid,
                },
            });
        }),
    );

    // статусы слушания речи
    subscriptions.push(
        onRecognizers('status', (status) => {
            emit({ listener: { status } });

            if (status === 'listen') {
                voicePlayer?.setActive(false);
                emit({ emotion: 'listen' });
            } else if (status === 'stopped') {
                voicePlayer?.setActive(!settings.disableDubbing);
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

                if (!settings.disableDubbing) {
                    autolistenMesId = messageId;
                } else {
                    listen();
                }
            }
        }),
    );

    subscriptions.push(
        settings.on('change-request', (nextSettings) => {
            const { disableDubbing, disableListening } = nextSettings;

            /// Важен порядок обработки флагов слушания и озвучки.
            /// Сначала слушание, потом озвучка
            disableListening && stopListening();
            // Такой вызов необходим, чтобы включая озвучку она тут же проигралась (при её наличии), и наоборот
            settings.disableDubbing !== disableDubbing && voicePlayer?.setActive(!disableDubbing);
        }),
    );

    return {
        destroy: () => {
            stopListening();
            voicePlayer?.setActive(false);
            subscriptions.splice(0, subscriptions.length).map((unsubscribe) => unsubscribe());
            destroyRecognizers();
        },
        listen,
        shazam,
        stop,
        stopPlaying: () => {
            voicePlayer?.stop();
        },
    };
};
