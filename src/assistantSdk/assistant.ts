/* eslint-disable camelcase */
import { ActionCommand } from '@salutejs/scenario';
import Long from 'long';

import { createNanoEvents } from '../nanoevents';
import {
    AppInfo,
    AssistantAppState,
    AssistantSmartAppData,
    AssistantStartSmartSearch,
    VpsConfiguration,
    EmotionId,
    OriginalMessageType,
    PermissionType,
    SystemMessageDataType,
    CharacterId,
    AssistantBackgroundApp,
    AssistantBackgroundAppInfo,
    AssistantMeta,
    AssistantCommand,
    HistoryMessages,
    AdditionalMeta,
    Status,
} from '../typings';

import { createClient } from './client/client';
import { createProtocol, ProtocolError } from './client/protocol';
import { createTransport, CreateTransportParams } from './client/transport';
import { getAnswerForRequestPermissions, getTime } from './meta';
import { createVoice, TtsEvent } from './voice/voice';
import { createMutexedObject } from './mutexedObject';
import { createMutexSwitcher } from './mutexSwitcher';
import { MetaStringified } from './client/methods';

const STATE_UPDATE_TIMEOUT = 200;

const DEFAULT_PROJECT_ID = 'd929986a-611a-2ba0-6174-1928c99600a5';
const DEFAULT_APPLICATION_ID = '7c4e23bf-cd93-b57e-874b-d9fc1b35f93d';
const DEFAULT_APP_VERSION_ID = '26d0bb2e-45d6-a276-f70e-6c016d1f9cff';

const DEFAULT_APP: AppInfo = {
    projectId: DEFAULT_PROJECT_ID,
    applicationId: DEFAULT_APPLICATION_ID,
    appversionId: DEFAULT_APP_VERSION_ID,
    frontendStateId: [DEFAULT_PROJECT_ID, DEFAULT_APPLICATION_ID, DEFAULT_APP_VERSION_ID].join('_'),
    frontendType: 'DIALOG',
    systemName: 'assistant',
    frontendEndpoint: 'None',
};

function convertFieldValuesToString<
    Obj extends Record<string, unknown>,
    ObjStringified = { [key in keyof Obj]: string },
>(object: Obj): ObjStringified {
    return Object.keys(object).reduce((acc: Record<string, string>, key: string) => {
        if (object[key]) {
            acc[key] = JSON.stringify(object[key]);
        }
        return acc;
    }, {}) as ObjStringified;
}

const isDefaultApp = (appInfo: AppInfo) => appInfo.frontendStateId === DEFAULT_APP.frontendStateId;
const promiseTimeout = <T>(promise: Promise<T>, timeout: number): Promise<T> => {
    let timeoutId: number | undefined;
    return Promise.race([
        promise.then((v) => {
            if (timeoutId) {
                window.clearTimeout(timeoutId);
            }
            return v;
        }),
        new Promise<never>((_, reject) => {
            timeoutId = window.setTimeout(() => {
                reject(new Error(`Timed out in ${timeout} ms.`));
            }, timeout);
        }),
    ]);
};

export type AppEvent =
    | { type: 'run'; app: AppInfo }
    | { type: 'close'; app: AppInfo }
    | { type: 'command'; app: AppInfo; command: AssistantSmartAppData | AssistantStartSmartSearch };

export type AssistantEvent = {
    asr?: { text: string; last?: boolean; mid?: OriginalMessageType['messageId'] }; // last и mid нужен для отправки исх бабла в чат
    character?: CharacterId;
    emotion?: EmotionId;
};

export type VpsEvent =
    | { type: 'ready' }
    | { type: 'error'; error: Event | Error | undefined }
    | { type: 'outcoming'; message: OriginalMessageType }
    | { type: 'incoming'; systemMessage: SystemMessageDataType; originalMessage: OriginalMessageType };

export type ActionCommandEvent = {
    type: 'command';
    command: ActionCommand;
};

export type AssistantError = ProtocolError;

export type AssistantEvents = {
    app: (event: AppEvent) => void;
    assistant: (event: AssistantEvent) => void;
    vps: (event: VpsEvent) => void;
    actionCommand: (event: ActionCommandEvent) => void;
    command: (command: AssistantCommand) => void;
    status: (status: Status) => void;
    error: (error: AssistantError) => void;
    history: (history: HistoryMessages[]) => void;
    tts: (event: TtsEvent) => void;
};

export interface CreateAssistantDevOptions {
    getMeta?: () => Record<string, unknown>;
    getInitialMeta?: () => Promise<Record<string, unknown>>;
}

