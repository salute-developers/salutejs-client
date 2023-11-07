import { createNanoEvents } from '../../../nanoevents';
import { OriginalMessageType, MessageNames, Mid } from '../../../typings';
import { createVoiceListener } from '../listener/voiceListener';

import { Music2TrackProtocol } from './mtt';

export interface MusicRecognizerEvents {
    response: (result: Music2TrackProtocol.MttResponse, mid: OriginalMessageType['messageId']) => void;
}

export const createMusicRecognizer = (voiceListener: ReturnType<typeof createVoiceListener>) => {
    const { emit, on } = createNanoEvents<MusicRecognizerEvents>();
    let off: () => void;
    let status: 'active' | 'inactive' = 'inactive';
    let currentMessageId: Mid;

    const stop = () => {
        if (voiceListener.status !== 'stopped') {
            status = 'inactive';
            voiceListener.stop();
        }
    };

    const start = ({
        sendVoice,
        messageId,
        onMessage,
    }: {
        sendVoice: (data: Uint8Array, last: boolean, messageName?: string) => void;
        messageId: Mid;
        onMessage: (cb: (message: OriginalMessageType) => void) => () => void;
    }) =>
        voiceListener
            .listen((data: Uint8Array, last: boolean) => !last && sendVoice(data, last, MessageNames.MUSIC_RECOGNITION))
            .then(() => {
                status = 'active';
                currentMessageId = messageId;
                off = onMessage((message: OriginalMessageType) => {
                    if (message.status && message.status.code != null && message.status.code < 0) {
                        off();
                        stop();
                    }

                    if (
                        message.messageId === messageId &&
                        message.messageName.toUpperCase() === MessageNames.MUSIC_RECOGNITION
                    ) {
                        if (!message.bytes?.data?.length) {
                            return;
                        }

                        const response = Music2TrackProtocol.MttResponse.decode(message.bytes.data);
                        emit('response', response, message.messageId);

                        if (response.decoderResultField?.isFinal || response.errorResponse) {
                            off();
                            stop();
                        }
                    }
                });
            });

    return {
        on,
        start,
        stop,
        get status() {
            return status;
        },
        get messageId() {
            return currentMessageId;
        },
    };
};
