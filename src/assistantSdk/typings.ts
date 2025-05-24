import {
    AssistantCommand,
    AppInfo,
    AssistantAppState,
    CharacterId,
    Mid,
    Status,
    AssistantMeta,
    SystemMessageDataType,
    OriginalMessageType,
    HistoryMessages,
    AssistantSmartAppData,
    AssistantSmartAppError,
    AssistantStartSmartSearch,
} from '../typings';
import { AssistantBackgroundApp } from '../typings';
import { VpsConfiguration } from '../typings';

import { createProtocol } from './client/protocol';
import { VoiceListenerStatus } from './voice/listener/voiceListener';
import { CreateTransportParams, ProtocolError } from './client/types';
import { TtsEvent } from './voice/types';

/**
 * Опции для управления голосовыми возможностями
 */
export interface AssistantSDKVoiceOptions {
    /** URL для wasm модуля энкодера */
    encoderWasmUrl?: string;
    /** Использовать wav вместо opus */
    shouldUseOpus: boolean;
}

/**
 * Настройки ассистента
 */
export interface AssistantSDKSettings {
    /** Отключение фичи воспроизведения голоса */
    disableDubbing: boolean;
    /** Отключение фичи слушания речи */
    disableListening: boolean;
    /** Отправка текстовых сообщений с type: application/ssml */
    sendTextAsSsml: boolean;
    /** абсолютный путь к wasm модулю энкодера */
    encoderWasmUrl?: string;
}

/**
 * Опции для создания ассистента в режиме разработки
 */
export interface CreateAssistantDevOptions {
    getMeta?: () => Record<string, unknown>;
    getInitialMeta?: () => Promise<Record<string, unknown>>;
    /** Подставляет мету в первый чанк с голосом для управления рекогнайзером */
    getVoiceMeta?: () => Record<string, unknown>;
}

/**
 * Параметры для создания ассистента
 */
export type AssistantSDKParams = VpsConfiguration &
    CreateAssistantDevOptions & { voiceOptions?: AssistantSDKVoiceOptions } & Pick<
        CreateTransportParams,
        'checkCertUrl'
    >;

/**
 * Тип для обработки команд фоновых приложений
 */
export type BackgroundAppOnCommand<T> = (
    command: (AssistantSmartAppData & { smart_app_data?: T }) | AssistantSmartAppError | AssistantStartSmartSearch,
    messageId: string,
) => void;

/**
 * События связанные с приложениями
 */
export type AppEvent =
    | { type: 'run'; app: AppInfo }
    | { type: 'close'; app: AppInfo }
    | {
          type: 'command';
          app: AppInfo;
          command: AssistantSmartAppData | AssistantSmartAppError | AssistantStartSmartSearch;
      };

/**
 * События ассистента связанные с голосом, эмоциями и т.д.
 */
export type AssistantSDKEvent = {
    asr?: { text: string; last?: boolean; mid?: OriginalMessageType['messageId'] }; // last и mid нужен для отправки исх бабла в чат
    /**
     * @deprecated Use the `on('assistant', { listener })` and `on('tts', tts)` subscriptions to receive voice events
     */
    emotion?: string;
    mtt?: { response: any; mid: OriginalMessageType['messageId'] };
    listener?: { status: VoiceListenerStatus };
    voiceAnalyser?: { data: Uint8Array };
};

/**
 * События связанные с VPS (виртуальным персональным ассистентом)
 */
export type VpsEvent =
    | { type: 'ready' }
    | { type: 'error'; error: Event | Error | undefined }
    | { type: 'outcoming'; message: OriginalMessageType }
    | { type: 'incoming'; systemMessage: SystemMessageDataType; originalMessage: OriginalMessageType };

/**
 * События команд действий
 */
export type ActionCommandEvent = {
    type: 'command';
    command: any; // ActionCommand;
    appInfo: AppInfo;
};

/**
 * Тип ошибки ассистента
 */
export type AssistantError = ProtocolError;

/**
 * События ассистента, на которые можно подписаться
 */
export type AssistantSDKEvents = {
    app: (event: AppEvent) => void;
    assistant: (event: AssistantSDKEvent) => void;
    vps: (event: VpsEvent) => void;
    actionCommand: (event: ActionCommandEvent) => void;
    command: (command: AssistantCommand) => void;
    status: (status: Status, mid: Mid) => void;
    error: (error: AssistantError) => void;
    history: (history: HistoryMessages[]) => void;
    tts: (event: TtsEvent) => void;
};