type BackgroundAppOnCommand<T> = (
    command: (AssistantSmartAppData & { smart_app_data?: T }) | AssistantStartSmartSearch,
    messageId: string,
) => void;

export type AssistantSettings = {
    /** Отключение фичи воспроизведения голоса */
    disableDubbing: boolean;
    /** Отключение фичи слушания речи */
    disableListening: boolean;
    /** Отправка текстовых сообщений с type: application/ssml */
    sendTextAsSsml: boolean;
};

export const createAssistant = ({
    getMeta,
    getInitialMeta,
    checkCertUrl,
    ...configuration
}: VpsConfiguration & CreateAssistantDevOptions & Pick<CreateTransportParams, 'checkCertUrl'>) => {
    const { on, emit } = createNanoEvents<AssistantEvents>();

    // хеш [messageId]: requestId, где requestId - пользовательский ид экшена
    const requestIdMap: Record<string, string> = {};

    const subscriptions: Array<() => void> = [];
    const backgroundApps: {
        [key: string]: AssistantBackgroundApp & {
            commandsSubscribers: Array<BackgroundAppOnCommand<Record<string, unknown>>>;
        };
    } = {};
    const settings = createMutexedObject({
        disableDubbing: configuration.settings.dubbing === -1,
        disableListening: false,
        sendTextAsSsml: false,
    });
    const settingsSwitcher = createMutexSwitcher(settings, { isListenerStopped: true, isVoicePlayerEnded: true });

    // готов/не готов воспроизводить озвучку
    let voiceReady = false;

    // текущий апп
    let app: { info: AppInfo; getState?: () => Promise<AssistantAppState> } = { info: DEFAULT_APP };

    let sdkMeta: AssistantMeta = { theme: 'dark' };

    const metaProvider = async (additionalMeta?: AdditionalMeta): Promise<MetaStringified> => {
        // Стейт нужен только для канваса
        const appState =
            app !== null && app.info.frontendType === 'WEB_APP' && app.getState
                ? await promiseTimeout<AssistantAppState>(app.getState(), STATE_UPDATE_TIMEOUT).catch(() => {
                      // eslint-disable-next-line no-console
                      console.error('App-state wasn`t resolved, timeout had been expired');
                      return undefined;
                  })
                : undefined;

        const current_app = {
            app_info: app.info,
            state: appState || {},
        };

        const getBackgroundAppsMeta = async () => {
            const apps = { ...backgroundApps };
            const backgroundAppsIds = Object.keys(apps);
            const backgroundAppsMeta: AssistantBackgroundAppInfo[] = [];

            await Promise.all(
                backgroundAppsIds.map(async (applicationId) => {
                    const { getState = () => Promise.resolve({}) } = apps[applicationId];

                    return promiseTimeout(getState(), STATE_UPDATE_TIMEOUT).then(
                        (state) => state,
                        () => ({}),
                    );
                }),
            ).then((results) => {
                results.forEach((appResult, index) => {
                    const state = appResult;

                    const applicationId = backgroundAppsIds[index];

                    backgroundAppsMeta.push({
                        app_info: apps[applicationId].appInfo,
                        state,
                    });
                });
            });

            return backgroundAppsMeta;
        };

        const background_apps = await getBackgroundAppsMeta();

        return convertFieldValuesToString({
            ...sdkMeta,
            time: getTime(),
            current_app,
            background_apps,
            ...(additionalMeta || {}),
            ...(getMeta ? getMeta() : {}),
        });
    };

    const transport = createTransport({
        createWS: configuration.fakeVps?.createFakeWS,
        checkCertUrl,
    });
    const protocol = createProtocol(transport, {
        ...configuration,
        getInitialMeta:
            typeof getInitialMeta !== 'undefined' ? () => getInitialMeta().then(convertFieldValuesToString) : undefined,
        // пока голос не готов, выключаем озвучку
        settings: { ...configuration.settings, dubbing: -1 },
    });
    const client = createClient(protocol, metaProvider);
    const voice = createVoice(
        client,
        settings,
        (event) => {
            if (typeof event.tts !== 'undefined') {
                emit('tts', event.tts);
                settingsSwitcher.change({ isVoicePlayerEnded: event.tts.status === 'stop' });

                return;
            }

            if (typeof event.listener !== 'undefined') {
                settingsSwitcher.change({ isListenerStopped: event.listener.status === 'stopped' });
            }

            emit('assistant', event);
        },
        () => {
            voiceReady = true;

            if (!settings.current.disableDubbing) {
                protocol.changeSettings({ dubbing: 1 });
            }
        },
    );

    /** завершает текущий апп */
    const closeApp = () => {
        const current = app;

        app = {
            info: DEFAULT_APP,
        };

        if (!isDefaultApp(current.info)) {
            emit('app', { type: 'close', app: current.info });
        }
    };

    /** отправляет текст */
    const sendText = (text: string, shouldSendDisableDubbing = false, additionalMeta?: AdditionalMeta) => {
        voice.stop();

        client.sendText(text, settings.current.sendTextAsSsml, shouldSendDisableDubbing, additionalMeta);
    };

    /** отправляет server_action */
    const sendServerAction = (
        serverAction: unknown,
        messageName = 'SERVER_ACTION',
        requestId: string | undefined = undefined,
        actionApp: AppInfo = app.info,
    ) => {
        client.sendServerAction(serverAction, actionApp, messageName).then((messageId) => {
            if (requestId && messageId) {
                requestIdMap[messageId.toString()] = requestId;
            }
        });
    };

    /** отправляет ответ на запрос доступа к местоположению и пр. меты */
    const sendMetaForPermissionRequest = async (
        requestMessageId: number | Long,
        appInfo: AppInfo,
        items: PermissionType[],
    ) => {
        const {
            meta: { ...props },
            ...data
        } = await getAnswerForRequestPermissions(requestMessageId, appInfo, items);
        const meta = await metaProvider();

        client.sendData({ ...data }, 'SERVER_ACTION', { ...meta, ...convertFieldValuesToString(props) });
    };

    subscriptions.push(protocol.on('ready', () => emit('vps', { type: 'ready' })));

    // пока voicePlayer не доступен, включение озвучки не будет отправлено
    subscriptions.push(
        settings.on('changed', (nextSettings, prevSettings) => {
            if (nextSettings.disableDubbing !== prevSettings.disableDubbing) {
                voiceReady && protocol.changeSettings({ dubbing: nextSettings.disableDubbing ? -1 : 1 });
            }
        }),
    );

    // при неудачном переподключении к сокету
    subscriptions.push(
        transport.on('error', (error: Event | Error | undefined) => {
            voice.stop();
            protocol.clearQueue();

            emit('vps', { type: 'error', error });
        }),
    );

    // обработка исходящих сообщений
    subscriptions.push(
        protocol.on('outcoming', (message: OriginalMessageType) => {
            emit('vps', { type: 'outcoming', message });
        }),
    );

    // обработка ошибок
    subscriptions.push(
        protocol.on('error', (error: ProtocolError) => {
            emit('error', error);
        }),
    );

    // оповещение о статусах
    subscriptions.push(
        client.on('status', (status) => {
            emit('status', status);
        }),
    );

    // история на запрос GetHistoryRequest
    subscriptions.push(
        client.on('history', (history) => {
            emit('history', history);
        }),
    );

    // обработка входящих команд, и событий аппа
    subscriptions.push(
        client.on('systemMessage', (systemMessage: SystemMessageDataType, originalMessage: OriginalMessageType) => {
            if (originalMessage.messageName === 'ANSWER_TO_USER') {
                const { activate_app_info, items, app_info: mesAppInfo, character } = systemMessage;

                if (character) {
                    emit('assistant', { character: character.id });
                }

                // по-умолчанию activate_app_info: true
                if (
                    activate_app_info !== false &&
                    mesAppInfo &&
                    // игнорируем activate_app_info для чатапов
                    (mesAppInfo?.frontendType === 'DIALOG' ||
                        mesAppInfo?.frontendType === 'CHAT_APP' ||
                        mesAppInfo.applicationId !== app.info.applicationId)
                ) {
                    emit('app', { type: 'run', app: mesAppInfo });
                }

                if (items) {
                    for (let i = 0; i < (items || []).length; i++) {
                        const { command } = items[i];

                        if (typeof command !== 'undefined') {
                            setTimeout(() => emit('command', command));

                            if (command.type === 'start_music_recognition') {
                                voice.shazam();
                                return;
                            }

                            if (command.type === 'request_permissions' && mesAppInfo) {
                                sendMetaForPermissionRequest(
                                    originalMessage.messageId,
                                    mesAppInfo,
                                    command.permissions as PermissionType[],
                                );
                                return;
                            }

                            if (command.type === 'action') {
                                emit('actionCommand', {
                                    type: 'command',
                                    command: command as ActionCommand,
                                });
                            }

                            if (
                                (command.type === 'smart_app_data' ||
                                    command.type === 'smart_app_error' ||
                                    command.type === 'start_smart_search' ||
                                    command.type === 'navigation') &&
                                mesAppInfo
                            ) {
                                // эмитим все команды, т.к бывают фоновые команды
                                emit('app', {
                                    type: 'command',
                                    command: {
                                        ...(command as AssistantSmartAppData | AssistantStartSmartSearch),
                                        sdk_meta: {
                                            mid: originalMessage.messageId.toString(),
                                            requestId: requestIdMap[originalMessage.messageId.toString()],
                                        },
                                    },
                                    app: mesAppInfo,
                                });
                            }

                            if (command.type === 'close_app') {
                                closeApp();
                            }
                        }
                    }
                }

                emit('vps', { type: 'incoming', systemMessage, originalMessage });
            }
        }),
    );

    // прокидывает команды backgroundApp'ов в их подписчики
    on('app', (event) => {
        if (event.type === 'command') {
            const backgroundAppOnCommand = backgroundApps[event.app.applicationId]?.commandsSubscribers;

            if (Array.isArray(backgroundAppOnCommand)) {
                backgroundAppOnCommand.forEach((onCommand) => {
                    onCommand(event.command, event.command.sdk_meta?.mid as string);
                });
            }
        }
    });

    /** уничтожает ассистент, очищает подписки */
    const destroy = () => {
        voice.destroy();
        client.destroy();
        protocol.destroy();

        subscriptions.splice(0, subscriptions.length).map((unsubscribe) => unsubscribe());
    };

    /** запускает ассистент (приветствие) */
    const start = async ({
        disableGreetings = false,
        initPhrase = undefined,
        isFirstSession = false,
    }: {
        /** Отключение приветственного сообщения при старте */
        disableGreetings?: boolean;
        initPhrase?: string;
        isFirstSession?: boolean;
    } = {}): Promise<SystemMessageDataType | undefined> => {
        if (!disableGreetings && isDefaultApp(app.info)) {
            await client.sendOpenAssistant({ isFirstSession });
        }

        if (initPhrase) {
            return client
                .sendText(initPhrase)
                .then((messageId) => (messageId ? client.waitForAnswer(messageId) : undefined));
        }

        return undefined;
    };

    return {
        get activeApp() {
            return !isDefaultApp(app.info) ? app.info : null;
        },
        get settings() {
            return Object.create(
                Object.getPrototypeOf(settings.current),
                Object.getOwnPropertyDescriptors(settings.current),
            );
        },
        destroy,
        closeApp,
        listen: voice.listen,
        sendServerAction,
        getHistoryRequest: protocol.getHistoryRequest,
        sendText,
        start,
        stop: () => {
            voice.stop();
            protocol.clearQueue();
            transport.close();
        },
        stopTts: voice.stopPlaying,
        stopVoice: voice.stop,
        emit,
        on,
        changeConfiguration: protocol.changeConfiguration,
        changeSettings: settings.change,
        changeSdkMeta: (nextSdkMeta: Partial<AssistantMeta>) => {
            sdkMeta = {
                ...sdkMeta,
                ...nextSdkMeta,
            };
        },
        reconnect: protocol.reconnect,
        get protocol() {
            return protocol;
        },
        setActiveApp: (info: AppInfo, getState?: () => Promise<AssistantAppState>) => {
            app = { info, getState };
        },
        addBackgroundApp: ({ appInfo, getState }: AssistantBackgroundApp) => {
            backgroundApps[appInfo.applicationId] = {
                appInfo,
                getState,
                commandsSubscribers: [],
            };

            const remove = () => {
                delete backgroundApps[appInfo.applicationId];
            };

            const onCommand = <T>(subscriber: BackgroundAppOnCommand<T>) => {
                backgroundApps[appInfo.applicationId]?.commandsSubscribers.push(subscriber);

                return {
                    clearSubscribers: () => {
                        if (backgroundApps[appInfo.applicationId]) {
                            backgroundApps[appInfo.applicationId].commandsSubscribers = [];
                        }
                    },
                };
            };

            const sendServerActionToBackgroundApp = (
                serverAction: unknown,
                messageName = 'SERVER_ACTION',
                requestId: string | undefined = undefined,
            ) => sendServerAction(serverAction, messageName, requestId, backgroundApps[appInfo.applicationId]?.appInfo);

            return {
                remove,
                onCommand,
                sendServerAction: sendServerActionToBackgroundApp,
            };
        },
        get status() {
            return protocol.status;
        },
    };
};
