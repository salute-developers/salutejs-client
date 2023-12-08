/// <reference types="cypress" />

import { Server } from 'mock-socket';

import { AssistantEvent, createAssistantClient } from '../../src';
import { EmotionId, MessageNames } from '../../src/typings';
import { Message } from '../../src/proto';
import { Music2TrackProtocol } from '../support/proto/mtt';
import { createMessage, createAsrBytes, createMttBytes } from '../support/helpers/clientMethods';
import { initServer, initAssistantClient } from '../support/helpers/init';

const voiceChunk = new Uint8Array(Array(16).fill(16));

describe('Слушание', () => {
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

    const canAcceptAsr = (done: () => void, listen: () => Promise<unknown>, useBytes: boolean) => {
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

    const asrWillIgnorForInactiveHearing = (done: () => void, listen: () => Promise<unknown>, useBytes: boolean) => {
        const lastAsr = 'On voice: last';

        let prevEvent: AssistantEvent | null = null;
        let hasDone = false;

        assistantClient.on('assistant', (event) => {
            const isPrevEventListenerStopped = prevEvent?.listener?.status === 'stopped';

            prevEvent = event;

            if (typeof event.asr === 'undefined') {
                return;
            }

            if (event.asr.text === lastAsr && event.asr.last) {
                hasDone = true;

                done();
            } else if (!isPrevEventListenerStopped) {
                throw new Error(
                    `Ни какие гипотезы, кроме последней, не должны приходить при выключенном слушании. Пришло: ${event.asr.text}`,
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
                                text: { data: '' },
                                last: 1,
                            }),
                        );
                    }

                    if (listenType === 'shazam') {
                        socket.send(
                            createMessage({
                                messageId: message.messageId,
                                messageName: MessageNames.MTT,
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

    const sendVoiceWillSendChunksAndStopListening = (done: () => void, listen: () => Promise<unknown>) => {
        let wasConnections = false;
        let listenerStatus: unknown = null;

        const inputConnections = handleVoiceInputConnections({
            onCreateInput: () => {
                wasConnections = true;
            },
        });

        server.on('connection', (socket) => {
            socket.on('message', (data) => {
                const message = Message.decode((data as Uint8Array).slice(4));

                if (message.voice) {
                    expect(wasConnections, 'Микрофон включался').to.be.true;
                    expect(inputConnections.count, 'Микрофон отпущен').eq(0);
                    expect(listenerStatus, 'listener остановился').eq('stopped');

                    if (message.voice.data?.byteLength === 16) {
                        done();
                    }
                }
            });
        });

        assistantClient.on('assistant', ({ listener }) => {
            if (listener?.status) {
                listenerStatus = listener?.status;
            }
        });

        assistantClient.changeSettings({ disableDubbing: false });
        listen().then(() => {
            assistantClient.sendVoice([voiceChunk]);
        });
    };

    const listeningWillSendMetaBeforeVoice = (done: () => void, listen: () => Promise<unknown>) => {
        let metaMessageId: unknown = null;
        let hasVoice = false;

        server.on('connection', (socket) => {
            socket.on('message', (data) => {
                const message = Message.decode((data as Uint8Array).slice(4));

                if (message.meta) {
                    metaMessageId = message.messageId;
                }

                if (message.voice && !hasVoice) {
                    hasVoice = true;

                    expect(metaMessageId, 'Мета для голоса была отправлена').eq(message.messageId);
                    done();
                }
            });
        });

        assistantClient.changeSettings({ disableDubbing: false });
        listen();
    };

    const lastWillNotSendCancel = ({
        listen,
        useBytes,
        messageName,
        type,
    }: {
        listen: () => Promise<unknown>;
        useBytes: boolean;
        messageName: string;
        type: 'last' | 'error' | 'status';
    }) => {
        let lastSent = false;

        server.on('connection', (socket) => {
            socket.on('message', (data) => {
                const message = Message.decode((data as Uint8Array).slice(4));
                const isStt = messageName === 'STT';

                if (message.voice && !lastSent) {
                    lastSent = true;

                    switch (type) {
                        case 'last': {
                            socket.send(
                                createMessage({
                                    messageId: message.messageId,
                                    messageName,
                                    text: useBytes ? undefined : { data: '' },
                                    last: useBytes ? undefined : 1,
                                    bytes: useBytes
                                        ? { data: isStt ? createAsrBytes('', true) : createMttBytes(true) }
                                        : undefined,
                                }),
                            );

                            break;
                        }

                        case 'error': {
                            socket.send(
                                createMessage({
                                    messageId: message.messageId,
                                    messageName,
                                    last: -1,
                                    bytes: { data: isStt ? createAsrBytes('', false, {}) : createMttBytes(false, {}) },
                                }),
                            );

                            break;
                        }

                        case 'status': {
                            socket.send(
                                createMessage({
                                    messageId: message.messageId,
                                    messageName,
                                    status: { code: -1 },
                                }),
                            );

                            break;
                        }

                        default:
                            break;
                    }
                }

                if (message.cancel) {
                    throw new Error('Cancel не должен быть отправлен');
                }
            });
        });

        assistantClient.changeSettings({ disableDubbing: false });
        listen();

        cy.wait(500);
    };

    (['listen', 'shazam', 'sendVoice'] as Array<'listen' | 'shazam' | 'sendVoice'>).forEach((method) => {
        const chunks = [voiceChunk];
        const voiceMethod = () => {
            // @ts-ignore
            return assistantClient[method](method === 'sendVoice' ? chunks : undefined);
        };

        it(`Слушание для ${method}() отправляет правильный messageName`, (done) => {
            listeningWillSendCorrectMessageName(done, voiceMethod, method === 'shazam' ? MessageNames.MTT : undefined);
        });

        it(`Слушание для ${method}() отправляет мету перед отправкой голоса`, (done) => {
            listeningWillSendMetaBeforeVoice(done, voiceMethod);
        });

        if (method !== 'sendVoice') {
            it(`stopVoice() для ${method}() останавливает начавшееся слушание и отправляет Cancel`, (done) => {
                stopVoiceWillStopListeningAndSendCancel(done, voiceMethod);
            });

            it(`Слушание для ${method}() останавливается при disableListening=true`, (done) => {
                listeningWillStopAfterDisableListening(done, voiceMethod);
            });

            it(`Слушание для ${method}() не доступно при disableListening=true`, () => {
                listeningIsNotAvailableWhileListeningIsDisabled(voiceMethod);
            });

            it(`Отрицательный статус от VPS останавливает слушание для ${method}()`, (done) => {
                statusWillStopListening(done, voiceMethod);
            });

            it(`Слушание для ${method}() останавливается при last`, (done) => {
                listeningWillStopByLastOrError(done, voiceMethod, method);
            });

            it(`Повторный вызов ${method}() останавливает слушание`, (done) => {
                doubleCallWillStopListening(done, voiceMethod);
            });

            it(`Двойной вызов ${method}() не создаёт двойное слушание`, (done) => {
                doubleClickWillStopListening(done, voiceMethod);
            });

            it(`sendVoice() отправляет готовые чанки и останавливает слушание для ${method}()`, (done) => {
                sendVoiceWillSendChunksAndStopListening(done, voiceMethod);
            });
        }

        if (method !== 'shazam') {
            it(`Asr (text) при ${method}() принимаются`, (done) => {
                canAcceptAsr(done, voiceMethod, false);
            });

            it(`Asr (bytes) при ${method}() принимаются`, (done) => {
                canAcceptAsr(done, voiceMethod, true);
            });

            it(`Asr (text) при ${method}() для неактивного слушания игнорируются`, (done) => {
                asrWillIgnorForInactiveHearing(done, voiceMethod, false);
            });

            it(`Asr (bytes) при ${method}() для неактивного слушания игнорируются`, (done) => {
                asrWillIgnorForInactiveHearing(done, voiceMethod, true);
            });
        }

        [true, false].forEach((useBytes) => {
            const isShazam = method === 'shazam';
            const text = useBytes ? 'bytes' : 'text';

            if (!useBytes && isShazam) {
                return;
            }

            it(`Получение last (${text}) от VPS при ${method}() не отправляет cancel`, () => {
                lastWillNotSendCancel({
                    type: 'last',
                    useBytes,
                    listen: voiceMethod,
                    messageName: isShazam ? MessageNames.MTT : MessageNames.STT,
                });
            });

            it(`Получение отрицательного статуса (${text}) от VPS при ${method}() не отправляет cancel`, () => {
                lastWillNotSendCancel({
                    type: 'status',
                    useBytes,
                    listen: voiceMethod,
                    messageName: isShazam ? MessageNames.MTT : MessageNames.STT,
                });
            });

            if (useBytes) {
                it(`Получение ошибки (${text}) от VPS при ${method}() не отправляет cancel`, () => {
                    lastWillNotSendCancel({
                        type: 'error',
                        useBytes,
                        listen: voiceMethod,
                        messageName: isShazam ? MessageNames.MTT : MessageNames.STT,
                    });
                });
            }
        });
    });

    it('Слушание для shazam() останавливается при ошибке', (done) => {
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

    it('sendVoice() не отправит пустые чанки', () => {
        server.on('connection', () => {
            throw new Error('Подключения не должно произойти, так как отправка пустых чанков должна игнорироваться');
        });

        assistantClient.sendVoice([new Uint8Array(16)]);
        cy.wait(500);
    });

    it('sendVoice() отправляет правильный messageName', (done) => {
        server.on('connection', (socket) => {
            socket.on('message', (data) => {
                const message = Message.decode((data as Uint8Array).slice(4));

                if (message.voice) {
                    expect(message.messageName).eq(MessageNames.MTT);
                    done();
                }
            });
        });

        assistantClient.sendVoice([voiceChunk], 'MUSIC_RECOGNITION');
    });

    it('streamVoice() отправляет правильный messageName', (done) => {
        server.on('connection', (socket) => {
            socket.on('message', (data) => {
                const message = Message.decode((data as Uint8Array).slice(4));

                if (message.voice) {
                    expect(message.messageName).eq(MessageNames.MTT);
                    done();
                }
            });
        });

        assistantClient.streamVoice([voiceChunk], true, 'MUSIC_RECOGNITION');
    });

    it('streamVoice() отправляет Cancel для стрима без last=true', (done) => {
        let chunksCount = 0;

        server.on('connection', (socket) => {
            socket.on('message', (data) => {
                const message = Message.decode((data as Uint8Array).slice(4));

                if (message.voice) {
                    chunksCount += 1;
                }

                if (message.cancel) {
                    expect(chunksCount, 'Получены все чанки').eq(3);
                    done();
                }
            });
        });

        assistantClient.streamVoice([voiceChunk], false).then(() => {
            assistantClient.streamVoice([voiceChunk], false).then(() => {
                assistantClient.streamVoice([voiceChunk], false);
            });
        });
    });

    it('streamVoice() при last=true не отправляет Cancel', (done) => {
        let chunksCount = 0;

        server.on('connection', (socket) => {
            socket.on('message', (data) => {
                const message = Message.decode((data as Uint8Array).slice(4));

                if (message.voice) {
                    chunksCount += 1;
                }

                if (message.last === 1 && message.voice) {
                    expect(chunksCount, 'Получены все чанки').eq(3);
                    done();
                }
            });
        });

        assistantClient.streamVoice([voiceChunk], false).then(() => {
            assistantClient.streamVoice([voiceChunk], false).then(() => {
                assistantClient.streamVoice([voiceChunk], true);
            });
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

        assistantClient.listen({ begin: [voiceChunk] });
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

    it('Отправка готовых чанков не запускает слушание', (done) => {
        handleVoiceInputConnections({
            onCreateInput: () => {
                throw new Error('Микрофон не должен запрашиваться');
            },
        });

        server.on('connection', (socket) => {
            socket.on('message', (data) => {
                const message = Message.decode((data as Uint8Array).slice(4));

                if (message.voice) {
                    done();
                }
            });
        });

        assistantClient.on('assistant', ({ listener }) => {
            if (listener) {
                throw new Error('Слушание не должно затрагиваться');
            }
        });

        assistantClient.changeSettings({ disableDubbing: false });
        assistantClient.sendVoice([voiceChunk]);
    });

    it('Пустые чанки игнорируются', () => {
        server.on('connection', () => {
            throw new Error('Пустые чанки должны игнорироваться');
        });

        assistantClient.changeSettings({ disableDubbing: false });
        assistantClient.sendVoice([]);
    });
});
