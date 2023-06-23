/* eslint-disable camelcase, no-underscore-dangle */

import { AppEvent, createAssistant, CreateAssistantDevOptions, VpsEvent } from './assistantSdk/assistant';
import { NativePanelParams } from './NativePanel/NativePanel';
import { renderNativePanel } from './NativePanel/renderNativePanel';
import {
    SystemMessageDataType,
    ClientLogger,
    AssistantSettings,
    AssistantSmartAppCommand,
    Suggestions,
    CharacterId,
    AssistantAppState,
    AssistantCommand,
    AssistantClientCommand,
    AssistantSystemCommand,
    FakeVpsParams,
} from './typings';
import { renderAssistantRecordPanel } from './record/record-panel';
import { createConsoleLogger } from './record/console-logger';
import { createLogCallbackRecorder } from './record/callback-recorder';
import { createRecordDownloader } from './record/record-downloader';
import { createRecoveryStateRepository } from './createRecoveryStateRepository';
import { Recorder } from './record/recorder';

const SDK_VERSION = '20.09.1.3576';
const APP_VERSION = 'process.env.APP_VERSION';

// eslint-disable-next-line no-useless-concat
const HOST_APP_ID = 'ru.sb' + 'erb' + 'ank.sdakit.demo';

const FEATURES = JSON.stringify({
    appTypes: ['DIALOG', 'WEB_APP', 'CHAT_APP'],
});

const legacyDevice = {
    clientType: 'simple',
    channel: 'Android_SB',
    channelVersion: '8.1.0.2932_RC',
    platformName: 'WEBDBG 1.0',
    platformVersion: '1.0',
};

export interface RecordParams<R extends Recorder = Recorder> {
    // параметры логирования сообщений
    defaultActive?: boolean;
    logger?: ClientLogger;
    recorder?: R;
}

export type initializeNativeSDKEmulatorParams = {
    initPhrase: string;
    url: string;
    /** канал (влияет на навыки) */
    userChannel: string;
    /** поверхность (влияет на навыки) */
    surface: string;
    userId?: string;
    token?: string;
    /** версия хост-приложения (может влиять на навыки) */
    surfaceVersion?: string;
    deviceId?: string;
    locale?: string;
    nativePanel?: NativePanelParams | null;
    /** версия sdk (может влиять на навыки) */
    sdkVersion?: string;
    /** показать управление записью лога сообщений */
    enableRecord?: boolean;
    recordParams?: RecordParams;
    fakeVps?: FakeVpsParams;
    settings?: AssistantSettings;
    vpsVersion?: number;
    features?: string;
    capabilities?: string;
} & CreateAssistantDevOptions;

