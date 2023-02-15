import {
    Settings,
    SystemMessage,
    Device,
    IDevice,
    ISettings,
    Text,
    Voice,
    LegacyDevice,
    ILegacyDevice,
    InitialSettings,
    IInitialSettings,
    Cancel,
    ICancel,
    IMessage,
    IChatHistoryRequest,
    ChatHistoryRequest,
} from '../../proto';
import { Meta, VpsVersion, GetHistoryRequestClient, GetHistoryRequestProto } from '../../typings';

export type MetaStringified = { [key in keyof Meta]: string };

export type BatchableMethods = {
    sendText: (
        data: string,
        params?: {
            messageId?: number;
            last?: 1 | -1;
            messageName?: string;
            vpsToken?: string;
            userId?: string;
            token?: string;
            userChannel?: string;
            version?: VpsVersion;
            meta?: MetaStringified;
        },
        type?: string,
        messageId?: number,
    ) => void;
    sendSystemMessage: (
        data: { data: Record<string, unknown>; messageName?: string },
        last: boolean,
        params?: {
            meta?: MetaStringified;
        },
    ) => void;
    sendVoice: (
        data: Uint8Array,
        last: boolean,
        messageName?: string,
        params?: {
            meta?: MetaStringified;
        },
    ) => void;
    sendSettings: (data: ISettings, last?: boolean, messageId?: number) => void;
    messageId: number;
};

export type SendSystemMessageData = {
    data: Record<string, unknown>;
    messageName?: string;
};

