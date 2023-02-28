/// <reference types="cypress" />

import { Server } from 'mock-socket';

import { createAssistantClient } from '../../src';
import { MessageNames } from '../../src/typings';
import { Message } from '../../src/proto';
import { createMessage } from '../support/helpers/clientMethods.helpers';

describe('Проверяем изменение настроек озвучки', () => {
    const defaultDubbing = -1;
    const configuration = {
        settings: { dubbing: defaultDubbing },
        getToken: () => Promise.resolve(''),
        url: 'ws://path',
        userChannel: '',
        userId: '',
        version: 5,
    };

    let server: Server;
    let assistantClient: ReturnType<typeof createAssistantClient>;

    beforeEach(() => {
        server = new Server(configuration.url);
        assistantClient = createAssistantClient(configuration);
    });

    afterEach(() => {
        if (server) {
            server.stop();
        }
    });

    it('assistant.stopVoice() останавливает начавшееся слушание и отправляет Cancel', (done) => {
        let voiceMessageId: number;

        server.on('connection', (socket) => {
            socket.on('message', (data) => {
                const message = Message.decode((data as Uint8Array).slice(4));

                if (message.voice) {
                    assistantClient.stopVoice();

                    voiceMessageId = message.messageId as number;
                }

                if (message.cancel && message.messageId === voiceMessageId) {
                    done();
                }
            });
        });

        assistantClient.listen();
    });

    it('Cancel от VPS останавливает слушание', (done) => {
        assistantClient.on('assistant', (event) => {
            if (event.emotion === 'idle') {
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
                            messageName: MessageNames.STT,
                            text: {
                                data: '',
                            },
                            last: 1,
                        }),
                    );
                }
            });
        });

        assistantClient.start();
        assistantClient.listen();
    });
});
