/// <reference types="cypress" />

import { Server } from 'mock-socket';

import { createAssistantClient } from '../../src';
import { MessageNames } from '../../src/typings';
import { Message } from '../../src/proto';
import { createAnswerBuffer } from '../support/helpers/clientMethods.helpers';

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

    it('Cancel от VPS останавливает слушание, Meta приходит', (done) => {
        let voiceMetaMessageId: number;
        let voiceMessageId: number;

        assistantClient.on('assistant', (event) => {
            if (event.emotion === 'idle') {
                expect(voiceMetaMessageId, 'Meta для голоса пришла').eq(voiceMessageId);
                done();
            }
        });

        server.on('connection', (socket) => {
            socket.on('message', (data) => {
                const message = Message.decode((data as Uint8Array).slice(4));

                if (message.systemMessage && message.messageName !== 'OPEN_ASSISTANT') {
                    voiceMetaMessageId = message.messageId as number;
                }

                if (message.voice) {
                    voiceMessageId = message.messageId as number;

                    socket.send(
                        createAnswerBuffer({
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

    it('assistant.stopVoice() предотвращает запуск слушания, которое не успело начаться. Голос, Cancel и Meta не приходят', () => {
        assistantClient.on('assistant', (event) => {
            if (event.listener?.status === 'started') {
                assistantClient.stopVoice();
            }
        });

        server.on('connection', (socket) => {
            socket.on('message', (data) => {
                const message = Message.decode((data as Uint8Array).slice(4));

                if (message.systemMessage && message.messageName !== 'OPEN_ASSISTANT') {
                    throw new Error('Meta не должна была прийти');
                }

                if (message.cancel) {
                    throw new Error('Cancel не должен был прийти');
                }

                if (message.voice && message.last !== 1) {
                    throw new Error('Голос не должен был прийти');
                }
            });
        });

        assistantClient.listen();
        assistantClient.stopVoice();

        // eslint-disable-next-line cypress/no-unnecessary-waiting
        cy.wait(1000);

        assistantClient.listen();
    });
});
