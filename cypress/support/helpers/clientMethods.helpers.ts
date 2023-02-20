import { Server } from 'mock-socket';

import { appendHeader } from '../../../src/assistantSdk/client/protocol';
import { Message, IText } from '../../../src/proto';
import { SystemMessageDataType, MessageNames, Character } from '../../../src/typings';

type CreateAnswerBuffer1Params = {
    messageId?: number | Long;
    last?: number;
    systemMessage?: Partial<Omit<SystemMessageDataType, 'character'> & { character: Partial<Character> }>;
    messageName?: string;
    text?: IText;
    appendVoice?: boolean;
};

export const createMessage = ({
    messageId = 1,
    last = 1,
    systemMessage,
    messageName = MessageNames.ANSWER_TO_USER,
    text,
    appendVoice = false,
}: CreateAnswerBuffer1Params) => {
    const encodedAsNodeBuffer = appendHeader(
        Message.encode({
            messageId,
            messageName,
            systemMessage: {
                data: systemMessage ? JSON.stringify(systemMessage) : messageId.toString(),
            },
            voice: !appendVoice ? undefined : {
                data: Uint8Array.from({ length: 100 }, () => Math.floor(Math.random() * 5)),
            },
            text,
            last,
        }).finish(),
    );
    const newBuffer = new ArrayBuffer(encodedAsNodeBuffer.byteLength);
    const newBufferView = new Uint8Array(newBuffer);

    newBufferView.set(encodedAsNodeBuffer, 0);

    return newBuffer;
};

export const createVoiceMessage = (params: Omit<CreateAnswerBuffer1Params, 'appendVocie'> = {}) => {
    return createMessage({
        messageName: MessageNames.STT,
        ...params,
        appendVoice: true,
    });
};

export const createServerPong = (server: Server) => {
    server.on('connection', (socket) => {
        socket.binaryType = 'arraybuffer';
        socket.on('message', (ev: Uint8Array) => {
            const message = Message.decode(ev);
            if (!message.initialSettings) {
                const delay = Number(message.text.data);
                setTimeout(() => {
                    socket.send(createMessage({ messageId: message.messageId, last: message.last }));
                }, delay);
            }
        });
    });
};
