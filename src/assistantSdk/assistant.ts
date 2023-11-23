/* eslint-disable camelcase */
import { ActionCommand } from '@salutejs/scenario';

import { createNanoEvents } from '../nanoevents';
import {
    AppInfo,
    AssistantAppState,
    AssistantSmartAppData,
    AssistantSmartAppError,
    AssistantStartSmartSearch,
    VpsConfiguration,
    EmotionId,
    OriginalMessageType,
    PermissionType,
    SystemMessageDataType,
    AssistantBackgroundApp,
    AssistantBackgroundAppInfo,
    AssistantMeta,
    AssistantCommand,
    HistoryMessages,
    AdditionalMeta,
    Status,
    AssistantServerActionMode,
    CharacterId,
    Mid,
} from '../typings';

import { createClient } from './client/client';
import { createProtocol, ProtocolError } from './client/protocol';
import { createTransport, CreateTransportParams } from './client/transport';
import { getAnswerForRequestPermissions, getTime } from './meta';
import { createVoice, TtsEvent } from './voice/voice';
import { VoiceListenerStatus } from './voice/listener/voiceListener';
import { Music2TrackProtocol } from './voice/recognizers/mtt';
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

const BASIC_SMART_APP_COMMANDS_TYPES = ['smart_app_data', 'smart_app_error', 'start_smart_search', 'navigation'];

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
    | {
          type: 'command';
          app: AppInfo;
          command: AssistantSmartAppData | AssistantSmartAppError | AssistantStartSmartSearch;
      };

export type AssistantEvent = {
    asr?: { text: string; last?: boolean; mid?: OriginalMessageType['messageId'] }; // last и mid нужен для отправки исх бабла в чат
    /**
     * @deprecated Use the `on('assistant', { listener })` and `on('tts', tts)` subscriptions to receive voice events
     */
    emotion?: EmotionId;
    mtt?: { response: Music2TrackProtocol.MttResponse; mid: OriginalMessageType['messageId'] };
    listener?: { status: VoiceListenerStatus };
};

export type VpsEvent =
    | { type: 'ready' }
    | { type: 'error'; error: Event | Error | undefined }
    | { type: 'outcoming'; message: OriginalMessageType }
    | { type: 'incoming'; systemMessage: SystemMessageDataType; originalMessage: OriginalMessageType };

export type ActionCommandEvent = {
    type: 'command';
    command: ActionCommand;
    appInfo: AppInfo;
};

export type AssistantError = ProtocolError;

export type AssistantEvents = {
    app: (event: AppEvent) => void;
    assistant: (event: AssistantEvent) => void;
    vps: (event: VpsEvent) => void;
    actionCommand: (event: ActionCommandEvent) => void;
    command: (command: AssistantCommand) => void;
    status: (status: Status, mid: Mid) => void;
    error: (error: AssistantError) => void;
    history: (history: HistoryMessages[]) => void;
    tts: (event: TtsEvent) => void;
};

export interface CreateAssistantDevOptions {
    getMeta?: () => Record<string, unknown>;
    getInitialMeta?: () => Promise<Record<string, unknown>>;
}

