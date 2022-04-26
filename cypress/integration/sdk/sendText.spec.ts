/// <reference types="cypress" />

import { Server } from 'mock-socket';

import { createAssistantClient } from '../../../src';
import { Message } from '../../../src/proto';

describe('Проверяем отправку текста', () => {
    const configuration = {
        settings: {},
        getToken: () => Promise.resolve(''),
        url: 'ws://path',
        userChannel: '',
        userId: '',
        version: 5,
    };

    const text = 'TEST TEXT';
    let server: Server;
    let assistantClient: ReturnType<typeof createAssistantClient>;
    let onMessage: (message: Message) => void;

    before(() => {
        server = new Server(configuration.url);
        assistantClient = createAssistantClient(configuration);
        assistantClient.start({ disableGreetings: true });
        server.on('connection', (socket) => {
            socket.on('message', (data) => {
                const message = Message.decode((data as Uint8Array).slice(4));
                if (message.initialSettings) {
                    return;
                }

                onMessage?.(message);
            });
        });
    });

    after(() => {
        if (server) {
            server.stop();
        }
    });

    it('Сначала отправляет текст, затем мета', (done) => {
        let step = 0;
        let messageId;
        onMessage = (message) => {
            step++;

            if (typeof messageId === 'undefined') {
                messageId = message.messageId;
            }

            if (message.text) {
                expect(message.messageId, 'messageId совпадают').to.eq(messageId);
                expect(message.text.data, 'Текст заполнен').to.eq(text);
                expect(step === 1, 'Текст отправлен перед метой').be.true;
                expect(message.last, 'last = -1').to.eq(-1);
                return;
            }

            if (message.systemMessage) {
                const data = JSON.parse(message.systemMessage.data);
                expect(message.messageId, 'messageId совпадают').to.eq(messageId);
                expect(data.meta, 'Мета заполнена').be.not.undefined;
                expect(step === 2, 'Мета отправлена после текста').be.true;
                expect(message.last, 'last = 1').to.eq(1);
                done();
            }
        }

        assistantClient.sendText(text);
    });

    it('Отключается озвучка', (done) => {
        let step = 0;
        let messageId;
        onMessage = (message) => {
            step++;

            if (message.settings) {
                if (step === 1) {
                    /// step 1
                    expect(step === 1, 'Озвучка отправлена в начале').to.true;
                    expect(message.settings.dubbing, 'Озвучка выключена').to.eq(-1);
                    expect(message.last, 'Озвучка в отдельном сообщении').to.eq(1);
                } else {
                    /// step 4
                    expect(step === 4, 'Озвучка отправлена в конце').to.true;
                    expect(message.settings.dubbing, 'Озвучка включена').to.eq(1);
                    expect(message.last, 'Озвучка в отдельном сообщении').to.eq(1);
                    done();
                }
                return;
            }

            if (message.text) {
                messageId = message.messageId;
                /// step 2
                expect(step === 2, 'Текст отправлен перед метой').be.true;
                expect(message.text.data, 'Текст заполнен').to.eq(text);
                expect(message.messageId, 'messageId совпадают').to.eq(messageId);
                expect(message.last, 'last = -1').to.eq(-1);
                return;
            }

            if (message.systemMessage) {
                /// step 3
                expect(step === 3, 'Мета отправлена после текста').be.true;

                const data = JSON.parse(message.systemMessage.data);
                expect(data.meta, 'Мета заполнена').be.not.undefined;
                expect(message.messageId, 'messageId совпадают').to.eq(messageId);
                expect(message.last, 'last = 1').to.eq(1);
            }
        }

        assistantClient.sendText(text, true);
    });
});
