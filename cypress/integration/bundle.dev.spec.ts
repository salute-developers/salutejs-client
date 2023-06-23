/* eslint-disable camelcase */
/// <reference types="cypress" />

import { createFakeWs } from '../support/helpers/createFakeWs';
import { createMessage } from '../support/helpers/clientMethods.helpers';
import { Message } from '../../src/proto';
import { AppInfo } from '../../src';

const canvases = {
    ESM: 'cypress/fixtures/canvas.dev.esm.html',
    UMD: 'cypress/fixtures/canvas.dev.umd.html',
};

describe('Тест DEV-сборки', () => {
    Object.entries(canvases).forEach(([bundleType, canvasUrl]) => {
        describe(bundleType, () => {
            const initPhrase = 'Хочу попкорн';

            it('Сообщения из канваса приходят в VPS', (done) => {
                const { server, connect } = createFakeWs();
                const helloText = 'Hello, SDK team!';

                server.on('connection', (socket) => {
                    socket.on('message', (messageOriginal) => {
                        // @ts-ignore
                        const { text } = Message.decode(messageOriginal.slice(4) as Uint8Array);

                        if (text?.data === helloText) {
                            done();
                        }
                    });
                });

                cy.visit(canvasUrl).then((canvasWindow) => {
                    // @ts-ignore
                    canvasWindow.Canvas.createAssistantDev({ initPhrase, createFakeWS: connect });

                    // delay нужен, так как рендер не успевает обновлять инпут
                    cy.get('input[id=voice]').clear().type(`${helloText}{enter}`, { delay: 20 });
                });
            });

            it('Сообщения от VPS приходят в канвас', (done) => {
                const { server, connect } = createFakeWs();
                const app_info = {} as AppInfo;
                const navigation = { type: 'navigation', navigation: { command: 'MY_COMMAND' } };

                server.on('connection', (socket) => {
                    socket.on('message', (messageOriginal) => {
                        // @ts-ignore
                        const { messageId, text } = Message.decode(messageOriginal.slice(4) as Uint8Array);

                        if (text?.data === initPhrase) {
                            socket.send(
                                createMessage({
                                    messageId,
                                    systemMessage: {
                                        app_info,
                                        items: [{ command: navigation }],
                                    },
                                }),
                            );

                            window.setTimeout(() => {
                                socket.send(
                                    createMessage({
                                        systemMessage: {
                                            app_info,
                                            items: [{ command: navigation }],
                                        },
                                    }),
                                );
                            });
                        }
                    });
                });

                cy.visit(canvasUrl).then((canvasWindow) => {
                    // @ts-ignore
                    const assistant = canvasWindow.Canvas.createAssistantDev({ initPhrase, createFakeWS: connect });

                    assistant.on('data', (data) => {
                        if (data?.navigation?.command === navigation.navigation.command) {
                            done();
                        }
                    });
                });
            });
        });
    });
});
