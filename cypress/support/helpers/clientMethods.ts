import Long from 'long';
import { Server } from 'mock-socket';

import { appendHeader } from '../../../src/assistantSdk/client/protocol';
import { Message, IText, IStatus, IBytes } from '../../../src/proto';
import { PacketWrapperFromServer } from '../proto/asr';
import { Music2TrackProtocol } from '../proto/mtt';
import { SystemMessageDataType, MessageNames, Character } from '../../../src/typings';

type CreateAnswerBuffer1Params = {
    messageId?: number | Long;
    last?: number;
    systemMessage?: Partial<Omit<SystemMessageDataType, 'character'> & { character: Partial<Character> }>;
    messageName?: string;
    text?: IText;
    status?: IStatus;
    appendVoice?: boolean;
    voiceLength?: number;
    bytes?: IBytes;
};

export const createMessage = ({
    messageId = 1,
    last = 1,
    systemMessage,
    messageName = MessageNames.ANSWER_TO_USER,
    text,
    status,
    voiceLength,
    appendVoice = !!voiceLength,
    bytes,
}: CreateAnswerBuffer1Params) => {
    const encodedAsNodeBuffer = appendHeader(
        Message.encode({
            messageId,
            messageName,
            systemMessage: {
                data: systemMessage ? JSON.stringify(systemMessage) : messageId.toString(),
            },
            voice: !appendVoice
                ? undefined
                : {
                      data: Uint8Array.from({ length: voiceLength || 100 }, () => Math.floor(Math.random() * 5)),
                  },
            text,
            status,
            last,
            bytes,
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

export const createVoiceAnswer = ({ last = 1 }: { last?: number }) => {
    const encodedAsNodeBuffer = appendHeader(
        Message.encode({
            messageId: 1,
            last: last ?? 1,
            messageName: 'TTS',
            voice: {
                data: Uint8Array.from({ length: 100 }, () => Math.floor(Math.random() * 5)),
            },
        }).finish(),
    );
    const newBuffer = new ArrayBuffer(encodedAsNodeBuffer.byteLength);
    const newBufferView = new Uint8Array(newBuffer);
    newBufferView.set(encodedAsNodeBuffer, 0);
    return newBuffer;
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

export const createAsrBytes = (text: string, isFinal: boolean) => {
    return PacketWrapperFromServer.encode({
        decoderResultField: {
            isFinal,
            hypothesis: [
                {
                    words: text,
                    normalizedText: text,
                },
            ],
        },
    }).finish();
};

export const createMttBytes = (isFinal: boolean, error: Music2TrackProtocol.IErrorResponse | null = null) => {
    return Music2TrackProtocol.MttResponse.encode({
        errorResponse: error,
        decoderResultField: { isFinal },
    }).finish();
};
