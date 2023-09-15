/// <reference types="cypress" />

import { AppInfo } from '@salutejs/scenario';

import { createMessage } from '../support/helpers/clientMethods';
import { initAssistantClient, initServer } from '../support/helpers/init';

const webApp: AppInfo = {
    projectId: 'my-app',
    applicationId: 'my-web-app-applicationId',
    appversionId: 'my-app-appversionId',
    frontendType: 'WEB_APP',
};

const dialog: AppInfo = {
    projectId: 'my-app',
    applicationId: 'my-dialog-app-applicationId',
    appversionId: 'my-app-appversionId',
    frontendType: 'DIALOG',
};

const chat: AppInfo = {
    projectId: 'my-app',
    applicationId: 'my-chat-app-applicationId',
    appversionId: 'my-app-appversionId',
    frontendType: 'CHAT_APP',
};

describe('События аппов', () => {
    let server: ReturnType<typeof initServer>;
    let assistantClient: ReturnType<typeof initAssistantClient>;

    beforeEach(() => {
        server = initServer();
        assistantClient = initAssistantClient();
    });

    afterEach(() => {
        server.stop();
    });

    it('WEB_APP не/открывается activate_app_info и не реагирует на finished', (done) => {
        let phase = 1;

        server.on('connection', (socket) => {
            // не откроется
            socket.send(
                createMessage({
                    systemMessage: {
                        activate_app_info: false,
                        app_info: webApp,
                        finished: false,
                    },
                })
            );

            // откроется undefined
            socket.send(
                createMessage({
                    systemMessage: {
                        app_info: {
                            ...webApp,
                            applicationId: `${webApp.applicationId}1`,
                        },
                        finished: true,
                    },
                })
            );

            // откроется true
            socket.send(
                createMessage({
                    systemMessage: {
                        activate_app_info: true,
                        app_info: {
                            ...webApp,
                            applicationId: `${webApp.applicationId}2`,
                        },
                        finished: true,
                    },
                })
            );
        });

        assistantClient.on('app', (event) => {
            if (event.type === 'run') {
                expect(event.app.applicationId).to.be.eq(`${webApp.applicationId}${phase++}`);
                if (phase === 3) {
                    done();
                }
            }
        });

        assistantClient.start();
    });

    it('WEB_APP команды проксируются', (done) => {
        const command = {
            type: 'smart_app_data',
            smart_app_data: { data: 'my_data' },
        };

        server.on('connection', (socket) => {
            socket.send(
                createMessage({
                    systemMessage: {
                        app_info: webApp,
                        items: [{ command }],
                    },
                }),
            );
        });

        assistantClient.on('app', (event) => {
            if (event.type === 'command') {
                delete event.command.sdk_meta;

                expect(event.app, 'event.app is ok').deep.eq(webApp);
                expect(event.command, 'event.command is ok').deep.eq(command);
                done();
            }
        });

        assistantClient.start();
        assistantClient.setActiveApp(webApp);
    });

    it('WEB_APP закрывается по close_app', (done) => {
        server.on('connection', (socket) => {
            socket.on('message', (data) => {
                socket.send(
                    createMessage({
                        systemMessage: {
                            app_info: webApp,
                            items: [
                                { command: { type: 'close_app' } }
                            ]
                        },
                    }),
                );
            });
        });

        assistantClient.on('app', (event) => {
            if (event.type === 'close') {
                expect(event.app.applicationId).to.be.eq(webApp.applicationId);
                done();
            }
        });

        assistantClient.start();
        assistantClient.setActiveApp(webApp);
    });

    it('CHAT_APP и DIALOG не/открываются finished, игнорируют activate_app_info', (done) => {
        let phase = 1;
        server.on('connection', (socket) => {
            // не откроется
            socket.send(
                createMessage({
                    systemMessage: {
                        activate_app_info: true,
                        app_info: dialog,
                        finished: true,
                    },
                })
            );

            // не откроется
            socket.send(
                createMessage({
                    systemMessage: {
                        activate_app_info: true,
                        app_info: chat,
                        finished: true,
                    },
                })
            );

            // откроется
            socket.send(
                createMessage({
                    systemMessage: {
                        activate_app_info: false,
                        app_info: {
                            ...dialog,
                            applicationId: `${dialog.applicationId}1`,
                        },
                    },
                })
            );

            // откроется
            socket.send(
                createMessage({
                    systemMessage: {
                        activate_app_info: false,
                        app_info: {
                            ...chat,
                            applicationId: `${chat.applicationId}2`,
                        },
                    },
                })
            );

            // откроется
            socket.send(
                createMessage({
                    systemMessage: {
                        activate_app_info: false,
                        app_info: {
                            ...dialog,
                            applicationId: `${dialog.applicationId}3`,
                        },
                        finished: false,
                    },
                })
            );

            // откроется
            socket.send(
                createMessage({
                    systemMessage: {
                        activate_app_info: false,
                        app_info: {
                            ...chat,
                            applicationId: `${chat.applicationId}4`,
                        },
                        finished: false,
                    },
                })
            );
        });

        assistantClient.on('app', (event) => {
            if (event.type === 'run') {
                expect(event.app.applicationId).to.be.eq(`${(phase % 2 === 0 ? chat : dialog).applicationId}${phase++}`);
                if (phase === 5) {
                    done();
                }

                return;
            }


            throw new Error(`Unexpected event ${event.type}`)
        });

        assistantClient.start();
    });

    it('CHAT_APP закрывается finished=true', (done) => {
        server.on('connection', (socket) => {
            socket.send(
                createMessage({
                    systemMessage: {
                        app_info: chat,
                        finished: true,
                    },
                })
            );
        });

        assistantClient.on('app', (event) => {
            if (event.type === 'close') {
                expect(event.app.applicationId).to.be.eq(chat.applicationId);
                done();
            }
        });

        assistantClient.start();
        assistantClient.setActiveApp(chat);
    });

    it('DIALOG закрывается finished=true', (done) => {
        server.on('connection', (socket) => {
            socket.send(
                createMessage({
                    systemMessage: {
                        app_info: dialog,
                        finished: true,
                    },
                })
            );
        });

        assistantClient.on('app', (event) => {
            if (event.type === 'close') {
                expect(event.app.applicationId).to.be.eq(dialog.applicationId);
                done();
            }
        });

        assistantClient.start();
        assistantClient.setActiveApp(dialog);
    });
});