export const createClientMethods = ({
    getMessageId,
    sendMessage,
}: {
    getMessageId: () => number;
    sendMessage: (message: IMessage) => void;
}) => {
    const send = ({
        payload,
        messageId,
        ...other
    }: {
        payload: (
            | { settings: Settings }
            | { device: Device }
            | { systemMessage: SystemMessage }
            | { text: Text }
            | { voice: Voice }
            | { legacyDevice: LegacyDevice }
            | { initialSettings: InitialSettings }
            | { cancel: Cancel }
            | IChatHistoryRequest
        ) & {
            last: 1 | -1;
            messageName?: string;
            meta?: MetaStringified;
        };
        messageId: number;
    }) => {
        sendMessage({
            messageName: '',
            ...payload,
            messageId,
            ...other,
        });
    };

    const sendDevice = (data: IDevice, last = true, messageId = getMessageId()) => {
        return send({
            payload: {
                device: Device.create(data),
                last: last ? 1 : -1,
            },
            messageId,
        });
    };

    const sendInitialSettings = (
        data: IInitialSettings,
        last = true,
        messageId = getMessageId(),
        params: { meta?: MetaStringified } = {},
    ) => {
        return send({
            payload: {
                initialSettings: InitialSettings.create(data),
                last: last ? 1 : -1,
                ...params,
            },
            messageId,
        });
    };

    const getHistoryRequest = (
        data: Required<Omit<IChatHistoryRequest, 'getHistoryRequest'>> & { history?: GetHistoryRequestClient },
        last = true,
        messageId = getMessageId(),
    ) => {
        const { uuid, device, history: historyClient } = data;
        const historyProto: GetHistoryRequestProto = { messageTypes: historyClient?.messageTypes };

        // Мапим объект настроек от пользователя в формат объекта протобафа
        if (historyClient?.app) {
            historyProto.app = Object.entries(historyClient.app).reduce(
                (acc, [key, value]) => ({ ...acc, [key]: { value } }),
                {},
            );
        }

        if (historyClient?.offset) {
            historyProto.offset = Object.entries(historyClient.offset).reduce(
                (acc, [key, value]) => ({ ...acc, [key]: { value: value.toString() } }),
                {},
            );
        }

        return send({
            payload: {
                ...ChatHistoryRequest.create({
                    uuid,
                    device,
                    getHistoryRequest: historyProto,
                }),
                messageName: 'GET_HISTORY',
                last: last ? 1 : -1,
            },
            messageId,
        });
    };

    const sendCancel = (data: ICancel, last = true, messageId = getMessageId()) => {
        return send({
            payload: {
                cancel: Cancel.create(data),
                last: last ? 1 : -1,
            },
            messageId,
        });
    };

    const sendLegacyDevice = (data: ILegacyDevice, last = true, messageId = getMessageId()) => {
        return send({
            payload: {
                legacyDevice: LegacyDevice.create(data),
                last: last ? 1 : -1,
            },
            messageId,
        });
    };

    const sendSettings = (data: ISettings, last = true, messageId = getMessageId()) => {
        return send({
            payload: {
                settings: Settings.create(data),
                last: last ? 1 : -1,
            },
            messageId,
        });
    };

    const sendText = (
        data: string,
        params: {
            messageId?: number;
            last?: 1 | -1;
            messageName?: string;
            vpsToken?: string;
            userId?: string;
            token?: string;
            userChannel?: string;
            version?: VpsVersion;
            meta?: MetaStringified;
        } = {},
        type = '',
        messageId = getMessageId(),
    ) => {
        const text = type ? { data, type } : { data };
        send({
            payload: {
                text: Text.create(text),
                last: params.last ?? 1,
            },
            messageId,
            ...params,
        });
    };

    const sendSystemMessage = (
        { data, messageName: mesName = '' }: { data: Record<string, unknown>; messageName?: string },
        last = true,
        messageId = getMessageId(),
        params: {
            meta?: MetaStringified;
        } = {},
    ) => {
        send({
            payload: {
                systemMessage: SystemMessage.create({
                    data: JSON.stringify(data),
                }),
                messageName: mesName,
                last: last ? 1 : -1,
                ...params,
            },
            messageId,
        });
    };

    const sendVoice = (
        data: Uint8Array,
        last = true,
        messageId = getMessageId(),
        mesName?: string,
        params: {
            meta?: MetaStringified;
        } = {},
    ) => {
        return send({
            payload: {
                voice: Voice.create({
                    data: new Uint8Array(data),
                }),
                messageName: mesName,
                last: last ? 1 : -1,
                ...params,
            },
            messageId,
        });
    };

    const batch = <T>(cb: (methods: BatchableMethods) => T): T => {
        const batchingMessageId = getMessageId();
        let lastMessageSent = false;
        const checkLastMessageStatus = (last?: boolean) => {
            if (lastMessageSent) {
                if (last) {
                    throw new Error("Can't send two last items in batch");
                } else {
                    throw new Error("Can't send messages in batch after last message have been sent");
                }
            } else if (last) {
                lastMessageSent = true;
            }
        };

        const upgradedSendText: typeof sendText = (...[data, params, type]) => {
            checkLastMessageStatus(params?.last === 1);
            return sendText(data, params, type, batchingMessageId);
        };

        const upgradedSendSystemMessage: (
            data: { data: Record<string, unknown>; messageName?: string },
            last: boolean,
            params?: {
                meta?: MetaStringified;
            },
        ) => ReturnType<typeof sendSystemMessage> = (data, last, params) => {
            checkLastMessageStatus(last);
            return sendSystemMessage(data, last, batchingMessageId, params);
        };

        const upgradedSendVoice: (
            data: Uint8Array,
            last: boolean,
            messageName?: string,
            params?: {
                meta?: MetaStringified;
            },
        ) => ReturnType<typeof sendVoice> = (data, last, mesName, params) => {
            checkLastMessageStatus(last);
            return sendVoice(data, last, batchingMessageId, mesName, params);
        };

        const upgradedSendSettings: (
            data: ISettings,
            last?: boolean,
            messageId?: number,
        ) => ReturnType<typeof sendSettings> = (data, last, messageId) => {
            checkLastMessageStatus(last);
            return sendSettings(data, last, messageId);
        };

        return cb({
            sendText: upgradedSendText,
            sendSystemMessage: upgradedSendSystemMessage,
            sendVoice: upgradedSendVoice,
            sendSettings: upgradedSendSettings,
            messageId: batchingMessageId,
        });
    };

    return {
        sendDevice,
        sendInitialSettings,
        getHistoryRequest,
        sendCancel,
        sendLegacyDevice,
        sendSettings,
        sendText,
        sendSystemMessage,
        sendVoice,
        batch,
    };
};
