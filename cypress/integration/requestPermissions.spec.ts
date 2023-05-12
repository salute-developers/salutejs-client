/// <reference types="cypress" />

import { Server } from 'mock-socket';
import { AppInfo, PermissionType, PermissionStatus } from '../../src';
import { Message } from '../../src/proto';
import { sendMessage } from '../support/helpers/socket.helpers';
import { initServer, initAssistantClient } from '../support/helpers/init';

describe('Проверяем запросы доступов', () => {
    const appInfo: AppInfo = {
        projectId: 'test_projectId',
        applicationId: 'test_applicationId',
        appversionId: 'test_appversionId',
        frontendType: 'WEB_APP',
    }

    const currentPosition = { coords: { latitude: 1.1, longitude: 2.2, accuracy: 1.0 }, time: 'test' };
    let getCurrentPosition = (_, reject) => { reject() };

    let server: Server;

    const buildResponseServerAction = ({ messageId, permissions = [], status = 'granted' }: { messageId: number, permissions: PermissionType[], status?: PermissionStatus }) => ({
        action_id: 'command_response',
        request_message_id: messageId,
        command_response: {
            request_permissions: {
                permissions: permissions.map(perm => ({ type: perm, status }))
            }
        }
    });

    beforeEach(() => {
        server = initServer();
        cy.stub(window.navigator.geolocation, 'getCurrentPosition').callsFake((resolve, reject) => {
            return getCurrentPosition(resolve, reject);
          });
    });

    afterEach(() => {
        server?.stop();
    });
    
    it('geo', (done) => {
        // 0 - доступ закрыт
        // 1 - доступ предоставлен
        let phase = 0;

        server.on('connection', (socket) => {
            assert.isOk('Соединение после старта');

            socket.on('message', (data) => {
                const message = Message.decode((data as Uint8Array).slice(4));

                if (message.messageName === 'SERVER_ACTION') {
                    const data = JSON.parse(message.systemMessage?.data || '{}');

                    expect(JSON.parse(message.meta?.current_app || '{}').app_info?.systemName, 'в current_app текущий апп').to.eq('assistant');
                    expect(data.app_info, 'в systemMessage appInfo из запроса').to.deep.eq(appInfo);

                    switch(phase) {
                        case 0: // в доступе отказано
                            expect(message.meta.location, 'location не заполнен в meta').to.be.undefined;
                            expect(data.server_action, 'Ответ заполнен').to.deep.eq(buildResponseServerAction({ messageId: 1, permissions: ['geo'], status: 'denied_permanently' }));

                            phase = 1;
                            getCurrentPosition = (cb) => cb(currentPosition);
                            assert.isOk('Отправлен запрос геопозиции 2');
                            sendMessage(socket, 2, { systemMessageData: {
                                app_info: appInfo,
                                auto_listening: false,
                                items: [{
                                    command: {
                                        type: 'request_permissions',
                                        permissions: ['geo'],
                                    }
                                }],
                            } });
                            break;
                        default: // доступ предоставлен
                            expect(JSON.parse(message.meta?.location || '{}'), 'координаты совпадают').to.deep.eq({ lat: currentPosition.coords.latitude, lon: currentPosition.coords.longitude, accuracy: currentPosition.coords.accuracy });
                            expect(data.server_action, 'Ответ заполнен').to.deep.eq(buildResponseServerAction({ messageId: 2, permissions: ['geo'] }));
                            done();
                        break;
                    }
                }
            });

            assert.isOk('Отправлен запрос геопозиции 1');
            sendMessage(socket, 1, { systemMessageData: {
                app_info: appInfo,
                auto_listening: false,
                items: [{
                    command: {
                        type: 'request_permissions',
                        permissions: ['geo'],
                    }
                }],
            } });
        })

        const assistantClient = initAssistantClient({ settings: {} });
        assistantClient.reconnect();
    });

    (['read_contacts', 'record_audio', 'push'] as PermissionType[]).map((type: PermissionType) => {
        it(type, (done) => {
            server.on('connection', (socket) => {
                assert.isOk('Соединение после старта');
    
                socket.on('message', (data) => {
                    const message = Message.decode((data as Uint8Array).slice(4));
    
                    if (message.messageName === 'SERVER_ACTION') {
                        const data = JSON.parse(message.systemMessage?.data || '{}');
                        expect(JSON.parse(message.meta?.current_app || '{}').app_info?.systemName, 'в current_app текущий апп').to.eq('assistant');
                        expect(data.app_info, 'в systemMessage appInfo из запроса').to.deep.eq(appInfo);
                        expect(data.server_action, 'Ответ заполнен').to.deep.eq(buildResponseServerAction({ messageId: 1, permissions: [type], status: 'denied_permanently' }));
                        done();
                    }
                });

                sendMessage(socket, 1, { systemMessageData: {
                    app_info: appInfo,
                    auto_listening: false,
                    items: [{
                        command: {
                            type: 'request_permissions',
                            permissions: [type],
                        }
                    }],
                } });
            });

            const assistantClient = initAssistantClient({ settings: {} });
            assistantClient.reconnect();
        });
    });
});