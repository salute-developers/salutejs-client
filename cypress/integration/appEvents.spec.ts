/// <reference types="cypress" />

import { AppInfo } from '@salutejs/scenario';

import { createMessage } from '../support/helpers/clientMethods';
import { initAssistantClient, initServer } from '../support/helpers/init';

const DEFAULT_APPLICATION_ID = '7c4e23bf-cd93-b57e-874b-d9fc1b35f93d';

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

    it('WEB_APP не/открывается activate_app_info', (done) => {
        let phase = 1;

        server.on('connection', (socket) => {
            // не откроется
            socket.send(
                createMessage({
                    systemMessage: {
                        activate_app_info: false,
                        app_info: webApp,
                    },
                }),
            );

            // откроется undefined
            socket.send(
                createMessage({
                    systemMessage: {
                        app_info: {
                            ...webApp,
                            applicationId: `${webApp.applicationId}1`,
                        },
                    },
                }),
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
                    },
                }),
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
        let phase = 1;

        server.on('connection', (socket) => {
            socket.on('message', () => {
                socket.send(
                    createMessage({
                        systemMessage: {
                            app_info: webApp,
                            items: [{ command: { type: 'close_app' } }],
                        },
                    }),
                );

                assistantClient.setActiveApp(webApp);

                socket.send(
                    createMessage({
                        systemMessage: {
                            app_info: webApp,
                            items: [{ command: { type: 'close_app' } }],
                        },
                    }),
                );
            });
        });

        assistantClient.on('app', (event) => {
            if (event.type === 'close') {
                expect(
                    event.app.applicationId,
                    phase === 1 ? 'вызывается для неактивного аппа' : 'вызывается для активного аппа',
                ).to.be.eq(webApp.applicationId);
                if (++phase === 2) {
                    done();
                }
            }
        });

        assistantClient.start();
    });

    it('DIALOG открывает assistant', (done) => {
        let phase = 1;

        server.on('connection', (socket) => {
            // не откроется
            socket.send(
                createMessage({
                    systemMessage: {
                        app_info: dialog,
                    },
                }),
            );

            // открывается чатапп
            socket.send(
                createMessage({
                    systemMessage: {
                        app_info: chat,
                    },
                }),
            );

            assistantClient.setActiveApp(chat);

            // открывается assistant
            socket.send(
                createMessage({
                    systemMessage: {
                        app_info: dialog,
                    },
                }),
            );

            // открыается канвас
            socket.send(
                createMessage({
                    systemMessage: {
                        app_info: webApp,
                    },
                }),
            );

            assistantClient.setActiveApp(webApp);

            // открывается assistant
            socket.send(
                createMessage({
                    systemMessage: {
                        app_info: dialog,
                    },
                }),
            );
        });

        assistantClient.on('app', (event) => {
            if (event.type === 'run') {
                switch (phase) {
                    case 1:
                        expect(event.app.applicationId).to.be.eq(chat.applicationId);
                        break;
                    case 2:
                        expect(event.app.applicationId).to.be.eq(DEFAULT_APPLICATION_ID);
                        break;
                    case 3:
                        expect(event.app.applicationId).to.be.eq(webApp.applicationId);
                        break;
                    case 4:
                        expect(event.app.applicationId).to.be.eq(DEFAULT_APPLICATION_ID);
                        done();
                        break;
                }
                phase++;

                return;
            }

            throw new Error(`Unexpected event ${event.type}`);
        });

        assistantClient.start();
    });

    it('DIALOG close_app не вызывает close', (done) => {
        server.on('connection', (socket) => {
            socket.send(
                createMessage({
                    systemMessage: {
                        app_info: dialog,
                        items: [
                            {
                                command: { type: 'close_app' },
                            },
                        ],
                    },
                }),
            );

            done();
        });

        assistantClient.on('app', () => {
            throw new Error('Unexpected event');
        });

        assistantClient.start();
    });

    it('CHAT_APP открывается', (done) => {
        server.on('connection', (socket) => {
            // не откроется повторно
            socket.send(
                createMessage({
                    systemMessage: {
                        app_info: chat,
                    },
                }),
            );

            assistantClient.closeApp();

            // откроется с activate_app_info=false
            socket.send(
                createMessage({
                    systemMessage: {
                        activate_app_info: false,
                        app_info: {
                            ...chat,
                            applicationId: `${chat.applicationId}1`,
                        },
                    },
                }),
            );
        });

        assistantClient.on('app', (event) => {
            if (event.type === 'run') {
                expect(event.app.applicationId).to.be.eq(`${chat.applicationId}1`);
                done();
            }
        });

        assistantClient.start();
        assistantClient.setActiveApp(chat);
    });

    it('CHAT_APP закрывается по closeApp', (done) => {
        let phase = 1;

        server.on('connection', (socket) => {
            socket.send(
                createMessage({
                    systemMessage: {
                        app_info: chat,
                        items: [
                            {
                                command: { type: 'close_app' },
                            },
                        ],
                    },
                }),
            );

            assistantClient.setActiveApp(chat);

            socket.send(
                createMessage({
                    systemMessage: {
                        app_info: chat,
                        items: [
                            {
                                command: { type: 'close_app' },
                            },
                        ],
                    },
                }),
            );
        });

        assistantClient.on('app', (event) => {
            if (event.type === 'close') {
                expect(
                    event.app.applicationId,
                    phase === 1 ? 'вызывается для неактивного аппа' : 'вызывается для активного аппа',
                ).to.be.eq(chat.applicationId);
                if (++phase === 2) {
                    done();
                }
            }
        });

        assistantClient.start();
    });
});