export const initializeNativeSDKEmulator = ({
    initPhrase,
    url,
    userChannel,
    surface,
    userId = `webdbg_userid_${
        Math.random().toString(36).substring(2, 13) + Math.random().toString(36).substring(2, 13)
    }`,
    token = `webdbg_eribtoken_${
        Math.random().toString(36).substring(2, 13) + Math.random().toString(36).substring(2, 13)
    }`,
    surfaceVersion,
    deviceId,
    locale = 'ru',
    nativePanel = {
        defaultText: 'Покажи что-нибудь',
        render: renderNativePanel,
        screenshotMode: false,
    },
    sdkVersion = SDK_VERSION,
    enableRecord,
    recordParams,
    fakeVps,
    settings = {},
    vpsVersion = 5,
    features,
    capabilities,
    getMeta,
}: initializeNativeSDKEmulatorParams) => {
    const device = {
        platformType: 'WEBDBG',
        platformVersion: '1.0',
        sdkVersion,
        surface,
        surfaceVersion: surfaceVersion || APP_VERSION,
        features: features ?? FEATURES,
        capabilities:
            capabilities ??
            JSON.stringify({
                screen: { available: true, width: window?.innerWidth, height: window?.innerHeight },
                speak: { available: true },
            }),
        deviceId,
        additionalInfo: JSON.stringify({
            host_app_id: HOST_APP_ID,
            sdk_version: sdkVersion,
        }),
    };

    const recoveryStateRepository = createRecoveryStateRepository();
    const defaultRecorder = createLogCallbackRecorder(
        recordParams?.defaultActive != null ? recordParams.defaultActive : true,
    );
    const recorder = recordParams?.recorder ?? defaultRecorder;
    const logger = (() => {
        if (enableRecord && recordParams?.logger == null) {
            return recorder.handler;
        }

        return recordParams?.logger ?? createConsoleLogger();
    })();
    const saver = createRecordDownloader();

    const assistant = createAssistant({
        url,
        userId,
        userChannel,
        locale,
        device,
        legacyDevice,
        settings: {
            ...settings,
            dubbing: settings.dubbing === false ? -1 : 1,
            echo: settings.echo || -1,
        },
        fakeVps,
        version: vpsVersion,
        logger,
        getMeta,
        getToken: () => Promise.resolve(token),
    });

    let appInfo: SystemMessageDataType['app_info'] | undefined;
    const initialSmartAppData: Array<AssistantClientCommand> = [];
    let clientReady = false; // флаг готовности клиента к приему onData
    let assistantReady = false; // флаг готовности контекста ассистента
    let character: CharacterId;
    let suggestions: Suggestions['buttons'] = [];
    let bubbleText = '';

    const sendText = (messasge: string) => {
        assistant.sendText(messasge);
    };

    const emitOnData = (command: AssistantClientCommand) => {
        if (clientReady && assistantReady && window.AssistantClient?.onData) {
            window.AssistantClient.onData(command);
        }
    };

    const fn = async () => {
        const res = await assistant.start({ initPhrase, disableGreetings: true });

        if (initPhrase && res) {
            initialSmartAppData.push({
                type: 'insets',
                insets: { left: 0, top: 0, right: 0, bottom: 144 },
                sdk_meta: { mid: '-1' },
            });

            appInfo = res?.app_info;
            if (res?.character) {
                character = res?.character.id;
                initialSmartAppData.push({ type: 'character', character: res.character, sdk_meta: { mid: '-1' } });
            }

            for (const item of res?.items || []) {
                if (item.command != null && item.command.type === 'smart_app_data') {
                    initialSmartAppData.push({
                        ...(item.command as AssistantSmartAppCommand),
                        sdk_meta: { mid: '-1' },
                    });
                }
            }

            window.appInitialData = initialSmartAppData;

            if (appInfo && appInfo.applicationId) {
                assistant.setActiveApp(appInfo, () =>
                    Promise.resolve((window.AssistantClient?.onRequestState?.() || {}) as AssistantAppState),
                );
                window.appRecoveryState = recoveryStateRepository.get(appInfo.applicationId);
            }

            if (clientReady && window.AssistantClient?.onData) {
                initialSmartAppData.forEach((c) => window.AssistantClient?.onData?.(c));
                window.AssistantClient?.onStart && window.AssistantClient?.onStart();
            }

            assistantReady = true;
        }
    };

    const promise = fn();

    // @ts-ignore
    window.Assistant = assistant;
    window.appInitialData = [];
    window.appRecoveryState = null;
    window.AssistantHost = {
        cancelTts() {
            assistant.stopTts();
        },
        close() {
            if (appInfo && appInfo.applicationId) {
                recoveryStateRepository.remove(appInfo.applicationId);
                if (window.AssistantClient?.onRequestRecoveryState) {
                    recoveryStateRepository.set(appInfo.applicationId, window.AssistantClient.onRequestRecoveryState());
                }
            }

            assistant.closeApp();
            initialSmartAppData.splice(0, initialSmartAppData.length);
            window.appRecoveryState = null;
        },
        ready() {
            if (assistantReady && window.AssistantClient?.onData) {
                window.AssistantClient?.onStart && window.AssistantClient?.onStart();
            }

            clientReady = true;
        },
        async sendData(payload: string, messageName: string | null = null) {
            await promise;
            assistant.sendServerAction(JSON.parse(payload), messageName || undefined);
        },
        async sendDataContainer(container: string) {
            await promise;

            const { data, message_name: messageName, requestId } = JSON.parse(container);
            assistant.sendServerAction(data, messageName || 'SERVER_ACTION', requestId);
        },
        setSuggests() {},
        setHints() {},
        sendText,
        setHeaderButtons() {},
    };

    const subscribeToListenerStatus = (cb: (event: 'listen' | 'stopped') => void): (() => void) =>
        assistant.on('assistant', (event) => {
            if (event.emotion) {
                cb(event.emotion === 'listen' ? 'listen' : 'stopped');
            }
        });
    const subscribeToListenerHypotesis = (cb: (hypotesis: string, last: boolean) => void): (() => void) =>
        assistant.on('assistant', (event) => {
            if (event.asr) {
                cb(event.asr.text, typeof event.asr.last === 'undefined' ? false : event.asr.last);
            }
        });

    const updateDevUI = (params: Pick<NativePanelParams, 'hideNativePanel'> = {}) => {
        if (nativePanel) {
            const { render, ...props } = nativePanel;

            (render || renderNativePanel)({
                ...props,
                ...params,
                sendText,
                sendServerAction: assistant.sendServerAction,
                onListen: assistant.listen,
                suggestions,
                bubbleText,
                onSubscribeListenStatus: subscribeToListenerStatus,
                onSubscribeHypotesis: subscribeToListenerHypotesis,
            });
        }
    };

    const nativePanelApi = {
        hide: () => {
            updateDevUI({ hideNativePanel: true });
        },
        show: () => {
            updateDevUI({ hideNativePanel: false });
        },
    };

    assistant.on('app', (event: AppEvent) => {
        switch (event.type) {
            case 'close':
                window.AssistantHost?.close();
                break;
            case 'command':
                emitOnData(event.command as AssistantSmartAppCommand);
                break;
            case 'run':
            default:
                break;
        }
    });

    assistant.on('command', (command: AssistantCommand) => {
        if (command.type === 'system' && (command as AssistantSystemCommand).system.command.toUpperCase() === 'BACK') {
            window.history.back();
        }
    });

    assistant.on('vps', (event: VpsEvent) => {
        if (event.type !== 'incoming') {
            return;
        }

        const { systemMessage } = event;

        for (const item of systemMessage.items || []) {
            if (item.bubble) {
                bubbleText = item.bubble.text;
            }
        }

        if (systemMessage.character && systemMessage.character.id !== character) {
            character = systemMessage.character.id;
            emitOnData({ type: 'character', character: systemMessage.character, sdk_meta: { mid: '-1' } });
        }
        suggestions = systemMessage.suggestions?.buttons ?? [];

        updateDevUI();
    });

    assistant.on('tts', (event) => {
        emitOnData({
            type: 'tts_state_update',
            state: event.status,
            owner: event.appInfo.applicationId === appInfo?.applicationId,
        });
    });

    updateDevUI();
    enableRecord && renderAssistantRecordPanel(recorder, saver);

    window.__dangerouslySendTextMessage = sendText;

    return {
        sendText,
        nativePanel: nativePanelApi,
    };
};
