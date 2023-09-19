import Long from 'long';
import {
    Action,
    ActionCommand,
    BubbleCommand,
    CardCommand,
    Suggestions,
    Hints,
    AppInfo,
    Character,
    UUID,
    Meta as ScenarioMeta,
    SystemMessagePayload,
} from '@salutejs/scenario';

import {
    IDevice,
    ILegacyDevice,
    IMessage,
    ISettings,
    IGetHistoryRequest,
    IHistoryMessages,
    IOffset,
    IStatus,
    IText,
    IBytes,
    IInitialSettings,
    IVoice,
} from './proto';
export { IMessage, IDevice, ILegacyDevice, ISettings, InitialSettings, IBytes, IStatus, IText, IVoice } from './proto';

export {
    Suggestions,
    TextAction,
    DeepLinkAction,
    Action,
    ActionCommand,
    AppInfo,
    UUID,
    Bubble,
    Card,
    PermissionType,
    PermissionStatus,
    Character,
    CharacterId,
    Hints,
    ServerAction,
} from '@salutejs/scenario';

export type Surface = 'SBERBOX' | 'STARGATE' | 'SATELLITE' | 'COMPANION' | 'SBOL' | 'TV' | 'TV_HUAWEI' | 'TIME';

export type ThemeColorName = 'dark' | 'light';

export type Theme = {
    name: ThemeColorName;
};

// eslint-disable-next-line no-shadow
export enum VpsVersion {
    '1.0' = 1,
    '2.0' = 2,
    '3.0' = 3,
    '4.0' = 4,
    '5.0' = 5,
}

export const MessageNames = {
    ANSWER_TO_USER: 'ANSWER_TO_USER',
    STT: 'STT',
    MUSIC_RECOGNITION: 'MUSIC_RECOGNITION',
    DO_NOTHING: 'DO_NOTHING',
};

export interface DPMessage extends IMessage {
    sessionId: string;
    uuid: UUID;
}

export interface AssistantAppStateBase<T> {
    /* Любые данные, которые могут потребоваться Backend'у для принятия решений */
    [key: string]: unknown;
    item_selector?: {
        ignored_words?: string[];
        /* Список соответствий голосовых команд действиям в веб-приложении */
        items: AssistantViewItemBase<T>[];
    };
}

export type AssistantAppState = AssistantAppStateBase<Action>;

export interface AssistantViewItemBase<T> {
    /* Порядковый номер элемента, назначается смартаппом, уникален в рамках items */
    number?: number;
    /* Уникальный id элемента */
    id?: string;
    /* Ключевая фраза, которая должна приводить к данному действию */
    title?: string;
    /* Фразы-синонимы, которые должны быть расценены как данное действие */
    aliases?: string[];
    /* Сервер экшен, проксирует action обратно на бекэнд. */
    server_action?: AssistantServerAction;
    /* Экшен, который вернётся в AssistantSmartAppData */
    action?: T;
    /* Дополнительные данные для бэкенда */
    [key: string]: unknown;
}

export type AssistantViewItem = AssistantViewItemBase<Action>;

export interface AssistantEvents<A extends AssistantSmartAppData> {
    start: () => void;
    data: (command: AssistantClientCustomizedCommand<A>) => void;
    command: <T extends AssistantSmartAppCommand['smart_app_data'] = AssistantSmartAppCommand['smart_app_data']>(
        data: T,
    ) => void;
    error: <T extends AssistantSmartAppError['smart_app_error'] = AssistantSmartAppError['smart_app_error']>(
        error: T,
    ) => void;
    tts: (state: Pick<AssistantTtsStateUpdate, 'state' | 'owner'>) => void;
}

export interface SendDataParams {
    action: AssistantServerAction;
    name?: string;
    requestId?: string;
    /**
     * опциональное поле, считаем "foreground" по умолчанию
     */
    mode?: AssistantServerActionMode;
}

export type AssistantClientCommandEvents<C extends AssistantClientCommand = AssistantClientCommand> = {
    [event in C['type']]: (command: C) => void;
};

