/* eslint-disable @typescript-eslint/camelcase */
/// <reference types="cypress" />
import { Server, WebSocket } from 'mock-socket';

import { initProtocol, sendMessage } from '../support/helpers/socket';
import { initServer, initAssistantClient } from '../support/helpers/init';
import { Message } from '../../src/proto';
import type { AssistantSDK } from '../../src/assistantSdk/typings';
import type { AppInfo } from '../../src/typings';

describe('Тест backgroundApps', () => {
    const APPS = [
        {
            projectId: 'test-1-projectId',
            applicationId: 'test-1-applicationId',
            appversionId: 'test-1-appversionId',
            frontendType: 'EMBEDDED_APP',
        },
        {
            projectId: 'test-2-projectId',
            applicationId: 'test-2-applicationId',
            appversionId: 'test-2-appversionId',
            frontendType: 'WEB_APP',
        },
    ] as AppInfo[];

    const getState = () => Promise.resolve({});

    let server: Server;
    let assistantClient: AssistantSDK;

    const onSocketReady = (callback: (socket: WebSocket) => void) => {
        server?.on('connection', (socket) => {
            socket.binaryType = 'arraybuffer';
            initProtocol(socket);
            callback(socket);
        });
    };

    const onSocketMessage = (subscriber: (message: Message) => void) => {
        onSocketReady((socket) => {
            socket.on('message', (message) => {
                subscriber(Message.decode((message as Uint8Array).slice(4)));
            });
        });
    };

    beforeEach(() => {
        server = initServer();
        assistantClient = initAssistantClient();
    });

    afterEach(() => {
        server?.stop();
    });

    it('Аппы добавляются и удаляются. Информация об аппах попадает в исходящую мету', (done) => {
        const backgroundApps = APPS.map((appInfo) => assistantClient.addBackgroundApp({ appInfo, getState }));
        const expectedAppsInfo = [
            { app_info: APPS[0], state: {} },
            { app_info: APPS[1], state: {} },
        ];

        let appRemoved = false;

        onSocketMessage((message) => {
            if (message?.systemMessage?.data && message?.meta?.background_apps) {
                const appsInfo = JSON.parse(message?.meta?.background_apps);

                if (appsInfo.length === expectedAppsInfo.length) {
                    expect(appsInfo).deep.eq(expectedAppsInfo);

                    backgroundApps[0].remove();

                    appRemoved = true;

                    assistantClient.sendText('hello');
                }

                if (appsInfo.length === 1 && appRemoved) {
                    done();
                }
            }
        });

        assistantClient.start();
    });

    it('Подписчики команд навыка добавляются и удаляются', (done) => {
        let commandsEnded = 0;

        const [subscribeTo0, subscribeTo1] = APPS.map((appInfo, index) => {
            const app = assistantClient.addBackgroundApp({ appInfo, getState });

            return () => {
                return app.onCommand(({ smart_app_data }) => {
                    const { appInfo, mustBeReceived, last } = smart_app_data;

                    expect(appInfo).deep.eq(APPS[index]);
                    expect(mustBeReceived).to.be.true;

                    if (last) {
                        commandsEnded += 1;
                    }

                    if (commandsEnded === APPS.length) {
                        done();
                    }
                }).clearSubscribers;
            };
        });

        onSocketReady((socket) => {
            let unsubscribe: () => void;
            let i = 0;

            const sendAppCommand = (appInfo: AppInfo, mustBeReceived = true, last = false) => {
                i += 1;

                sendMessage(socket, i, {
                    systemMessageData: {
                        // eslint-disable-next-line @typescript-eslint/camelcase
                        auto_listening: false,
                        // eslint-disable-next-line @typescript-eslint/camelcase
                        app_info: appInfo,
                        items: [
                            {
                                command: {
                                    type: 'smart_app_data',
                                    smart_app_data: { appInfo, mustBeReceived, last },
                                },
                            },
                        ],
                    },
                });
            };

            subscribeTo1();

            unsubscribe = subscribeTo0();
            sendAppCommand(APPS[0], true);
            sendAppCommand(APPS[0], true);
            sendAppCommand(APPS[1], true);
            unsubscribe();
            sendAppCommand(APPS[1], true);
            sendAppCommand(APPS[0], false);
            unsubscribe = subscribeTo0();
            sendAppCommand(APPS[0], true);
            unsubscribe();
            sendAppCommand(APPS[1], true);
            sendAppCommand(APPS[0], false);
            unsubscribe = subscribeTo0();
            sendAppCommand(APPS[0], true, true);
            unsubscribe();
            sendAppCommand(APPS[1], true, true);
        });

        assistantClient.start();
    });

    it('Сценарий навыка получает свои команды и не получает чужие', (done) => {
        const actionToBackgroundApp = { name: 'Ivan' };
        const actionToCurrentApp = { name: 'Nicolas' };
        const app = assistantClient.addBackgroundApp({ appInfo: APPS[0], getState });

        let receivedCount = 0;

        assistantClient.start();

        onSocketMessage((message) => {
            if (message.systemMessage?.data) {
                const data = JSON.parse(message.systemMessage.data);

                if (data.server_action) {
                    receivedCount += 1;

                    if (data.app_info?.applicationId !== APPS[0].applicationId) {
                        expect(data.server_action).deep.eq(actionToCurrentApp);
                    } else {
                        expect(data.server_action).deep.eq(actionToBackgroundApp);
                    }

                    if (receivedCount === 2) {
                        done();
                    }
                }
            }
        });

        assistantClient.sendServerAction(actionToCurrentApp);
        app.sendServerAction(actionToBackgroundApp);
    });

    it('В VPS отправляется актуальный state навыка', (done) => {
        const appStates = [{ state: 1 }, { state: 2 }, { state: 3 }];

        let appState = appStates[0];
        let callCount = 0;

        onSocketMessage((message) => {
            if (message?.systemMessage?.data && message?.meta?.background_apps) {
                const appsInfo = JSON.parse(message?.meta?.background_apps);

                expect(appsInfo[0].state).deep.eq(appStates[callCount]);

                callCount += 1;

                if (appStates[callCount]) {
                    appState = appStates[callCount];
                    assistantClient.sendServerAction({});
                } else {
                    done();
                }
            }
        });

        assistantClient.addBackgroundApp({
            appInfo: APPS[0],
            getState: () => Promise.resolve(appState),
        });

        assistantClient.start();
    });
});
