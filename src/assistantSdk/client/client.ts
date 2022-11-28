import { createNanoEvents } from '../../nanoevents';
import { SystemMessageDataType, OriginalMessageType, MessageNames, AppInfo, HistoryMessages } from '../../typings';
import { GetHistoryResponse } from '../../proto';

import { BatchableMethods, createProtocol } from './protocol';

export interface ClientEvents {
    voice: (voice: Uint8Array, original: OriginalMessageType) => void;
    status: (status: OriginalMessageType['status'], original: OriginalMessageType) => void;
    systemMessage: (systemMessage: SystemMessageDataType, original: OriginalMessageType) => void;
    history: (historyMessages: HistoryMessages[], original: OriginalMessageType) => void;
}

export type SystemMessage = SystemMessageDataType & {
    messageId: string;
    messageName: OriginalMessageType[];
};

function convertFieldValuesToString(object: Record<string, unknown>): Record<string, string> {
    return Object.keys(object).reduce((acc: Record<string, string>, key: string) => {
        acc[key] = JSON.stringify(object[key]);
        return acc;
    }, {});
}

export const createClient = (
    protocol: ReturnType<typeof createProtocol>,
    provideMeta: (() => Promise<SystemMessageDataType['meta']>) | undefined = undefined,
) => {
    const { on, emit } = createNanoEvents<ClientEvents>();

    /** ждет ответ бека и возвращает данные из этого ответа */
    const waitForAnswer = (messageId: number | Long): Promise<SystemMessageDataType> =>
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
    const sendData = (
        data: Record<string, unknown>,
        messageName = '',
        meta?: Record<string, unknown>,
    ): number | Long => {
        const messageId = protocol.getMessageId();

        protocol.sendSystemMessage(
            {
                data,
                messageName,
            },
            true,
            messageId,
            { meta: convertFieldValuesToString(meta || {}) },
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
        // eslint-disable-next-line @typescript-eslint/camelcase
        const data = isFirstSession ? { is_first_session: true } : {};
        const meta = provideMeta ? await provideMeta() : {};

        return waitForAnswer(sendData(data, 'OPEN_ASSISTANT', meta));
    };

    /** вызывает sendSystemMessage, куда подкладывает мету */
    const sendMeta = async (
        sendSystemMessage: (
            data: { data: Record<string, unknown>; messageName?: string },
            last: boolean,
            params?: { meta?: Record<string, string> },
        ) => void,
        legacyMeta = false,
    ) => {
        const meta = provideMeta ? await provideMeta() : undefined;

        if (typeof meta !== 'undefined') {
            if (legacyMeta) {
                sendSystemMessage(
                    {
                        data: { meta },
                        messageName: '',
                    },
                    false,
                );

                return;
            }

            sendSystemMessage(
                {
                    // eslint-disable-next-line @typescript-eslint/camelcase
                    data: { app_info: meta.current_app.app_info },
                    messageName: '',
                },
                false,
                { meta: convertFieldValuesToString(meta || {}) },
            );
        }
    };

    /** отправляет server_action и мету */
    const sendServerAction = async (
        serverAction: unknown,
        appInfo: AppInfo,
        messageName = 'SERVER_ACTION',
    ): Promise<number | Long | undefined> => {
        const messageId = protocol.getMessageId();

        // мету и server_action отправляем в одном systemMessage
        await sendMeta((data, _, params) => {
            protocol.sendSystemMessage(
                {
                    // eslint-disable-next-line @typescript-eslint/camelcase
                    data: { ...data, app_info: appInfo, server_action: serverAction },
                    messageName: messageName || 'SERVER_ACTION',
                },
                true,
                messageId,
                params,
            );
        });

        return messageId;
    };

    /** отправляет текст и текущую мету */
    const sendText = async (
        text: string,
        isSsml = false,
        shouldSendDisableDubbing?: boolean,
    ): Promise<number | Long | undefined> => {
        if (text.trim() === '') {
            return undefined;
        }

        return protocol.batch(async ({ sendSystemMessage, sendText: clientSendText, sendSettings, messageId }) => {
            await sendMeta(sendSystemMessage);
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
    ): Promise<void> =>
        protocol.batch(async ({ sendSystemMessage, sendVoice, messageId }) => {
            await sendMeta(sendSystemMessage, true);

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
            emit('status', message.status, message);
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
