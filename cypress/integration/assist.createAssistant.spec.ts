/* eslint-disable camelcase */
/// <reference types="cypress" />

import { createAssistant } from 'lib';
import { Hints, Suggestions } from '@salutejs/scenario';

import { SystemMessageHeaderByttonsType, createAssistant as createAssistantT } from '../../src/index';

declare type createAssistant = typeof createAssistantT;

describe('Проверяем createAssistant', () => {
    beforeEach(() => {
        window.appInitialData = [];
        window.__ASSISTANT_CLIENT__ = {};
        window.AssistantHost = {
            close: cy.stub(),
            ready: () => window.AssistantClient?.onStart(),
            setSuggests: cy.stub(),
            setHints: cy.stub(),
            setHeaderButtons: cy.stub(),
        };
    });

    afterEach(() => {
        delete window.AssistantHost;
    });

    const state = {};
    const recoveryState = {};
    const action = { action_id: 'test_action' };
    const messageName = 'TEST_ACTION';
    const requestId = 'TEST-0001';
    const getState = () => state;
    const getRecoveryState = () => recoveryState;
    const initAssistant = (params = {}) => createAssistant({ getState, getRecoveryState, ...params });
    const commandsTypes = [
        'smart_app_data',
        'smart_app_error',
        'app_context',
        'theme',
        'character',
        'navigation',
        'visibility',
        'insets',
        'dynamic_insets',
        'minimum_static_insets',
        'maximum_static_insets',
        'tts_state_update',
    ];
    const initialData = [
        { type: 'character', character: { id: 'sber' }, sdk_meta: { mid: '-1' } },
        { type: 'insets', insets: { left: 0, top: 0, right: 0, bottom: 144 }, sdk_meta: { mid: '-1' } },
        { type: 'smart_app_data', smart_app_data: { command: 'TEST_COMMAND' }, sdk_meta: { mid: '123456' } },
    ];

    const expectSendData = (
        assistant: ReturnType<typeof createAssistant>,
        expectedAction: any,
        expectedName: string | null,
    ) =>
        new Promise((resolve) => {
            window.AssistantHost.sendData = (act: string, name: string | null) => {
                expect(act).not.undefined;
                expect(act).not.empty;
                expect(expectedAction).to.deep.equal(JSON.parse(act));

                if (expectedName) {
                    expect(expectedName).to.equal(name);
                } else {
                    expect(name).null; // отправляем null, вместо undefined
                }

                resolve(undefined);
            };

            assistant.sendData({ action: expectedAction, name: expectedName });
        });

    const expectSendDataContainer = (
        assistant: ReturnType<typeof createAssistant>,
        expectedAction: any,
        expectedName?: string,
        expectedRequestId?: string,
    ) =>
        new Promise((resolve) => {
            window.AssistantHost.sendData = cy.stub();
            window.AssistantHost.sendDataContainer = (container: string) => {
                const { data, message_name, requestId: reqId } = JSON.parse(container);

                expect(expectedAction).to.deep.equal(data);
                expect(expectedRequestId).to.equal(reqId);
                if (expectedName) {
                    expect(expectedName).to.equal(message_name);
                } else {
                    expect(message_name).empty; // отправляем пустую строку, вместо undefined
                }

                resolve(undefined);
            };

            assistant.sendData({ action: expectedAction, name: expectedName, requestId: expectedRequestId });
        });

    it('Проверяем автовызов AssistantHost.ready', async () => {
        cy.spy(window.AssistantHost, 'ready');
        initAssistant();
        await new Promise((resolve) => setTimeout(resolve));
        expect(window.AssistantHost.ready).to.calledOnce;
    });

    it('Проверяем вызов ready вручную', async () => {
        cy.spy(window.AssistantHost, 'ready');
        const assistant = initAssistant({ ready: false });
        await new Promise((resolve) => setTimeout(resolve));
        expect(window.AssistantHost.ready).to.not.called;
        assistant.ready();
        expect(window.AssistantHost.ready).to.calledOnce;
    });

    it('Проверяем getState и getRecoveryState', () => {
        const assistant = initAssistant();
        const newState = {};
        const newRecoveryState = {};
        // assistantClient должен возвращать state из конструктора
        expect(window.AssistantClient.onRequestState()).to.equal(state);
        // assistantClient должен возвращать recoveryState из конструктора
        expect(window.AssistantClient.onRequestRecoveryState()).to.equal(recoveryState);

        assistant.setGetState(() => newState);
        assistant.setGetRecoveryState(() => newRecoveryState);
        // assistantClient должен возвращать newState
        expect(window.AssistantClient.onRequestState()).to.equal(newState);
        // assistantClient должен возвращать newRecoveryState
        expect(window.AssistantClient.onRequestRecoveryState()).to.equal(newRecoveryState);
    });

    it('Проверяем sendData', (done) => {
        const assistant = initAssistant();

        expectSendData(assistant, action, null)
            .then(() => expectSendData(assistant, action, messageName))
            .then(() => expectSendDataContainer(assistant, action))
            .then(() => expectSendDataContainer(assistant, action, messageName))
            .then(() => expectSendDataContainer(assistant, action, messageName, requestId))
            .then(() => expectSendDataContainer(assistant, action, undefined, requestId))
            .then(done);
    });

    it('Проверяем sendData c подпиской на ответ', (done) => {
        const status = { first: false, second: false };
        const requestId = '654321';
        const action = { action_id: 'test_action' };
        const command = { type: 'smart_app_data', smart_app_data: { command: 'test_cmd' } };
        const assistant = initAssistant();

        // ожидаем исключение, если sendDataContainer не определен
        window.AssistantHost.sendDataContainer = undefined;
        expect(() => assistant.sendDataWithAnswer({ action })).to.throw();

        // не передаем requestId, ожидаем ответ
        window.AssistantHost.sendDataContainer = (data) => {
            const { requestId: reqId } = JSON.parse(data);
            setTimeout(() => window.AssistantClient.onData({ ...command, sdk_meta: { requestId: reqId } }));
        };
        assistant.sendData({ action }, ({ sdk_meta, ...cmd }) => {
            expect(cmd).to.deep.equal(command);
            status.first = true;
            if (status.second) {
                done();
            }
        });

        // передаем requestId, ожидаем ответ
        assistant.sendData({ action, requestId }, ({ sdk_meta, ...cmd }) => {
            expect(cmd).to.deep.equal(command);
            expect(sdk_meta?.requestId).to.equal(requestId);
            status.second = true;
            if (status.first) {
                done();
            }
        });
    });

    it('Проверяем подписку на события ассистента', () => {
        const onStart = cy.stub();
        const onData = cy.stub();
        const command = { smart_app_data: { command: 'test_command' }, type: 'smart_app_command' };
        const assistant = initAssistant();
        assistant.on('start', onStart);
        assistant.on('data', onData);

        window.AssistantClient.onStart();
        expect(onStart).to.calledOnce;

        window.AssistantClient.onData(command);
        expect(onData).to.calledWith(command);
    });

    it('Проверяем проксирование close', () => {
        const assistant = initAssistant();
        assistant.close();
        expect(window.AssistantHost.close).to.calledOnce;
    });

    it('Проверяем проксирование и преобразование данных в setSuggests', () => {
        const suggests: Suggestions['buttons'] = [{ title: 'test', action: { type: 'text', text: 'test' } }];
        const assistant = initAssistant();
        assistant.setSuggests(suggests);
        expect(window.AssistantHost.setSuggests).to.calledWith(JSON.stringify({ suggestions: { buttons: suggests } }));
    });

    it('Проверяем проксирование и преобразование данных в setHints', () => {
        const hints: Hints = { items: [{ text: 'test', alive_time: 0, next_time: 0 }] };
        const assistant = initAssistant();
        assistant.setHints(hints);
        expect(window.AssistantHost.setHints).to.calledWith(JSON.stringify({ hints }));
    });

    it('Проверяем проксирование и преобразование данных в setHeaderButtons', () => {
        const headerButtons: SystemMessageHeaderByttonsType = [
            {
                icon_address: {
                    type: 'url',
                    hash: '1add19855fcd158ece0fd52c7fb13750',
                    url: 'https://cdn.sberdevices.ru/VA/images/prime/okko.png',
                },
                actions: [
                    {
                        type: 'deep_link',
                        deep_link: 'https://ru.wikipedia.org/wiki/Ривз,_Киану',
                    },
                ],
            },
        ];
        const assistant = initAssistant();
        assistant.setHeaderButtons(headerButtons);
        expect(window.AssistantHost.setHeaderButtons).to.calledWith(headerButtons);
    });

    it("Проверяем фильтрацию system.command = 'back' - не должна попадать в onData", () => {
        const onData = cy.stub();

        initAssistant();
        window.AssistantClient.onStart();
        window.AssistantClient.onData({ type: 'system', system: { command: 'BACK' } });

        expect(onData).to.not.called;
    });

    it('Эмитить appInitialData в onData, не пропускать дубли от натива (апп не прочитал appInitialData)', () => {
        window.appInitialData = [...initialData];
        window.AssistantHost.ready = () => {
            initialData.forEach((command) => window.AssistantClient.onData(command));
            window.AssistantClient?.onStart();
        };

        const onData = cy.stub();
        const assistant = initAssistant({ ready: false });

        assistant.on('data', onData);

        assistant.ready();

        initialData.forEach((command) => {
            expect(onData).to.calledWith(command);
        });

        expect(onData).to.callCount(initialData.length);
    });

    it('Не эмитить appInitialData в onData, не эмитить дубли сообщений от нативного сдк (апп прочитал appInitialData)', () => {
        window.appInitialData = [...initialData];
        window.AssistantHost.ready = () => {
            initialData.forEach((command) => window.AssistantClient.onData(command));
            window.AssistantClient?.onStart();
        };

        const onData = cy.stub();
        const assistant = initAssistant({ ready: false });

        assistant.on('data', onData);

        const appInitialData = assistant.getInitialData();
        assistant.ready();

        expect(appInitialData).to.deep.equals(initialData);
        expect(onData).to.not.called;
    });

    it('Не падать без appInitialData', () => {
        cy.spy(window.AssistantHost, 'ready');

        window.appInitialData = undefined;
        const assistant = initAssistant({ ready: false });

        const appInitialData = assistant.getInitialData();
        assistant.ready();

        expect(appInitialData).to.deep.equals([]);
        expect(window.AssistantHost.ready).to.calledOnce;
    });

    it('Не эмитить команды повторяющиеся из appInitialData, эмитить разные команды с одним mid', () => {
        const stubOnCommand = cy.stub();
        const assistant = initAssistant({ ready: false });
        const userCommand1 = {
            type: 'smart_app_data',
            smart_app_data: { command: 'USER_COMMAND_1' },
            sdk_meta: { mid: '112233' },
        };
        const userCommand2 = {
            type: 'smart_app_data',
            smart_app_data: { command: 'USER_COMMAND_2' },
            sdk_meta: { mid: '112233' },
        };

        window.appInitialData = [...initialData, userCommand1];

        assistant.ready();
        assistant.on('command', (command) => stubOnCommand(command.command));

        window.AssistantClient.onData(userCommand1);
        window.AssistantClient.onData(userCommand2);
        expect(stubOnCommand).to.be.calledOnceWith(userCommand2.smart_app_data.command);
    });

    it("Ответные команды на sendAction приходят и в коллбэк и в assistant.on('command')", (done) => {
        const assistant = initAssistant();
        const testResponse = {
            type: 'TEST_RESPONSE',
            payload: {
                data: 'test',
            },
        };

        let callbackHadCommand = false;

        window.AssistantHost.sendDataContainer = (data) => {
            const { requestId: reqId } = JSON.parse(data);

            window.setTimeout(() => {
                window.AssistantClient.onData({
                    type: 'smart_app_data',
                    sdk_meta: { requestId: reqId },
                    smart_app_data: testResponse,
                });
            });
        };

        assistant.on('command', (command) => {
            expect(command).eql(testResponse);

            if (callbackHadCommand) {
                done();
            }
        });

        assistant.sendAction({ type: 'TEST_REQUEST' }, (command) => {
            expect(command).eql(testResponse);

            callbackHadCommand = true;
        });
    });

    it("В assistant.on('data') попадает любая дата", () => {
        const assistant = initAssistant();
        const stubOnData = cy.stub();
        const commands = commandsTypes.map((commandType) => ({
            type: commandType,
            [commandType]: {
                testData: 'test',
            },
        }));

        assistant.on('data', stubOnData);

        commands.forEach(window.AssistantClient.onData);

        commands.forEach((command) => expect(stubOnData).calledWith(command));
    });

    it("В assistant.on('error') smart_app_error приходит", () => {
        const assistant = initAssistant();
        const stubOnError = cy.stub();
        const commands = commandsTypes.map((commandType, index) => ({
            type: commandType,
            [commandType]: {
                text: `test ${index}`,
            },
        }));

        assistant.on('error', stubOnError);

        commands.forEach(window.AssistantClient.onData);

        expect(stubOnError).calledOnce;

        commands
            .filter(({ type }) => type === 'smart_app_error')
            .forEach(({ smart_app_error }) => {
                expect(stubOnError).calledWith(smart_app_error);
            });
    });

    it('ready выбрасывает ошибку, если window.AssistantHost.ready не функция', (done) => {
        const readyBefore = window.AssistantHost.ready;
        const assistant = initAssistant({ ready: false });
        const errorMessage = 'window.AssistantHost is not ready.';

        window.AssistantHost.ready = null;

        assistant.ready().catch((err) => {
            window.AssistantHost.ready = readyBefore;

            expect(err.message.startsWith(errorMessage), `Получили ${errorMessage}`).to.be.true;
            done();
        });
    });

    it('ready выбрасывает ошибку, если window.AssistantHost === undefined', (done) => {
        const assistantHostBefore = window.AssistantHost;
        const assistant = initAssistant({ ready: false });
        const errorMessage = 'window.AssistantHost is not ready.';

        window.AssistantHost = undefined;

        assistant.ready().catch((err) => {
            window.AssistantHost = assistantHostBefore;

            expect(err.message.startsWith(errorMessage), `Получили ${errorMessage}`).to.be.true;
            done();
        });
    });

    it('ready делает несколько попыток вызова window.AssistantHost.ready', (done) => {
        const readyBefore = window.AssistantHost.ready;
        const assistant = initAssistant({ ready: false });

        window.AssistantHost.ready = null;

        assistant.ready();

        (async () => {
            window.AssistantHost.ready = () => {
                window.AssistantHost.ready = readyBefore;

                done();
            };
        })();
    });

    describe('window.__ASSISTANT_CLIENT__', () => {
        it('Mid smartAppData из window.appInitialData сохраняется и не изменяется. Mid другой команды не берётся', () => {
            const assistant = initAssistant({ ready: false });
            const [, , smartAppData] = initialData;
            const commandNavigation = {
                type: 'navigation',
                navigation: { command: 'UP' },
                sdk_meta: { mid: '7652349' },
            };

            window.appInitialData = [commandNavigation, ...initialData];
            assistant.ready();

            expect(window.__ASSISTANT_CLIENT__.firstSmartAppDataMid).equal(smartAppData.sdk_meta.mid);
            window.AssistantClient.onData({ ...smartAppData, sdk_meta: { mid: '234' } });
            window.AssistantClient.onData({ ...smartAppData, sdk_meta: { mid: '345' } });
            expect(window.__ASSISTANT_CLIENT__.firstSmartAppDataMid).equal(smartAppData.sdk_meta.mid);
        });

        it('При отсутствии smartAppData в window.appInitialData, mid берётся из следующих команд и не изменяется. Mid другой команды не берётся', () => {
            const [character, insets, smartAppData] = initialData;
            const commandNavigation = {
                type: 'navigation',
                navigation: { command: 'UP' },
                sdk_meta: { mid: '7652349' },
            };
            const assistant = initAssistant({ ready: false });

            window.appInitialData = [character, insets];
            assistant.ready();

            expect(window.__ASSISTANT_CLIENT__.firstSmartAppDataMid).equal(undefined);
            window.AssistantClient.onData({ ...commandNavigation, sdk_meta: { mid: '984' } });
            window.AssistantClient.onData(smartAppData);
            expect(window.__ASSISTANT_CLIENT__.firstSmartAppDataMid).equal(smartAppData.sdk_meta.mid);
            window.AssistantClient.onData({ ...smartAppData, sdk_meta: { mid: '234' } });
            window.AssistantClient.onData({ ...smartAppData, sdk_meta: { mid: '345' } });
            expect(window.__ASSISTANT_CLIENT__.firstSmartAppDataMid).equal(smartAppData.sdk_meta.mid);
        });
    });
});
