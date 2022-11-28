import { createClient } from '../client/client';
import { AppInfo, EmotionId, OriginalMessageType, SystemMessageDataType } from '../../typings';

import { createMusicRecognizer } from './recognizers/musicRecognizer';
import { createSpeechRecognizer } from './recognizers/speechRecognizer';
import { createVoiceListener } from './listener/voiceListener';
import { createVoicePlayer } from './player/voicePlayer';
import { resolveAudioContext, isAudioSupported } from './audioContext';

const createVoiceSettings = (listener: ReturnType<typeof createVoiceListener>) => {
    let settings = { disableDubbing: false, disableListening: false };
    let nextSettings: Partial<typeof settings> = {};
    let isVoicePlayerEnded = true;

    const tryApply = () => {
        if (listener.status === 'stopped' && isVoicePlayerEnded) {
            settings = {
                ...settings,
                ...nextSettings,
            };
        }
    };

    const change = (setts: Partial<typeof settings>) => {
        nextSettings = {
            ...nextSettings,
            ...setts,
        };

        tryApply();
    };

    /**
     * Пытается применить настройки в момент завершения озвучки
     * (или при прекращении слушания, если озвучка отключена).
     */
    const startAutoApplying = (voicePlayer?: ReturnType<typeof createVoicePlayer>) => {
        const subscribers: Array<() => void> = [];

        subscribers.push(
            listener.on('status', (status) => {
                if (status === 'stopped') {
                    tryApply();
                }
            }),
        );

        if (voicePlayer) {
            subscribers.push(
                voicePlayer.on('play', () => {
                    isVoicePlayerEnded = false;
                }),
            );

            subscribers.push(
                voicePlayer.on('end', () => {
                    isVoicePlayerEnded = true;
                    tryApply();
                }),
            );
        }

        return () => subscribers.forEach((unsubscribe) => unsubscribe());
    };

    return {
        change,
        startAutoApplying,
        get disableDubbing() {
            return settings.disableDubbing;
        },
        get disableListening() {
            return settings.disableListening;
        },
    };
};

export interface TtsEvent {
    status: 'start' | 'stop';
    messageId: number;
    appInfo: AppInfo;
}

export const createVoice = (
    client: ReturnType<typeof createClient>,
    emit: (event: {
        asr?: { text: string; last?: boolean; mid?: OriginalMessageType['messageId'] }; // lasr и mid нужен для отправки исх бабла в чат
        emotion?: EmotionId;
        tts?: TtsEvent;
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
    const settings = createVoiceSettings(listener);
    const appInfoDict: Record<string, AppInfo> = {};
    const mesIdQueue: Array<string> = [];

    let isPlaying = false; // проигрывается/не проигрывается озвучка
    let autolistenMesId: string | null = null; // id сообщения, после проигрывания которого, нужно активировать слушание

    /** останавливает слушание голоса, возвращает true - если слушание было активно */
    const stopListening = (): boolean => {
        const result = speechRecognizer.status === 'active' || musicRecognizer.status === 'active';

        autolistenMesId = null;
        if (speechRecognizer.status === 'active') {
            speechRecognizer.stop();
            client.sendCancel(speechRecognizer.messageId);
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
    const listen = async ({ begin }: { begin?: ArrayBuffer[] } = {}): Promise<void> => {
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
        if (listener.status === 'stopped') {
            return client.init().then(() =>
                client.createVoiceStream(({ sendVoice, messageId, onMessage }) => {
                    begin?.forEach((chunk) => sendVoice(new Uint8Array(chunk), false));

                    return speechRecognizer.start({
                        sendVoice,
                        messageId,
                        onMessage,
                    });
                }),
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

        if (settings.disableListening) {
            return;
        }

        // повторные вызовы не пройдут, пока пользователь не разрешит/запретит аудио
        if (listener.status === 'stopped') {
            client.createVoiceStream(({ sendVoice, messageId, onMessage }) =>
                musicRecognizer.start({
                    sendVoice,
                    messageId,
                    onMessage,
                }),
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

            // запуск автоматического применения настроек
            subscriptions.push(settings.startAutoApplying(voicePlayer));

            // оповещаем о готовности к воспроизведению звука
            onReady && onReady();
        });
    } else {
        // запуск автоматического применения настроек (в случае, если озвучка не доступна)
        subscriptions.push(settings.startAutoApplying());
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
                    text: listener.status === 'listen' && !settings.disableListening ? text : '',
                    last: isLast,
                    mid,
                },
            });
        }),
    );

    // статусы слушания речи
    subscriptions.push(
        listener.on('status', (status: 'listen' | 'started' | 'stopped') => {
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

    return {
        destroy: () => {
            stopListening();
            voicePlayer?.setActive(false);
            subscriptions.splice(0, subscriptions.length).map((unsubscribe) => unsubscribe());
        },
        change: (nextSettings: Partial<Pick<typeof settings, 'disableDubbing' | 'disableListening'>>) => {
            const { disableDubbing, disableListening } = nextSettings;

            /// Важен порядок обработки флагов слушания и озвучки.
            /// Сначала слушание, потом озвучка
            disableListening && stopListening();
            // Такой вызов необходим, чтобы включая озвучку она тут же проигралась (при её наличии), и наоборот
            settings.disableDubbing !== disableDubbing && voicePlayer?.setActive(!disableDubbing);

            settings.change(nextSettings);
        },
        listen,
        shazam,
        stop,
        stopPlaying: () => {
            voicePlayer?.stop();
        },
    };
};