/**
 * Тип, представляющий функциональность ассистента, возвращаемую функцией createAssistant
 */
export interface AssistantSDK {
    /**
     * Текущее активное приложение
     */
    readonly activeApp: AppInfo | null;

    /**
     * Текущие настройки ассистента
     */
    readonly settings: {
        disableDubbing: boolean;
        disableListening: boolean;
        sendTextAsSsml: boolean;
        encoderWasmUrl?: string;
    };

    /**
     * Текущий статус ассистента
     */
    readonly status: string;

    /**
     * Уничтожает ассистент, очищает подписки
     */
    destroy: () => void;

    /**
     * Закрывает приложение
     */
    closeApp: (closing?: AppInfo) => void;

    /**
     * Начинает слушать пользователя
     */
    listen: (params?: { begin?: Uint8Array[] }, isAutoListening?: boolean) => Promise<void>;

    /**
     * Запускает распознавание музыки
     */
    shazam: () => Promise<void>;

    /**
     * Отправляет server_action на бэкенд
     */
    sendServerAction: (
        serverAction: unknown,
        messageName?: string,
        requestId?: string,
        actionApp?: AppInfo,
        mode?: 'background' | 'foreground',
    ) => void;

    /**
     * Запрашивает историю сообщений
     */
    getHistoryRequest: (data?: any) => void;

    /**
     * Отправляет текст на сервер
     */
    sendText: (
        text: string,
        shouldSendDisableDubbing?: boolean,
        additionalMeta?: Record<string, unknown>,
    ) => Promise<Mid | undefined>;

    /**
     * Отправляет голосовые данные на сервер
     */
    sendVoice: (chunks: Uint8Array[], messageName?: 'MUSIC_RECOGNITION') => Promise<void>;

    /**
     * Передает потоковые голосовые данные
     */
    streamVoice: (chunks: Uint8Array[], last: boolean, messageName?: 'MUSIC_RECOGNITION') => Promise<void>;

    /**
     * Запускает ассистент (приветствие)
     */
    start: (options?: {
        disableGreetings?: boolean;
        initPhrase?: string;
        isFirstSession?: boolean;
    }) => Promise<SystemMessageDataType | undefined>;

    /**
     * Останавливает ассистент
     */
    stop: () => void;

    /**
     * Останавливает воспроизведение озвучки
     */
    stopTts: () => void;

    /**
     * Останавливает запись голоса
     */
    stopVoice: () => void;

    /**
     * Генерирует событие
     */
    emit: <K extends keyof AssistantSDKEvents>(event: K, ...args: Parameters<AssistantSDKEvents[K]>) => void;

    /**
     * Подписывается на событие
     */
    on: <K extends keyof AssistantSDKEvents>(event: K, callback: AssistantSDKEvents[K]) => () => void;

    /**
     * Изменяет конфигурацию ассистента
     */
    changeConfiguration: (configuration: Record<string, unknown>) => void;

    /**
     * Изменяет настройки ассистента
     */
    changeSettings: (
        settings: Partial<{
            disableDubbing: boolean;
            disableListening: boolean;
            sendTextAsSsml: boolean;
        }>,
    ) => void;

    /**
     * Изменяет SDK мета-данные
     */
    changeSdkMeta: (nextSdkMeta: Partial<AssistantMeta>) => void;

    /**
     * Переподключает ассистента
     */
    reconnect: (configuration?: Record<string, unknown>) => void;

    /**
     * Доступ к протоколу ассистента
     */
    readonly protocol: ReturnType<typeof createProtocol>;

    /**
     * Устанавливает активное приложение
     */
    setActiveApp: (info: AppInfo, getState?: () => Promise<AssistantAppState>) => void;

    /**
     * Добавляет фоновое приложение
     */
    addBackgroundApp: (app: AssistantBackgroundApp) => {
        remove: () => void;
        onCommand: <T>(subscriber: (command: unknown, messageId: string) => void) => {
            clearSubscribers: () => void;
        };
        sendServerAction: (serverAction: unknown, messageName?: string, requestId?: string) => void;
    };

    /**
     * Устанавливает мета-данные для персонажа по умолчанию
     */
    setDefaultCharacterMeta: (characterId: CharacterId) => void;

    /**
     * Включает/выключает анализатор голоса
     */
    toggleVoiceAnalyser: (enable: boolean) => void;
}
