import { createNanoEvents } from '../../nanoevents';
import {
    SystemMessageDataType,
    OriginalMessageType,
    MessageNames,
    AppInfo,
    HistoryMessages,
    AdditionalMeta,
    Status,
    AssistantServerActionMode,
} from '../../typings';
import { GetHistoryResponse } from '../../proto';

import { BatchableMethods, createProtocol } from './protocol';
import { SendSystemMessageData, MetaStringified } from './methods';

export interface ClientEvents {
    voice: (voice: Uint8Array, original: OriginalMessageType) => void;
    status: (status: Status, original: OriginalMessageType) => void;
    systemMessage: (systemMessage: SystemMessageDataType, original: OriginalMessageType) => void;
    history: (historyMessages: HistoryMessages[], original: OriginalMessageType) => void;
}

export type SystemMessage = SystemMessageDataType & {
    messageId: string;
    messageName: OriginalMessageType[];
};

export const createClient = (
    protocol: ReturnType<typeof createProtocol>,
    provideMeta: ((additionalMeta?: AdditionalMeta) => Promise<MetaStringified>) | undefined = undefined,
) => {
    const { on, emit } = createNanoEvents<ClientEvents>();

    /** ждет ответ бека и возвращает данные из этого ответа */
    const waitForAnswer = (messageId: number): Promise<SystemMessageDataType> =>
        new Promise((resolve) => {
            const off = on('systemMessage', (systemMessageData, originalMessage) => {
                if (
                    originalMessage.messageId === messageId &&
                    (originalMessage.messageName === MessageNames.ANSWER_TO_USER ||
                        originalMessage.messageName === MessageNames.DO_NOTHING)
                ) {
                    off();
                    resolve(systemMessageData);
                }
            });
        });

    /** отправляет произвольный systemMessage, не подкладывает мету */
    const sendData = (data: Record<string, unknown>, messageName = '', meta?: MetaStringified): number => {
        const messageId = protocol.getMessageId();

        protocol.sendSystemMessage(
            {
                data,
                messageName,
            },
            true,
            messageId,
            { meta: meta || ({} as MetaStringified) },
        );

        return messageId;
    };

    /** отправляет cancel на сообщение */
    const sendCancel = (messageId: number): void => {
        protocol.sendCancel({}, true, messageId);
    };

    /** отправляет приветствие */
    const sendOpenAssistant = async (
        { isFirstSession }: { isFirstSession: boolean } = { isFirstSession: false },
    ): Promise<SystemMessageDataType> => {
        // eslint-disable-next-line camelcase
        const data = isFirstSession ? { is_first_session: true } : {};
        const meta = provideMeta ? await provideMeta() : undefined;

        return waitForAnswer(sendData(data, 'OPEN_ASSISTANT', meta));
    };

    /** вызывает sendSystemMessage, куда подкладывает мету */
    const sendMeta = async (
        sendSystemMessage: (data: SendSystemMessageData, last: boolean, params?: { meta?: MetaStringified }) => void,
        additionalMeta?: AdditionalMeta,
    ) => {
        const meta = provideMeta ? await provideMeta(additionalMeta) : ({} as MetaStringified);

        if (typeof meta !== 'undefined') {
            sendSystemMessage(
                {
                    data: {},
                    messageName: '',
                },
                false,
                {
                    meta: meta as MetaStringified,
                },
            );
        }
    };

    /** отправляет server_action и мету */
    const sendServerAction = async (
        serverAction: unknown,
        appInfo: AppInfo,
        messageName = 'SERVER_ACTION',
        mode?: AssistantServerActionMode,
    ): Promise<number | undefined> => {
        const messageId = protocol.getMessageId();

        // мету и server_action отправляем в одном systemMessage
        await sendMeta(
            (data, _, { meta } = {}) => {
                const { ...systemData } = data;

                protocol.sendSystemMessage(
                    {
                        // eslint-disable-next-line camelcase
                        data: { ...systemData, app_info: appInfo, server_action: serverAction, mode },
                        messageName: messageName || 'SERVER_ACTION',
                    },
                    true,
                    messageId,
                    { meta },
                );
            },
            {
                source: {
                    sourceType: 'vps',
                },
            },
        );

        return messageId;
    };

    /** отправляет текст и текущую мету */
    const sendText = async (
        text: string,
        isSsml = false,
        shouldSendDisableDubbing?: boolean,
        additionalMeta?: AdditionalMeta,
    ): Promise<number | undefined> => {
        if (text.trim() === '') {
            return undefined;
        }

        return protocol.batch(async ({ sendSystemMessage, sendText: clientSendText, sendSettings, messageId }) => {
            await sendMeta(sendSystemMessage, additionalMeta);
            const prevDubbing = protocol.configuration.settings.dubbing;
            const sendDisableDubbing = prevDubbing !== -1 && shouldSendDisableDubbing;

            if (sendDisableDubbing) {
                await sendSettings({ dubbing: -1 }, false);
            }

            isSsml ? clientSendText(text, {}, 'application/ssml') : clientSendText(text, {});

            const isStillNeedReturnDubbing = prevDubbing === protocol.configuration.settings.dubbing;

            if (sendDisableDubbing && isStillNeedReturnDubbing) {
                sendSettings({ dubbing: prevDubbing });
            }

            return messageId;
        });
    };

    /** инициализирует исходящий голосовой поток, факт. передает в callback параметры для отправки голоса,
     * отправляет мету */
    const createVoiceStream = (
        callback: ({
            messageId,
            sendVoice,
            onMessage,
        }: Pick<BatchableMethods, 'messageId' | 'sendVoice'> & {
            onMessage: (cb: (message: OriginalMessageType) => void) => () => void;
        }) => Promise<void>,
        additionalMeta: AdditionalMeta,
    ): Promise<void> =>
        protocol.batch(async ({ sendSystemMessage, sendVoice, messageId }) => {
            await sendMeta(sendSystemMessage, additionalMeta);

            await callback({
                sendVoice,
                messageId,
                onMessage: (cb: (message: OriginalMessageType) => void) => protocol.on('incoming', cb),
            });
        });

    const off = protocol.on('incoming', (message: OriginalMessageType) => {
        if (message.voice) {
            emit('voice', message.voice.data || new Uint8Array(), message);
        }

        if (message.systemMessage?.data) {
            emit('systemMessage', JSON.parse(message.systemMessage.data), message);
        }

        if (message.status) {
            emit('status', message.status as Status, message);
        }

        if (message.messageName === 'TAKE_HISTORY' && message.bytes?.data) {
            const history = GetHistoryResponse.decode(message.bytes?.data).historyMessages;
            const parsedHistory: HistoryMessages[] = history.map((historyMessage) => ({
                ...historyMessage,
                content: JSON.parse(historyMessage.content || ''),
            }));

            emit('history', parsedHistory, message);
        }
    });

    return {
        destroy: () => {
            off();
        },
        init: protocol.init,
        createVoiceStream,
        sendData,
        sendMeta,
        sendOpenAssistant,
        sendServerAction,
        sendText,
        sendCancel,
        on,
        waitForAnswer,
    };
};