export interface Assistant<A extends AssistantSmartAppData = AssistantSmartAppData> {
    cancelTts: (() => void) | undefined;
    close: () => void;
    getInitialData: () => AssistantClientCommand[];
    findInInitialData: <T>(args: { type?: string; command?: string }) => T | undefined;
    getGeo: (() => void) | undefined;
    getRecoveryState: () => unknown;
    on: <K extends keyof AssistantEvents<A>>(event: K, cb: AssistantEvents<A>[K]) => () => void;
    sendAction: <
        D extends AssistantSmartAppCommand['smart_app_data'],
        E extends AssistantSmartAppError['smart_app_error'],
    >(
        action: { type: string; payload?: unknown },
        onData: (data: D) => void,
        onError: (error: E) => void,
        params: Pick<SendDataParams, 'name' | 'requestId'>,
    ) => () => void;
    sendData: (params: SendDataParams) => () => void;
    sendText: (message: string) => void;
    setHints: (hints: Hints) => void;
    setGetRecoveryState: (next: () => unknown) => void;
    setGetState: (next: () => AssistantAppState) => void;
    setHeaderButtons: (headerButtons: SystemMessageHeaderByttonsType) => void;
    setSuggests: (suggestions: Suggestions['buttons']) => void;
    subscribeToCommand: <K extends keyof AssistantClientCommandEvents>(
        event: K,
        cb: AssistantClientCommandEvents[K],
    ) => () => void;
    ready: () => void;
}

export type AssistantDev<A extends AssistantSmartAppData> = Assistant<A> & {
    nativePanel: { show: () => void; hide: () => void };
};

export interface AssistantServerActionAppInfo {
    projectId: string;
    applicationId?: string;
    appversionId?: string;
}

export type AssistantServerAction = { action_id: string; parameters?: any } | { type: string; payload?: any };

export type AssistantServerActionMode = 'background' | 'foreground';

export type AssistantCommands =
    | ActionCommand
    | AssistantThemeCommand
    | AssistantCharacterCommand
    | AssistantCloseAppCommand
    | AssistantNavigationCommand
    | AssistantSmartAppCommand
    | AssistantVisibilityCommand
    | AssistantPlayerCommand
    | AssistantSystemCommand;

export interface SdkMeta {
    mid?: string;
    requestId?: string;
}

export interface AssistantThemeCommand {
    type: 'theme';
    theme: Theme;
    sdk_meta?: SdkMeta;
}

export interface AssistantCharacterCommand {
    type: 'character';
    character: Character;
    sdk_meta: SdkMeta;
}

export interface Insets {
    left: number; // px
    top: number; // px
    right: number; // px
    bottom: number; // px
}

export interface AssistantInsetsCommand {
    type: 'insets' | 'dynamic_insets' | 'minimum_static_insets' | 'maximum_static_insets';
    insets: Insets;
    sdk_meta: SdkMeta;
}

export interface AssistantCloseAppCommand {
    type: 'close_app';
}

export interface AssistantNavigationCommand {
    type: 'navigation';
    navigation: { command: 'UP' | 'DOWN' | 'LEFT' | 'RIGHT' | 'FORWARD' };
    sdk_meta?: SdkMeta;
}

export interface AssistantActionCommand {
    type: 'action';
    action: {
        type: string;
        [key: string]: unknown;
    };
}

export interface AssistantSmartAppData<P = any> {
    type: 'smart_app_data';
    smart_app_data: P;
    sdk_meta?: SdkMeta;
}

export interface AssistantSmartAppError {
    type: 'smart_app_error';
    smart_app_error: {
        code: number;
        description: string;
    };
    sdk_meta?: SdkMeta;
}

export interface AssistantSmartAppCommand<T = string, P = any> extends AssistantSmartAppData {
    smart_app_data: {
        type: T;
        payload?: P;
    };
    sdk_meta?: SdkMeta;
}

export interface AssistantStartSmartSearch {
    type: 'start_smart_search';
    start_smart_search: {
        query: string;
        timeoutMS: string;
    };
    sdk_meta?: SdkMeta;
}

export interface AssistantGeoLocationCommand {
    type: 'geo_location';
    geo: {
        /** разрешение клиента на передачу данных */
        geo_permission: 'granted' | 'denied_once' | 'denied_permanently';
        /** признак работы служб геолокации на устройстве, передается только для Android */
        is_geo_available?: boolean;
        locations: Array<{
            /** тип подключения для передачи данных */
            source: string;
            /** широта десятичной дробью */
            lat: string;
            /** долгота десятичной дробью */
            lon: string;
            /** точность в метрах */
            accuracy: string;
            /** время получения координат в миллисекундах (UTC) */
            timestamp: string;
            /** скорость движения в м/с */
            speed?: string;
            /** высота в метрах */
            altitude?: string;
        }>;
    };
}

export interface AppContext {
    app_info: AppInfo;
    device_id: string;
    user_id: string;
    platform: string;
    sdk_version: string;
    surface: Surface | string;
    surface_version: string;
    stand: string;
    locale: 'ru_RU' | string;
    features: { [key: string]: unknown };
}

export interface AssistantAppContext {
    type: 'app_context';
    app_context: AppContext;
    sdk_meta?: SdkMeta;
}

export interface AssistantPlayerCommand {
    type: 'player_command';
    player_command: { [key: string]: unknown };
}

