import { createClient } from '../client/client';
import { AppInfo, EmotionId, OriginalMessageType, Mid, SystemMessageDataType, MessageNames } from '../../typings';
import { AssistantSettings } from '../assistant';
import { MutexedObject } from '../mutexedObject';

import { createNavigatorAudioProvider } from './listener/navigatorAudioProvider';
import { createVoiceListener, VoiceListenerStatus } from './listener/voiceListener';
import { createVoicePlayer } from './player/voicePlayer';
import { resolveAudioContext, isAudioSupported } from './audioContext';
import { Music2TrackProtocol } from './recognizers/mtt';

export interface TtsEvent {
    status: 'start' | 'stop';
    messageId: number;
    appInfo: AppInfo;
}

// /** Фильтр тишины */
// const filterEmptyChunks = (chunksOriginal: Uint8Array[]) => {
//     return chunksOriginal.reduce<Uint8Array[]>((acc, chunkOriginal) => {
//         const chunk = chunkOriginal.filter((int) => int);

//         if (chunk.length) {
//             acc.push(chunk);
//         }

//         return acc;
//     }, []);
// };

export const createVoice = (
    client: ReturnType<typeof createClient>,
    settings: MutexedObject<AssistantSettings>,
    emit: (event: {
        asr?: { text: string; normalizedText: string; last?: boolean; mid?: OriginalMessageType['messageId'] }; // last и mid нужен для отправки исх бабла в чат
        emotion?: EmotionId;
        listener?: { status: VoiceListenerStatus };
        mtt?: { response: Music2TrackProtocol.MttResponse; mid: OriginalMessageType['messageId'] };
        tts?: TtsEvent;
        voiceAnalyser?: { data: Uint8Array };
    }) => void,
    /// пока onReady не вызван, треки не воспроизводятся
    /// когда случится onReady, очередь треков начнет проигрываться
    onReady?: () => void,
    useAnalyser?: boolean,
) => {
    let voicePlayer: ReturnType<typeof createVoicePlayer>;
    const listener = createVoiceListener((cb) => createNavigatorAudioProvider(cb, useAnalyser));
    const subscriptions: Array<() => void> = [];
    const appInfoDict: Record<string, AppInfo> = {};
    const mesIdQueue: Array<string> = [];

    /** в процессе инициализации слушания */
    let isRecognizeInitializing = false;
    /** проигрывается/не проигрывается озвучка */
    let isPlaying = false;
    /** id сообщения, после проигрывания которого, нужно активировать слушание */
    let autolistenMessageId: string | null = null;
    /** id сообщения со звуком, отправляемое в данный момент */
    let currentVoiceMessageId: Mid | null = null;
    /** стримит поток чанков. Если метода нет, то стриминг не идёт */
    let streaming: ((chunks: Uint8Array[], last: boolean) => void) | null = null;
    /** Уничтожает аудио-контекст */
    let destroyAudioContext: (() => void) | null = null;

    /** Останавливает слушание голоса, отправляет cancel. Возвращает true - если слушание было активно */
    const stopVoice = (sendCancel = true): boolean => {
        autolistenMessageId = null;
        streaming = null;

        if (sendCancel && currentVoiceMessageId) {
            client.sendCancel(currentVoiceMessageId);
        }

        currentVoiceMessageId = null;

        if (listener.status === 'listen') {
            listener.stop();

            return true;
        }

        return false;
    };

    /** Останавливает слушание и воспроизведение */
    const stop = () => {
        // здесь важен порядок остановки голоса
        stopVoice();
        voicePlayer?.stop();
    };

    const recognize = async ({
        begin,
        messageName,
        isAutoListening = false,
    }: { begin?: Uint8Array[]; messageName?: string; isAutoListening?: boolean } = {}) => {
        if (stopVoice()) {
            return;
        }

        if (isPlaying) {
            voicePlayer?.stop();

            return;
        }

        if (settings.current.disableListening) {
            return;
        }

        // повторные вызовы не пройдут
        if (listener.status === 'stopped' && !isRecognizeInitializing) {
            isRecognizeInitializing = true;

            const unsubscribe = listener.on('status', () => {
                isRecognizeInitializing = false;

                unsubscribe();
            });

            await client.init().catch((error) => {
                isRecognizeInitializing = false;

                throw error;
            });

            return client.createVoiceStream(
                ({ sendVoice, messageId }) => {
                    begin?.forEach((chunk) => sendVoice(new Uint8Array(chunk), false));

                    currentVoiceMessageId = messageId;

                    return listener.listen((chunk, analyser, last) => {
                        if (analyser) {
                            emit({ voiceAnalyser: { data: analyser } });
                        }

                        sendVoice(chunk, last, messageName);
                    });
                },
                {
                    source: {
                        sourceType: isAutoListening ? 'autoListening' : 'lavashar',
                    },
                },
            );
        }
    };

    /**
     * Стримит переданные чанки звука в VPS.
     * При отсутствии last=true через 3 секунды тишины отправляет Cancel.
     * Если было активно слушание или проигрывание – останавливает.
     *
     * @param chunks одноканальные, sampleRate: 16000
     * @param last последние чанки этого стрима?
     * @param messageName указать, если чанки для шазама
     */
    const streamVoice = async (chunks: Uint8Array[], last: boolean, messageName?: 'MUSIC_RECOGNITION' | undefined) => {
        // chunks = filterEmptyChunks(chunks);

        if (streaming?.(chunks, last)) {
            return;
        }

        stopVoice();

        if (isPlaying) {
            voicePlayer?.stop();
        }

        if (!isRecognizeInitializing && chunks.length) {
            isRecognizeInitializing = true;

            await client.init();

            return client.createVoiceStream(
                async ({ messageId, sendVoice }) => {
                    let cancelTimeoutId: unknown = -1;

                    isRecognizeInitializing = false;
                    currentVoiceMessageId = messageId;

                    streaming = (ch, l) => {
                        clearTimeout(cancelTimeoutId as number);

                        ch.forEach((chunk) => sendVoice(new Uint8Array(chunk), l, messageName));

                        if (l) {
                            streaming = null;
                        } else {
                            cancelTimeoutId = setTimeout(() => {
                                if (streaming) {
                                    stopVoice();
                                }
                            }, 3000);
                        }

                        return true;
                    };

                    streaming(chunks, last);
                },
                {
                    source: {
                        sourceType: 'lavashar',
                    },
                },
            );
        }
    };

    /**
     * Отправляет готовые чанки звука в VPS.
     * Чанки считаются завершёнными (сообщение отправляется с last=true).
     * Если было активно слушание или проигрывание – останавливает.
     *
     * @param chunks одноканальные, sampleRate: 16000
     * @param messageName указать, если чанки для шазама
     */
    const sendVoice = async (chunks: Uint8Array[], messageName?: 'MUSIC_RECOGNITION') => {
        // chunks = filterEmptyChunks(chunks);

        stopVoice();

        if (isPlaying) {
            voicePlayer?.stop();
        }

        if (!isRecognizeInitializing && chunks.length) {
            isRecognizeInitializing = true;

            await client.init();

            return client.createVoiceStream(
                ({ messageId, sendVoice: sendVoiceStream }) => {
                    isRecognizeInitializing = false;
                    currentVoiceMessageId = messageId;

                    chunks.forEach((chunk) => sendVoiceStream(new Uint8Array(chunk), true, messageName));

                    return Promise.resolve();
                },
                {
                    source: {
                        sourceType: 'lavashar',
                    },
                },
            );
        }
    };

    /**
     * Активирует слушание голоса.
     * Если было активно слушание или проигрывание - останавливает, слушание в этом случае не активируется.
     *
     * @param begin одноканальные чанки, sampleRate: 16000 – будут отправлены перед голосом пользователя
     */
    const listen = ({ begin }: { begin?: Uint8Array[] } = {}, isAutoListening?: boolean) => {
        return recognize({ begin, isAutoListening });
    };

    /**
     * Активирует распознавание музыки.
     * Если было активно слушание или проигрывание – останавливает
     */
    const shazam = () => {
        return recognize({ messageName: MessageNames.MTT, isAutoListening: false });
    };

    if (isAudioSupported) {
        resolveAudioContext((context, destroy) => {
            /// создаем плеер только если поддерживается аудио
            /// и только когда готов AudioContext
            voicePlayer = createVoicePlayer(context, { startVoiceDelay: 1 });
            destroyAudioContext = destroy;

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
                    client.sendMute(Number(mesId));
                }),
            );

            // окончание проигрывания озвучки
            subscriptions.push(
                voicePlayer.on('end', (mesId: string) => {
                    isPlaying = false;
                    emit({ emotion: 'idle' });
                    emit({ tts: { status: 'stop', messageId: Number(mesId), appInfo: appInfoDict[mesId] } });

                    if (mesId === autolistenMessageId) {
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
            onReady?.();
        });
    }

    subscriptions.push(
        // обработка входящей озвучки
        client.on('voice', (data, message) => {
            if (settings.current.disableDubbing) {
                return;
            }

            voicePlayer?.append(data, message.messageId.toString(), message.last === 1);
        }),

        // статусы слушания речи
        listener.on('status', (status: VoiceListenerStatus) => {
            emit({ listener: { status } });

            if (status === 'listen') {
                voicePlayer?.setActive(false);
                emit({ emotion: 'listen' });
            } else if (status === 'stopped') {
                voicePlayer?.setActive(!settings.current.disableDubbing);
                emit({ asr: { text: '', normalizedText: '' }, emotion: 'idle' });
            }
        }),

        // активация автослушания
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
                    autolistenMessageId = messageId;
                } else {
                    listen({}, autoListening);
                }
            }
        }),

        client.on('status', ({ code }) => {
            if (code < 0) {
                stopVoice(false);
            }
        }),

        client.on('stt', ({ text, response }, originalMessage) => {
            const listening = listener.status === 'listen' && !settings.current.disableListening;

            if (text) {
                const last = false; // originalMessage.last === 1;

                if (last || listening) {
                    emit({
                        asr: {
                            mid: originalMessage.messageId,
                            text: text.data || '',
                            normalizedText: response?.decoderResultField?.hypothesis?.[0]?.normalizedText || '',
                            last: originalMessage.last === 1,
                        },
                    });
                }

                if (last) {
                    stopVoice(false);
                }
            }

            if (response) {
                const { decoderResultField, errorResponse } = response;
                const last = false; // !!(decoderResultField && decoderResultField?.isFinal);

                if ((last || listening) && decoderResultField?.hypothesis?.length) {
                    emit({
                        asr: {
                            mid: originalMessage.messageId,
                            text: decoderResultField.hypothesis[0].normalizedText || '',
                            normalizedText: decoderResultField.hypothesis[0].normalizedText || '',
                            last: !!(decoderResultField && decoderResultField?.isFinal),
                        },
                    });
                }

                if (last || errorResponse) {
                    stopVoice(false);
                }
            }
        }),

        client.on('musicRecognition', (response, originalMessage) => {
            emit({ mtt: { response, mid: originalMessage.messageId } });

            if (response.decoderResultField?.isFinal || response.errorResponse) {
                stopVoice(false);
            }
        }),

        settings.on('change-request', (nextSettings) => {
            const { disableDubbing, disableListening } = nextSettings;

            /// Важен порядок обработки флагов слушания и озвучки —
            /// сначала слушание, потом озвучка
            disableListening && stopVoice();
            // Такой вызов необходим, чтобы включая озвучку она тут же проигралась (при её наличии), и наоборот
            settings.current.disableDubbing !== disableDubbing && voicePlayer?.setActive(!disableDubbing);
        }),
    );

    return {
        destroy: () => {
            stopVoice();
            voicePlayer?.setActive(false);
            subscriptions.splice(0, subscriptions.length).map((unsubscribe) => unsubscribe());
            destroyAudioContext?.();
        },
        listen,
        shazam,
        sendVoice,
        streamVoice,
        stop,
        stopPlaying: () => {
            voicePlayer?.stop();
        },
    };
};
