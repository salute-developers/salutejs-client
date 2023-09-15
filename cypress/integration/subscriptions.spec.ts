/* eslint-disable camelcase */
/// <reference types="cypress" />

import { ActionCommand } from '@salutejs/scenario';

import { Message } from '../../src/proto';
import { MessageNames } from '../../src/typings';
import { VoiceListenerStatus } from '../../src/assistantSdk/voice/listener/voiceListener';
import { createMessage, createVoiceMessage } from '../support/helpers/clientMethods';
import { initAssistantClient, initServer } from '../support/helpers/init';

describe('Подписки на события', () => {
    let server: ReturnType<typeof initServer>;
    let assistantClient: ReturnType<typeof initAssistantClient>;

    beforeEach(() => {
        server = initServer();
        assistantClient = initAssistantClient();
    });

    afterEach(() => {
        server.stop();
    });

    it('status', (done) => {
        const status = {
            code: -200,
            description: 'its ok',
            technicalDescription: 'its ok',
        };

        server.on('connection', (socket) => {
            socket.on('message', (data) => {
                const message = Message.decode((data as Uint8Array).slice(4));

                if (message.messageName === 'OPEN_ASSISTANT') {
                    socket.send(createMessage({ status }));
                }
            });
        });

        assistantClient.start();

        assistantClient.on('status', (event) => {
            expect(event, 'status is ok').deep.eq(status);
            done();
        });
    });

    it('assistant (asr, listener)', (done) => {
        const asr = 'recognized text';

        let prevListenerStatus: VoiceListenerStatus = 'stopped';
        let eventsCount = 0;

        server.on('connection', (socket) => {
            socket.on('message', (data) => {
                const message = Message.decode((data as Uint8Array).slice(4));

                // Отправка asr
                if (message.voice) {
                    socket.send(
                        createMessage({
                            messageName: MessageNames.STT,
                            messageId: message.messageId,
                            text: {
                                data: asr,
                            },
                        }),
                    );
                }
            });
        });

        assistantClient.on('assistant', (event) => {
            if (prevListenerStatus === 'listen' && event.listener?.status === 'stopped') {
                eventsCount += 1;
                expect(true, 'listener is ok').eq(true);
            }

            if (event.listener) {
                prevListenerStatus = event.listener.status;
            }

            if (event.asr?.text) {
                eventsCount += 1;
                expect(event.asr.text, 'asr is ok').eq(asr);
            }

            if (eventsCount === 2) {
                done();
            }
        });

        assistantClient.start();
        assistantClient.listen();
    });

    it('tts (status)', (done) => {
        let lastTtsStatus: 'start' | 'stop' | null = null;

        server.on('connection', (socket) => {
            socket.on('message', (data) => {
                const message = Message.decode((data as Uint8Array).slice(4));

                if (message.messageName === 'OPEN_ASSISTANT') {
                    socket.send(createVoiceMessage());
                }
            });
        });

        assistantClient.on('tts', ({ status }) => {
            if (status === 'stop' && lastTtsStatus === 'start') {
                done();
            }

            lastTtsStatus = status;
        });

        assistantClient.changeSettings({ disableDubbing: false });
        assistantClient.start();
    });

    it('vps (ready, incoming, outcoming)', (done) => {
        const text = 'lorem';

        let eventsCount = 0;

        server.on('connection', (socket) => {
            socket.on('message', (data) => {
                const message = Message.decode((data as Uint8Array).slice(4));

                if (message.messageName === 'OPEN_ASSISTANT') {
                    socket.send(createMessage({ text: { data: text } }));
                }
            });
        });

        assistantClient.on('vps', (event) => {
            if (event.type === 'outcoming' && event.message.text?.data === text) {
                eventsCount += 1;
                expect(true, 'outcoming is ok').eq(true);
            }

            if (event.type === 'incoming') {
                eventsCount += 1;
                expect(event.originalMessage.text?.data, 'incoming is ok').eq(text);
            }

            if (event.type === 'ready') {
                eventsCount += 1;
                expect(true, 'ready is ok').eq(true);
            }

            if (eventsCount === 3) {
                done();
            }
        });

        assistantClient.start();
        assistantClient.sendText(text);
    });

    it('actionCommand', (done) => {
        const actionCommand: ActionCommand = {
            type: 'action',
            action: {
                type: 'text',
                text: 'message',
            },
        };

        server.on('connection', (socket) => {
            socket.on('message', (data) => {
                const message = Message.decode((data as Uint8Array).slice(4));

                if (message.messageName === 'OPEN_ASSISTANT') {
                    socket.send(
                        createMessage({
                            systemMessage: {
                                items: [
                                    {
                                        command: actionCommand,
                                    },
                                ],
                            },
                        }),
                    );
                }
            });
        });

        assistantClient.on('actionCommand', (event) => {
            expect(event.command, 'actionCommand is ok').deep.eq(actionCommand);
            done();
        });

        assistantClient.start();
    });

    it('command', (done) => {
        const command = {
            type: 'smart_app_data',
            smart_app_data: { data: 'my_data' },
        };

        server.on('connection', (socket) => {
            socket.on('message', (data) => {
                const message = Message.decode((data as Uint8Array).slice(4));

                if (message.messageName === 'OPEN_ASSISTANT') {
                    socket.send(
                        createMessage({
                            systemMessage: {
                                items: [
                                    {
                                        command,
                                    },
                                ],
                            },
                        }),
                    );
                }
            });
        });

        assistantClient.on('command', (event) => {
            expect(event, 'command is ok').deep.eq(command);
            done();
        });

        assistantClient.start();
    });
});