type BackgroundAppOnCommand<T> = (
    command: (AssistantSmartAppData & { smart_app_data?: T }) | AssistantSmartAppError | AssistantStartSmartSearch,
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

export type Assistant = ReturnType<typeof createAssistant>;

export const createAssistant = ({
    getMeta,
    getInitialMeta,
    checkCertUrl,
    ...configuration
}: VpsConfiguration & CreateAssistantDevOptions & Pick<CreateTransportParams, 'checkCertUrl'>) => {
    const { on, emit } = createNanoEvents<AssistantEvents>();

    // default_character отправляется в мета при отправке InitialSettings
    let defaultCharacter: CharacterId = 'sber';
    // хеш [messageId]: requestId, где requestId - пользовательский ид экшена
    const requestIdMap: Record<string, string> = {};
    // mid для последнего отправленного/принятого сообщения (кроме server_action)
    let lastMid: Mid = 0;

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
            typeof getInitialMeta !== 'undefined'
                ? () =>
                      getInitialMeta().then((meta) =>
                          convertFieldValuesToString({
                              ...meta,
                              default_character: defaultCharacter,
                          }),
                      )
                : () =>
                      convertFieldValuesToString({
                          default_character: defaultCharacter,
                      }),
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
    const closeApp = (closing: AppInfo = app.info) => {
        // переключить на дефолтный апп
        if (closing.applicationId === app.info.applicationId) {
            /// выглядит как нарушение логики,
            /// но с точки зрения апи - ок
            /// иначе потребителю нужно знать про DEFAULT_APP
            app = {
                info: DEFAULT_APP,
            };
        }

        if (!isDefaultApp(closing)) {
            emit('app', { type: 'close', app: closing });
        }
    };

    /** отправляет текст */
    const sendText = (text: string, shouldSendDisableDubbing = false, additionalMeta?: AdditionalMeta) => {
        voice.stop();

        return client.sendText(text, settings.current.sendTextAsSsml, shouldSendDisableDubbing, additionalMeta);
    };

    /** отправляет server_action */
    const sendServerAction = (
        serverAction: unknown,
        messageName = 'SERVER_ACTION',
        requestId: string | undefined = undefined,
        actionApp: AppInfo = app.info,
        mode?: AssistantServerActionMode,
    ) => {
        client.sendServerAction(serverAction, actionApp, messageName, mode).then((messageId) => {
            if (requestId && messageId) {
                requestIdMap[messageId.toString()] = requestId;
            }
        });
    };

    /** отправляет ответ на запрос доступа к местоположению и пр. меты */
    const sendMetaForPermissionRequest = async (requestMessageId: Mid, appInfo: AppInfo, items: PermissionType[]) => {
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
            if (message.text || message.voice) {
                /// не прерываем множественные ответы для сервер-экшенов
                /// прервем, если получим карточку или бабл в ответ
                lastMid = message.messageId;
            }

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
        client.on('status', (status, { messageId }) => {
            emit('status', status, messageId);
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
                const { answerId = 0, activate_app_info, items = [], app_info: mesAppInfo } = systemMessage;
                const isChatApp = mesAppInfo && mesAppInfo.frontendType === 'CHAT_APP';
                const isDialog = mesAppInfo && mesAppInfo.frontendType === 'DIALOG';
                const isAppChanged = mesAppInfo && mesAppInfo.applicationId !== app.info.applicationId;

                if (
                    // DIALOG не попадает в current_app
                    !isDialog &&
                    isAppChanged &&
                    /// игнорируем activate_app_info для чатапов
                    /// по-умолчанию activate_app_info: true
                    (isChatApp || activate_app_info !== false)
                ) {
                    emit('app', { type: 'run', app: mesAppInfo });
                }

                if (isDialog && isAppChanged && app.info.applicationId !== DEFAULT_APPLICATION_ID) {
                    emit('app', { type: 'run', app: DEFAULT_APP });
                }

                // cancel для множественных ответов
                if (answerId >= 2 && lastMid > originalMessage.messageId) {
                    client.sendCancel(originalMessage.messageId);
                }

                // последним сообщением считаем, только если пришли карточки/баблы
                if (lastMid < originalMessage.messageId && items.findIndex(({ bubble, card }) => bubble || card) >= 0) {
                    lastMid = originalMessage.messageId;
                }

                if (items.length) {
                    for (let i = 0; i < items.length; i++) {
                        const { command } = items[i];

                        if (typeof command !== 'undefined') {
                            window.setTimeout(() => emit('command', command));

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
                                    appInfo: mesAppInfo as AppInfo,
                                });
                            }

                            if (mesAppInfo && BASIC_SMART_APP_COMMANDS_TYPES.includes(command.type)) {
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

                            if (command.type === 'close_app' && !isDialog) {
                                closeApp(mesAppInfo);
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
        get settings(): typeof settings.current {
            return Object.create(
                Object.getPrototypeOf(settings.current),
                Object.getOwnPropertyDescriptors(settings.current),
            );
        },
        destroy,
        closeApp,
        listen: voice.listen,
        shazam: voice.shazam,
        sendServerAction,
        getHistoryRequest: protocol.getHistoryRequest,
        sendText,
        sendVoice: voice.sendVoice,
        streamVoice: voice.streamVoice,
        start,
        stop: () => {
            voice.stop();

            if (lastMid !== 0) {
                client.sendCancel(lastMid);
            }

            setTimeout(() => {
                protocol.clearQueue();
                transport.close();
            });
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
        setDefaultCharacterMeta(characterId: CharacterId) {
            defaultCharacter = characterId;
        },
    };
};