export interface AssistantVisibilityCommand {
    type: 'visibility';
    visibility: 'visible' | 'hidden';
    sdk_meta?: SdkMeta;
}

export interface AssistantSystemCommand {
    type: 'system';
    system: { command: string; [key: string]: unknown };
}

export interface AssistantTtsStateUpdate {
    type: 'tts_state_update';
    state: 'start' | 'stop';
    owner: boolean;
}

export type AssistantClientCustomizedCommand<T extends AssistantSmartAppData> =
    | AssistantAppContext
    | AssistantThemeCommand
    | AssistantCharacterCommand
    | AssistantNavigationCommand
    | AssistantVisibilityCommand
    | AssistantInsetsCommand
    | AssistantSmartAppError
    | AssistantTtsStateUpdate
    | AssistantGeoLocationCommand
    | T;

export type AssistantClientCommand = AssistantClientCustomizedCommand<AssistantSmartAppCommand>;

export interface AssistantClient {
    onStart?: () => void;
    onRequestState?: () => Record<string, unknown>;
    onRequestRecoveryState?: () => unknown;
    onData?: (command: AssistantClientCommand) => void;
}

export interface AssistantHost {
    cancelTts?: (options: string) => void;
    close: () => void;
    getGeo?: () => void;
    ready: () => void;
    sendData: (action: string, message: string | null) => void;
    sendDataContainer: (container: string) => void;
    sendText: (message: string) => void;
    setSuggests: (suggest: string) => void;
    setHints: (hints: string) => void;
    setHeaderButtons?: (headerButtons: SystemMessageHeaderByttonsType) => void;
}

export interface AssistantWindow {
    AssistantHost: AssistantHost;
    AssistantClient?: AssistantClient;
    appInitialData: Array<AssistantClientCommand>;
    appRecoveryState: unknown;

    __dangerouslySendDataMessage?: (data: {}, name: string) => void;
    __dangerouslySendVoiceMessage?: (message: string) => void;
    __dangerouslyGetAssistantAppState?: () => AssistantAppState;
    __dangerouslySendTextMessage?: (text: string) => void;
}

export interface AssistantBackgroundApp {
    appInfo: AppInfo;
    getState?: () => Promise<Record<string, unknown>>;
}

export type EventsType = {
    connecting: () => void;
    ready: () => void;
    close: () => void;
    message: (message: OriginalMessageType) => void;
    systemMessage: (systemMessageData: SystemMessageDataType, originalMessage: OriginalMessageType) => void;
    outcoming: (message: OriginalMessageType) => void;
    connectionError: (error: Event) => void;
};

export type ItemType = Partial<BubbleCommand> &
    Partial<CardCommand> &
    Partial<ActionCommand> & {
        command?: AssistantCommand;
    };

export type AssistantCommand =
    | Omit<AssistantSmartAppData, 'sdk_meta'>
    | Omit<AssistantStartSmartSearch, 'sdk_meta'>
    | Omit<AssistantSystemCommand, 'sdk_meta'>
    | Omit<AssistantNavigationCommand, 'sdk_meta'>
    | {
          type: string;
          [k: string]: unknown;
      };

export type EmotionId =
    | 'bespokoistvo'
    | 'idle'
    | 'igrivost'
    | 'laugh'
    | 'listen'
    | 'load'
    | 'neznayu'
    | 'ok_prinyato'
    | 'oups'
    | 'podavleniye_gneva'
    | 'predvkusheniye'
    | 'simpatiya'
    | 'smushchennaya_ulibka'
    | 'talk'
    | 'udovolstvie'
    | 'vinovatiy'
    | 'zadumalsa'
    | 'zhdu_otvet';

export interface AssistantMeta {
    theme: ThemeColorName;
    [key: string]: unknown;
}

export interface AssistantBackgroundAppInfo {
    app_info: AppInfo;
    state: Record<string, unknown>;
}

export interface SourceMeta {
    sourceType?: string;
    sourceName?: string;
    suggestTitle?: string;
}
export interface Meta extends ScenarioMeta, AssistantMeta {
    background_apps: AssistantBackgroundAppInfo[];
    source?: SourceMeta;
    [key: string]: unknown;
}

export interface AdditionalMeta extends Pick<Meta, 'source'> {
    [key: string]: unknown;
}

export type SystemMessageHeaderByttonsType = SystemMessagePayload['header_buttons'];

export type SystemMessageDataType = {
    activate_app_info?: boolean;
    app_info?: AppInfo;
    auto_listening: boolean;
    finished?: boolean;
    items?: Array<ItemType>;
    suggestions?: Suggestions;
    hints?: Hints;
    character?: Character;
    emotion?: {
        emotionId: EmotionId;
    };
    server_action?: AssistantServerAction;
    sdk_meta?: SdkMeta;
    header_buttons?: SystemMessageHeaderByttonsType;
};

