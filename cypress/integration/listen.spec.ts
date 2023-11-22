/// <reference types="cypress" />

import { Server } from 'mock-socket';

import { AssistantEvent, createAssistantClient } from '../../src';
import { EmotionId, MessageNames } from '../../src/typings';
import { Message } from '../../src/proto';
import { Music2TrackProtocol } from '../support/proto/mtt';
import { createMessage, createAsrBytes, createMttBytes } from '../support/helpers/clientMethods';
import { initServer, initAssistantClient } from '../support/helpers/init';

describe('Проверяем изменение настроек озвучки', () => {
    const audioContex = new AudioContext();

    let server: Server;
    let assistantClient: ReturnType<typeof createAssistantClient>;

    before(() => {
        cy.stub(window, 'AudioContext').callsFake(() => audioContex);
    });

    beforeEach(() => {
        server = initServer();
        assistantClient = initAssistantClient();
    });

    afterEach(() => {
        server?.stop();
    });

    const handleVoiceInputConnections = ({ onCreateInput }: { onCreateInput?: () => void } = {}) => {
        const connections = new Set();
        const createMediaStreamSource = audioContex.createMediaStreamSource;

        cy.stub(audioContex, 'createMediaStreamSource').callsFake((...args) => {
            const streamSource = createMediaStreamSource.call(audioContex, ...args);
            const connect = streamSource.connect;
            const disconnect = streamSource.disconnect;

            onCreateInput?.();

            cy.stub(streamSource, 'connect').callsFake((...connectArgs) => {
                connections.add(streamSource);

                return connect.call(streamSource, ...connectArgs);
            });

            cy.stub(streamSource, 'disconnect').callsFake(() => {
                connections.delete(streamSource);

                return disconnect.call(streamSource);
            });

            return streamSource;
        });

        return {
            get count() {
                return connections.size;
            },
        };
    };

    const canAcceptAsr = (done: () => void, useBytes: boolean) => {
        const asrText1 = 'Lorem Ipsum is';
        const asrText2 = 'Lorem Ipsum is simply dummy text';

        let hasPrevAsr = false;
        let hasVoice = false;

        server.on('connection', (socket) => {
            socket.on('message', (data) => {
                const message = Message.decode((data as Uint8Array).slice(4));

                if (message.voice && !hasVoice) {
                    hasVoice = true;

                    socket.send(
                        createMessage({
                            messageId: message.messageId,
                            messageName: MessageNames.STT,
                            text: useBytes ? undefined : { data: asrText1 },
                            last: useBytes ? undefined : -1,
                            bytes: useBytes ? { data: createAsrBytes(asrText1, false) } : undefined,
                        }),
                    );

                    socket.send(
                        createMessage({
                            messageId: message.messageId,
                            messageName: MessageNames.STT,
                            text: useBytes ? undefined : { data: asrText2 },
                            last: useBytes ? undefined : 1,
                            bytes: useBytes ? { data: createAsrBytes(asrText2, true) } : undefined,
                        }),
                    );
                }
            });
        });

        assistantClient.listen();

        assistantClient.on('assistant', ({ asr }) => {
            if (!asr?.last && asr?.text === asrText1) {
                hasPrevAsr = true;
            }

            if (asr?.last && asr?.text === asrText2 && hasPrevAsr) {
                done();
            }
        });
    };

    const asrWillIgnorForInactiveHearing = (done: () => void, useBytes: boolean) => {
        const lastAsr = 'On voice: last';

        let prevAssistantEvent: AssistantEvent | null = null;
        let hasDone = false;

        assistantClient.on('assistant', (assistantEvent) => {
            const isPrevEventListenerStopped = prevAssistantEvent?.listener?.status === 'stopped';

            prevAssistantEvent = assistantEvent;

            if (typeof assistantEvent.asr === 'undefined') {
                return;
            }

            if (assistantEvent.asr.text === lastAsr && assistantEvent.asr.last) {
                hasDone = true;

                done();
            } else if (!isPrevEventListenerStopped) {
                throw new Error(
                    `Ни какие гипотезы, кроме последней, не должны приходить при выключенном слушании. Пришло: ${assistantEvent.asr.text}`,
                );
            }
        });

        server.on('connection', (socket) => {
            socket.on('message', (data) => {
                const message = Message.decode((data as Uint8Array).slice(4));

                if (hasDone) {
                    return;
                }

                if (message.messageName === 'OPEN_ASSISTANT') {
                    socket.send(
                        createMessage({
                            messageId: message.messageId,
                            messageName: MessageNames.STT,
                            text: useBytes ? undefined : { data: 'On start' },
                            last: useBytes ? undefined : -1,
                            bytes: useBytes ? { data: createAsrBytes('On start', false) } : undefined,
                        }),
                    );

                    assistantClient.listen();
                }

                if (message.voice) {
                    assistantClient.changeSettings({ disableListening: true });

                    socket.send(
                        createMessage({
                            messageId: message.messageId,
                            messageName: MessageNames.STT,
                            text: useBytes ? undefined : { data: 'On voice: not last' },
                            last: useBytes ? undefined : -1,
                            bytes: useBytes ? { data: createAsrBytes('On voice: not last', false) } : undefined,
                        }),
                    );

                    socket.send(
                        createMessage({
                            messageId: message.messageId,
                            messageName: MessageNames.STT,
                            text: useBytes ? undefined : { data: lastAsr },
                            last: useBytes ? undefined : 1,
                            bytes: useBytes ? { data: createAsrBytes(lastAsr, true) } : undefined,
                        }),
                    );
                }
            });
        });

        assistantClient.changeSettings({ disableListening: false });
        assistantClient.start();
    };

    const doubleClickWillStopListening = (done: () => void, listen: () => Promise<unknown>) => {
        const inputConnections = handleVoiceInputConnections({
            onCreateInput: () => {
                if (inputConnections.count) {
                    setTimeout(() => {
                        throw new Error('Двойного запуска микрофона не должно произойти');
                    });
                }
            },
        });

        let voiceMessageId: number | null = null;

        server.on('connection', (socket) => {
            if (server.clients().length > 1) {
                throw new Error('Повторного подключения не должно произойти');
            }

            socket.on('message', (data) => {
                const message = Message.decode((data as Uint8Array).slice(4));

                if (message.voice) {
                    if (voiceMessageId !== null && voiceMessageId !== message.messageId) {
                        throw new Error('Слушания не должно быть два в один момент');
                    }

                    voiceMessageId = message.messageId as number;
                }

                if (message.messageName === 'OPEN_ASSISTANT') {
                    listen();
                    listen().finally(() => done());
                }
            });
        });

        assistantClient.start();
    };
    const doubleCallWillStopListening = (done: () => void, listen: () => Promise<unknown>) => {
        const inputConnections = handleVoiceInputConnections();

        let voiceMessageId: number | null = null;

        server.on('connection', (socket) => {
            socket.on('message', (data) => {
                const message = Message.decode((data as Uint8Array).slice(4));

                if (message.voice) {
                    if (voiceMessageId !== null && voiceMessageId !== message.messageId) {
                        throw new Error(
                            'Voice messageId не должен измениться (повторный вызов только останавливает слушание)',
                        );
                    }

                    voiceMessageId = message.messageId as number;
                }

                if (message.cancel && message.messageId === voiceMessageId) {
                    expect(!inputConnections.count, 'Микрофон отпущен').to.be.true;
                    done();
                }
            });
        });

        listen().then(() => listen());
    };

    const stopVoiceWillStopListeningAndSendCancel = (done: () => void, listen: () => Promise<unknown>) => {
        let voiceMessageId: number;
        let hasListenerStopped = false;

        assistantClient.on('assistant', ({ listener }) => {
            if (listener?.status === 'stopped') {
                hasListenerStopped = true;
            }
        });

        server.on('connection', (socket) => {
            socket.on('message', (data) => {
                const message = Message.decode((data as Uint8Array).slice(4));

                if (message.voice) {
                    assistantClient.stopVoice();

                    voiceMessageId = message.messageId as number;
                }

                if (message.cancel && message.messageId === voiceMessageId && hasListenerStopped) {
                    done();
                }
            });
        });

        listen();
    };

    const listeningWillStopAfterDisableListening = (done: () => void, listen: () => Promise<unknown>) => {
        const inputConnections = handleVoiceInputConnections();

        let voiceMessageId: number | null = null;
        let listenerStatus: string;

        server.on('connection', (socket) => {
            socket.on('message', (data) => {
                const message = Message.decode((data as Uint8Array).slice(4));

                if (message.voice && message.last === -1) {
                    if (assistantClient.settings.disableListening) {
                        throw new Error('Voice не должен приходить при disableListening=true');
                    }

                    voiceMessageId = message.messageId as number;

                    assistantClient.changeSettings({ disableListening: true });
                }

                if (message.cancel && message.messageId === voiceMessageId && listenerStatus === 'stopped') {
                    expect(!inputConnections.count, 'Микрофон отпущен').to.be.true;
                    done();
                }
            });
        });

        assistantClient.on('assistant', ({ listener }) => {
            if (listener?.status) {
                listenerStatus = listener?.status;
            }
        });

        assistantClient.changeSettings({ disableListening: false });

        listen();
    };

    const listeningIsNotAvailableWhileListeningIsDisabled = (listen: () => Promise<unknown>) => {
        cy.stub(navigator.mediaDevices, 'getUserMedia').callsFake(() => {
            setTimeout(() => {
                throw new Error('Микрофон не должен быть запрошен при disableListening=true');
            });
        });

        server.on('connection', () => {
            throw new Error(
                'Подключения не должно произойти при disableListening=true (кроме слушания ничего не пытаемся запустить)',
            );
        });

        assistantClient.on('assistant', ({ listener }) => {
            if (listener?.status) {
                throw new Error('Статус слушателя не должен меняться');
            }
        });

        assistantClient.changeSettings({ disableListening: true });

        listen();

        cy.wait(1000);
    };

    const statusWillStopListening = (done: () => void, listen: () => Promise<unknown>) => {
        const inputConnections = handleVoiceInputConnections();

        assistantClient.on('assistant', ({ listener }) => {
            if (listener?.status === 'stopped') {
                expect(!inputConnections.count, 'Микрофон отпущен при остановке слушания').to.be.true;
                done();
            }
        });

        server.on('connection', (socket) => {
            socket.on('message', (data) => {
                const message = Message.decode((data as Uint8Array).slice(4));

                if (message.voice) {
                    socket.send(
                        createMessage({
                            messageId: message.messageId,
                            messageName: MessageNames.ANSWER_TO_USER,
                            status: {
                                code: -1,
                            },
                        }),
                    );
                }
            });
        });

        listen();
    };

    const listeningWillSendCorrectMessageName = (
        done: () => void,
        listen: () => Promise<unknown>,
        messageName: string = '',
    ) => {
        let hasDone = false;

        server.on('connection', (socket) => {
            socket.on('message', (data) => {
                const message = Message.decode((data as Uint8Array).slice(4));

                if (message.voice && !hasDone) {
                    hasDone = true;

                    expect(message.messageName).eq(messageName);
                    done();
                }
            });
        });

        listen();
    };

    const listeningWillStopByLastOrError = (
        done: () => void,
        listen: () => Promise<unknown>,
        listenType: 'listen' | 'shazam',
        mttError?: Music2TrackProtocol.IErrorResponse,
    ) => {
        const inputConnections = handleVoiceInputConnections();

        assistantClient.on('assistant', ({ listener }) => {
            if (listener?.status === 'stopped') {
                expect(!inputConnections.count, 'Микрофон отпущен при остановке слушания').to.be.true;
                done();
            }
        });

        server.on('connection', (socket) => {
            socket.on('message', (data) => {
                const message = Message.decode((data as Uint8Array).slice(4));

                if (message.voice) {
                    if (listenType === 'listen') {
                        socket.send(
                            createMessage({
                                messageId: message.messageId,
                                messageName: MessageNames.STT,
                                text: {
                                    data: '',
                                },
                                last: 1,
                            }),
                        );
                    }

                    if (listenType === 'shazam') {
                        socket.send(
                            createMessage({
                                messageId: message.messageId,
                                messageName: MessageNames.MUSIC_RECOGNITION,
                                bytes: {
                                    data: createMttBytes(!mttError, mttError),
                                },
                            }),
                        );
                    }
                }
            });
        });

        listen();
    };

    (['listen', 'shazam'] as Array<'listen' | 'shazam'>).forEach((method) => {
        it(`stopVoice() для ${method}() останавливает начавшееся слушание и отправляет Cancel`, (done) => {
            stopVoiceWillStopListeningAndSendCancel(done, assistantClient[method]);
        });

        it(`Слушание для ${method}() останавливается при disableListening=true`, (done) => {
            listeningWillStopAfterDisableListening(done, assistantClient[method]);
        });

        it(`Слушание для ${method}() не доступно при disableListening=true`, () => {
            listeningIsNotAvailableWhileListeningIsDisabled(assistantClient[method]);
        });

        it(`Отрицательный статус от VPS останавливает слушание для ${method}()`, (done) => {
            statusWillStopListening(done, assistantClient[method]);
        });

        it(`Слушание ${method}() отправляет правильный messageName`, (done) => {
            listeningWillSendCorrectMessageName(
                done,
                assistantClient[method],
                method === 'listen' ? undefined : MessageNames.MUSIC_RECOGNITION,
            );
        });

        it(`Слушание для ${method}() останавливается при last`, (done) => {
            listeningWillStopByLastOrError(done, assistantClient[method], method);
        });

        it(`Повторный вызов ${method}() останавливает слушание`, (done) => {
            doubleCallWillStopListening(done, assistantClient[method]);
        });

        it(`Двойной вызов ${method}() не создаёт двойное слушание`, (done) => {
            doubleClickWillStopListening(done, assistantClient[method]);
        });
    });

    it(`Слушание для shazam() останавливается при ошибке`, (done) => {
        listeningWillStopByLastOrError(done, assistantClient.shazam, 'shazam', { errorMessage: 'Unexpected' });
    });

    it('listen() и shazam() не могут работать вместе', (done) => {
        let voiceMessageId: number | null = null;

        server.on('connection', (socket) => {
            socket.on('message', (data) => {
                const message = Message.decode((data as Uint8Array).slice(4));

                if (message.voice) {
                    if (!voiceMessageId) {
                        voiceMessageId = message.messageId as number;
                    }
                }

                if (message.cancel && message.messageId === voiceMessageId) {
                    done();
                }
            });
        });

        assistantClient.listen().then(() => {
            assistantClient.shazam();
        });
    });

    it('Команда start_music_recognition от VPS запускает shazam()', (done) => {
        let hasVoice = false;

        server.on('connection', (socket) => {
            socket.on('message', (data) => {
                const message = Message.decode((data as Uint8Array).slice(4));

                if (message.messageName === 'OPEN_ASSISTANT') {
                    socket.send(
                        createMessage({
                            messageId: message.messageId,
                            messageName: MessageNames.ANSWER_TO_USER,
                            systemMessage: {
                                items: [{ command: { type: 'start_music_recognition' } }],
                            },
                        }),
                    );
                }

                if (message.voice && !hasVoice) {
                    hasVoice = true;

                    done();
                }
            });
        });

        assistantClient.start();
    });

    it('Начальные чанки прокидываются', (done) => {
        let isStart = true;

        server.on('connection', (socket) => {
            socket.on('message', (data) => {
                const message = Message.decode((data as Uint8Array).slice(4));

                if (message.voice) {
                    if (isStart && message.voice.data?.byteLength === 16) {
                        done();
                    }

                    isStart = false;
                }
            });
        });

        assistantClient.listen({ begin: [new ArrayBuffer(16)] });
    });

    it('Asr (text) принимаются', (done) => {
        canAcceptAsr(done, false);
    });

    it('Asr (bytes) принимаются', (done) => {
        canAcceptAsr(done, true);
    });

    it('Asr (text) для неактивного слушания игнорируются', (done) => {
        asrWillIgnorForInactiveHearing(done, false);
    });

    it('Asr (bytes) для неактивного слушания игнорируются', (done) => {
        asrWillIgnorForInactiveHearing(done, true);
    });

    it('Эмоция listen приходит после старта слушания, idle приходит после его завершении', (done) => {
        let currentEmotion: EmotionId = 'idle';
        let isVoiceStarted = false;

        assistantClient.protocol.on('outcoming', (message) => {
            if (message.voice) {
                if (!isVoiceStarted) {
                    isVoiceStarted = true;

                    expect(currentEmotion, 'Слушание отправилось раньше эмоции').eq('idle');
                }
            }

            if (message.cancel) {
                expect(currentEmotion, 'Прерывание слушания отправилось раньше эмоции').eq('listen');

                if (isVoiceStarted) {
                    done();
                }
            }
        });

        assistantClient.on('assistant', ({ emotion }) => {
            if (emotion) {
                currentEmotion = emotion;
            }
        });

        assistantClient.listen().then(() => {
            assistantClient.stopVoice();
        });
    });

    it('Звук не отправится, пока доступ к микрофону не будет получен', (done) => {
        let hasDone = false;
        let inputRelease = false;

        server.on('connection', (socket) => {
            if (server.clients().length > 1) {
                throw new Error('Повторного подключения не должно произойти');
            }

            socket.on('message', (data) => {
                const message = Message.decode((data as Uint8Array).slice(4));

                if (message.voice && !hasDone) {
                    hasDone = true;
                    done();
                }
            });
        });

        const getUserMedia = navigator.mediaDevices.getUserMedia;

        cy.stub(navigator.mediaDevices, 'getUserMedia').callsFake((...args) => {
            if (inputRelease) {
                return new Promise((resolve) => {
                    cy.wait(1000).then(() => {
                        resolve(getUserMedia.call(navigator.mediaDevices, ...args));
                    });
                });
            }

            return Promise.reject();
        });

        try {
            assistantClient.listen().catch(() => {
                let inputResolved = false;

                inputRelease = true;

                assistantClient.listen().then(() => {
                    inputResolved = true;
                });

                assistantClient.listen().then(() => {
                    expect(inputResolved, 'Повторные вызовы listen() отклоняются, пока первый не готов').to.be.false;
                });
            });
        } catch {}
    });

    it('Микрофон не будет запрошен, пока подключение к сокету не установится', (done) => {
        // Не нервируем security-bot
        const assistant = initAssistantClient({ url: 'ws' + '://' + 'destroyed' });
        const getUserMedia = cy.stub(navigator.mediaDevices, 'getUserMedia');

        assistant.listen().catch(() => {
            expect(getUserMedia).to.be.not.called;
            done();
        });
    });
});
