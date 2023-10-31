import { Server } from 'mock-socket';

import { Message } from '../../src/proto';
import { AppInfo, createAssistantClient, MessageNames } from '../../src';
import { createMessage } from '../support/helpers/clientMethods';
import { initServer, initAssistantClient } from '../support/helpers/init';

describe('Озвучка', () => {
    let server: Server;
    let assistantClient: ReturnType<typeof createAssistantClient>;

    beforeEach(() => {
        server = initServer();
        assistantClient = initAssistantClient();
    });

    afterEach(() => {
        server?.stop();
    });

    it('Событие tts присылает правильную data в event', (done) => {
        const appInfo: AppInfo = {
            frontendType: 'CHAT_APP',
            projectId: 'proj-1',
            applicationId: 'app-1',
            appversionId: 'appver-1',
        };

        let messageId: unknown = null;

        server.on('connection', (socket) => {
            socket.on('message', (data) => {
                const message = Message.decode((data as Uint8Array).slice(4));

                if (message.messageName === 'OPEN_ASSISTANT') {
                    messageId = message.messageId;

                    socket.send(
                        createMessage({
                            messageId: message.messageId,
                            messageName: MessageNames.ANSWER_TO_USER,
                            appendVoice: true,
                            last: -1,
                            systemMessage: {
                                // eslint-disable-next-line camelcase
                                app_info: appInfo,
                            },
                        }),
                    );
                }
            });
        });

        assistantClient.on('tts', ({ status, ...event }) => {
            expect(event, 'Событие tts передаёт правильную информацию').deep.eq({ messageId, appInfo });

            if (status === 'start') {
                window.setTimeout(() => assistantClient.stopTts());
            }

            if (status === 'stop') {
                done();
            }
        });

        assistantClient.changeSettings({ disableDubbing: false });
        assistantClient.start();
    });

    it('Принудительная остановка озвучки отправляет cancel в VPS', (done) => {
        server.on('connection', (socket) => {
            socket.on('message', (data) => {
                const message = Message.decode((data as Uint8Array).slice(4));

                if (message.messageName === 'OPEN_ASSISTANT') {
                    socket.send(
                        createMessage({
                            messageId: message.messageId,
                            messageName: MessageNames.ANSWER_TO_USER,
                            appendVoice: true,
                            last: -1,
                        }),
                    );
                }

                if (message.cancel) {
                    done();
                }
            });
        });

        assistantClient.on('tts', ({ status }) => {
            if (status === 'start') {
                window.setTimeout(() => assistantClient.stopTts());
            }
        });

        assistantClient.changeSettings({ disableDubbing: false });
        assistantClient.start();
    });

    (['listen', 'shazam', 'sendText'] as Array<'listen' | 'shazam' | 'sendText'>).forEach((method) => {
        it(`${method}() останавливает озвучку`, (done) => {
            server.on('connection', (socket) => {
                socket.on('message', (data) => {
                    const message = Message.decode((data as Uint8Array).slice(4));

                    if (message.messageName === 'OPEN_ASSISTANT') {
                        socket.send(
                            createMessage({
                                messageId: message.messageId,
                                messageName: MessageNames.ANSWER_TO_USER,
                                appendVoice: true,
                                last: -1,
                            }),
                        );
                    }
                });
            });

            assistantClient.on('tts', ({ status }) => {
                if (status === 'start') {
                    const params = method === 'sendText' ? 'Lorem' : undefined;

                    // @ts-ignore
                    assistantClient[method](params);
                }

                if (status === 'stop') {
                    done();
                }
            });

            assistantClient.changeSettings({ disableDubbing: false });
            assistantClient.start();
        });
    });

    it('Входящее сообщение не останавливает озвучку', (done) => {
        let ttsStatus: 'start' | 'stop' | null = null;

        server.on('connection', (socket) => {
            socket.on('message', (data) => {
                const message = Message.decode((data as Uint8Array).slice(4));

                if (message.messageName === 'OPEN_ASSISTANT') {
                    socket.send(
                        createMessage({
                            messageId: message.messageId,
                            messageName: MessageNames.ANSWER_TO_USER,
                            appendVoice: true,
                            last: -1,
                        }),
                    );

                    cy.wait(1000).then(() => {
                        socket.send(
                            createMessage({
                                messageId: message.messageId,
                                messageName: MessageNames.ANSWER_TO_USER,
                                text: { data: 'Lorem' },
                                last: 1,
                            }),
                        );
                    });
                }
            });
        });

        assistantClient.on('tts', ({ status }) => {
            ttsStatus = status;
        });

        assistantClient.on('vps', (event) => {
            if (event.type === 'incoming' && event.originalMessage.text?.data) {
                expect(ttsStatus, 'Озвучка продолжается').eq('start');
                done();
            }
        });

        assistantClient.changeSettings({ disableDubbing: false });
        assistantClient.start();
    });

    it('Произвольное сообщение с голосом озвучивается', (done) => {
        server.on('connection', (socket) => {
            cy.wait(1000).then(() => {
                socket.send(
                    createMessage({
                        messageId: 123345567,
                        messageName: MessageNames.ANSWER_TO_USER,
                        appendVoice: true,
                        last: -1,
                    }),
                );
            });
        });

        assistantClient.on('tts', ({ status }) => {
            if (status === 'start') {
                done();
            }
        });

        assistantClient.changeSettings({ disableDubbing: false });
        assistantClient.start();
    });

    it('После disableDubbing=true новый голос накапливается и воспроизведётся после disableDubbing=false', (done) => {
        server.on('connection', (socket) => {
            socket.on('message', (data) => {
                const message = Message.decode((data as Uint8Array).slice(4));

                if (message.messageName === 'OPEN_ASSISTANT') {
                    socket.send(
                        createMessage({
                            messageId: message.messageId,
                            messageName: MessageNames.ANSWER_TO_USER,
                            appendVoice: true,
                            last: 1,
                        }),
                    );
                }
            });
        });

        assistantClient.on('tts', ({ status }) => {
            if (status === 'start' && assistantClient.settings.disableDubbing === false) {
                done();
            }
        });

        assistantClient.on('vps', (event) => {
            if (event.type === 'incoming' && event.originalMessage.voice) {
                assistantClient.changeSettings({ disableDubbing: false });
            }
        });

        assistantClient.changeSettings({ disableDubbing: true });
        assistantClient.start();
    });
});
