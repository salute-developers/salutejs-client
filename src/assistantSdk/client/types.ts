import {
    SystemMessageDataType,
    OriginalMessageType,
    AppInfo,
    AssistantServerActionMode,
    HistoryMessages,
    Status,
    Mid,
    AdditionalMeta,
    WSCreator,
} from '../../typings';

export interface ClientEvents {
    voice: (voice: Uint8Array, original: OriginalMessageType) => void;
    musicRecognition: (response: any, original: OriginalMessageType) => void;
    stt: (data: { text?: OriginalMessageType['text']; response?: any }, original: OriginalMessageType) => void;
    status: (status: Status, original: OriginalMessageType) => void;
    systemMessage: (systemMessage: SystemMessageDataType, original: OriginalMessageType) => void;
    history: (historyMessages: HistoryMessages[], original: OriginalMessageType) => void;
}

export interface AssistantSdkClient {
    destroy: () => void;
    init: () => Promise<void>;
    createVoiceStream: (
        callback: ({ messageId, sendVoice }: { messageId: Mid; sendVoice: (...args: any[]) => void }) => Promise<void>,
        additionalMeta: AdditionalMeta,
    ) => Promise<void>;
    sendData: (data: Record<string, unknown>, messageName?: string, meta?: { [key: string]: string }) => Mid;
    sendMeta: (
        sendSystemMessage: (
            data: { data: Record<string, unknown>; messageName?: string },
            last: boolean,
            params?: { meta?: { [key: string]: string } },
        ) => void,
        additionalMeta?: AdditionalMeta,
    ) => Promise<void>;
    sendOpenAssistant: (params?: { isFirstSession: boolean }) => Promise<SystemMessageDataType>;
    sendServerAction: (
        serverAction: unknown,
        appInfo: AppInfo,
        messageName?: string,
        mode?: AssistantServerActionMode,
    ) => Promise<Mid | undefined>;
    sendText: (
        text: string,
        isSsml?: boolean,
        shouldSendDisableDubbing?: boolean,
        additionalMeta?: AdditionalMeta,
    ) => Promise<Mid | undefined>;
    sendCancel: (messageId: Mid) => void;
    sendMute: (messageId: Mid) => void;
    on: <K extends keyof ClientEvents>(event: K, callback: ClientEvents[K]) => () => void;
    waitForAnswer: (messageId: Mid) => Promise<SystemMessageDataType>;
}

export interface ProtocolError {
    type: 'GET_TOKEN_ERROR';
    message?: string;
}

export interface ProtocolEvents {
    incoming: (message: OriginalMessageType) => void;
    outcoming: (message: OriginalMessageType) => void;
    ready: () => void;
    error: (error: ProtocolError) => void;
}

export interface TransportEvents {
    close: () => void;
    connecting: () => void;
    error: (error?: Event | Error) => void;
    message: (data: Uint8Array) => void;
    open: () => void;
}

export type CreateTransportParams = {
    createWS?: WSCreator;
    checkCertUrl?: string;
};

export interface Transport {
    close: () => void;
    isOnline: boolean;
    on: <K extends keyof TransportEvents>(event: K, callback: TransportEvents[K]) => () => void;
    open: (url: string) => void;
    reconnect: (url: string) => void;
    send: (data: Uint8Array) => void;
}
