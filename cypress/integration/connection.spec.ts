/// <reference types="cypress" />

import { Message } from '../../src/proto';
import { initAssistantClient } from '../support/helpers/init';
// Собственная реализация необходима, так как пакет mock-socket не эмитит событие сокета close на клиенте
import { createFakeWs } from '../support/helpers/createFakeWs';
import { WebSocketMock } from '../support/websocketMock';

describe('Подключение к сокету', () => {
    const initAssistant = ({ checkCertUrl, connect }: { checkCertUrl?: string; connect: () => WebSocket }) => {
        return initAssistantClient({
            checkCertUrl,
            fakeVps: {
                createFakeWS: connect,
            },
        });
    };

    it('Переподключение к сокету при разрыве соединения работает', (done) => {
        const { server, connect } = createFakeWs();
        const assistant = initAssistant({ connect });

        let connectionTimes = 0;

        server.on('connection', (socket) => {
            connectionTimes += 1;

            socket.on('message', (messageOriginal) => {
                const { messageName, text } = Message.decode(messageOriginal as Uint8Array);

                if (messageName === 'OPEN_ASSISTANT') {
                    // В `protocol` установлен таймаут на 500ms, в течении которых сокет считается открытым
                    window.setTimeout(socket.close, 1000);
                }

                if (text?.data === 'reconnect' && connectionTimes === 2) {
                    done();
                }
            });

            socket.on('close', () => {
                assistant.sendText('reconnect');
            });
        });

        assistant.start();
    });

    it('assistant.status возвращает правильные статусы при подключении', (done) => {
        const { server, connect } = createFakeWs();
        const assistant = initAssistant({ connect });

        server.on('connection', (socket) => {
            expect(assistant.status).to.be.equal('connecting');

            socket.on('message', (messageOriginal) => {
                const { messageName } = Message.decode(messageOriginal as Uint8Array);

                if (messageName === 'OPEN_ASSISTANT') {
                    cy.clock();
                    expect(assistant.status).to.be.equal('connected');
                    cy.tick(500)
                        .then(() => {
                            expect(assistant.status).to.be.equal('ready');
                        })
                        .then(() => {
                            socket.close();
                        });
                }
            });

            socket.on('close', () => {
                cy.tick(0).then(() => {
                    expect(assistant.status).to.be.equal('closed');
                    done();
                });
            });
        });

        expect(assistant.status).to.be.equal('closed');

        assistant.start();
    });

    it('При невалидном SSL-сертификате приходит ошибка', (done) => {
        const { server, connect } = createFakeWs();
        const checkCertUrl = 'https://check-cert.ru';

        let errorReceived = false;

        cy.intercept(checkCertUrl, (request) => {
            if (!errorReceived) {
                request.destroy();

                return;
            }

            request.reply('Ok');
        });

        const assistant = initAssistant({ connect, checkCertUrl });

        server.on('connection', (socket) => {
            socket.on('message', (messageOriginal) => {
                const { messageName, text } = Message.decode(messageOriginal as Uint8Array);

                if (messageName === 'OPEN_ASSISTANT') {
                    throw new Error('OPEN_ASSISTANT не должен прийти');
                }

                if (text?.data === 'Connection is ok') {
                    done();
                }
            });
        });

        assistant.on('vps', (event) => {
            // @ts-ignore
            if (event.type === 'error' && event.error?.message === 'Cert authority invalid') {
                if (errorReceived) {
                    throw new Error('Ошибка не должна приходить дважды');
                }

                errorReceived = true;

                assistant.sendText('Connection is ok');
            }
        });

        assistant.start();
    });

    it('reconnect откроет соединение если оно закрыто (3 попытки)', (done) => {
        const assistantClient = initAssistantClient();
        let attempt: number = 0;
        let ws;
        cy.stub(window, 'WebSocket', (url) => {
            attempt++;
            expect(url).to.be.eq('ws://path');

            ws = new WebSocketMock(url);
            setTimeout(() => {
                ws.readyState = WebSocket.CLOSED;
                ws.events.emit('error');
                ws.events.emit('close');
                cy.tick(300 * (attempt - 1));
            });
            return ws;
        });

        cy.clock();
        assistantClient.reconnect();

        /// ожидаем ошибку в конце
        /// и три попытки переподключения
        assistantClient.on('vps', ({ type }) => {
            if (type === 'error') {
                cy.tick(5000)
                expect(attempt).to.be.eq(3);
                done();
            }
        })
    })

    it('reconnect закроет и откроет соедение если оно открыто (3 попытки)', (done) => {
        const assistantClient = initAssistantClient();
        let ws;
        let attempt: number = 0;
        cy.stub(window, 'WebSocket', (url) => {
            attempt++;

            expect(url).to.be.eq('ws://path');
            
            ws = new WebSocketMock(url);
            ws.readyState = WebSocket.OPEN;
            cy.stub(ws, 'close');
            if (attempt === 1) {
                setTimeout(() => {
                    ws.events.emit('open');
                    assistantClient.reconnect();
                    expect(ws.close).to.be.called;
                    ws.events.emit('close');
                });
            } else {
                setTimeout(() => {
                    ws.readyState = WebSocket.CLOSED;
                    ws.events.emit('error');
                    ws.events.emit('close');
                    cy.tick(300 * (attempt - 2));
                });
            }
            return ws;
        });

        cy.clock();
        assistantClient.start();

        /// ожидаем ошибку в конце
        /// и три попытки переподключения (+1 в начале)
        assistantClient.on('vps', ({ type }) => {
            if (type === 'error') {
                cy.tick(5000)
                expect(attempt).to.be.eq(4);
                done();
            }
        })
    });
});