export interface OriginalMessageType {
    messageId: number | Long;
    last: number;
    messageName: string;
    token?: string | null;
    userId?: string | null;
    vpsToken?: string | null;
    version?: number;
    bytes?: IBytes | null;
    voice?: IVoice | null;
    text?: IText | null;
    status?: IStatus | null;
    initialSettings?: IInitialSettings | null;
    cancel?: {} | null;
    device?: IDevice | null;
    legacyDevice?: ILegacyDevice | null;
    settings?: ISettings | null;
    systemMessage?: {
        data?: string | null;
    } | null;
    timestamp?: number | Long | null;
    meta?: { [k: string]: string } | null;
}

export type NonNullableProperties<T> = { [P in keyof T]: NonNullable<T[P]> };
export type Status = Required<NonNullableProperties<IStatus>>;

export interface WSCreator {
    (url: string): WebSocket;
}

export interface FakeVpsParams {
    createFakeWS: WSCreator;
}

export type VpsConfiguration = {
    url: string;
    userId: string;
    userChannel: string;
    locale?: string; // с версии 4 - обязателен
    device?: IDevice;
    settings: ISettings; // version >= 2
    fakeVps?: FakeVpsParams;
    legacyDevice?: ILegacyDevice; // для версии 1 - нужен legacyDevice
    version: VpsVersion;
    messageName?: string;
    vpsToken?: string;
    logger?: ClientLogger;
    getToken?: () => Promise<string>;
};

export interface IncomingMessage {
    type: 'incoming';
    text?: { data?: string | null };
    message?: { data: SystemMessageDataType; name: string; sdk_meta?: SdkMeta };
}

export interface OutcomingMessage {
    type: 'outcoming';
    text?: { data?: string | null };
    message?: { data: { server_action?: any; [key: string]: any }; name: string; sdk_meta?: SdkMeta };
}

export type ClientLoggerInitEntryData = Omit<VpsConfiguration, 'getToken' | 'logger'> & { token: string };
export type ClientLoggerInitEntry = { type: 'init'; params: ClientLoggerInitEntryData };
export type ClientLoggerIncomingEntry = { type: 'incoming'; message: IMessage };
export type ClientLoggerOutcomingEntry = { type: 'outcoming'; message: IMessage };
export type ClientLoggerEntry = ClientLoggerInitEntry | ClientLoggerIncomingEntry | ClientLoggerOutcomingEntry;

export interface ClientLogger {
    (entry: ClientLoggerEntry): void;
}

export interface AssistantRecord {
    parameters?: ClientLoggerInitEntryData;
    entries: Array<IncomingMessage | OutcomingMessage>;
    version: string;
}

export interface RecordSaver {
    save: (record: object) => void;
}

export interface AssistantSettings {
    dubbing?: boolean;
    echo?: number | null;
    ttsEngine?: string | null;
    asrEngine?: string | null;
    asrAutoStop?: number | null;
    devMode?: number | null;
    authConnector?: string | null;
    surface?: string | null;
}

export type AssistantPostMessage =
    | {
          type: 'sendDataContainer';
          payload: string;
      }
    | {
          type: 'close';
      }
    | {
          type: 'sendData';
          payload: string;
      }
    | {
          type: 'setSuggests';
          payload: string;
      }
    | {
          type: 'setHints';
          payload: string;
      }
    | {
          type: 'sendText';
          payload: string;
      }
    | {
          type: 'ready';
      }
    | {
          type: 'onStart';
      }
    | {
          type: 'onData';
          payload: AssistantClientCommand;
      }
    | {
          type: 'onRequestState';
          requestId: string;
      }
    | {
          type: 'onRequestRecoveryState';
      }
    | {
          type: 'state';
          payload: Record<string, unknown> | undefined;
          requestId: string;
      }
    | {
          type: 'recoveryState';
          payload: unknown;
      }
    | {
          type: 'onBack';
      }
    | {
          type: 'setHeaderButtons';
          payload: string;
      };

export type GetHistoryRequestProto = IGetHistoryRequest;

export type GetHistoryRequestClient = Omit<IGetHistoryRequest, 'app' | 'offset'> & {
    app?: Partial<Pick<AppInfo, 'systemName' | 'projectId'> & { type: AppInfo['frontendType'] }> | null;
    offset?: IOffset & {
        limit?: number;
        contentId?: string;
    };
};

export type HistoryMessages = Omit<IHistoryMessages, 'content'> & {
    content: {
        additional_info: string;
        messageId: number;
        type: string;
        system: {
            app_info?: AppInfo;
            items: ItemType[];
            time: Meta['time'];
        };
    };
};
