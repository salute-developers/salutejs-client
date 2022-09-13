import { OriginalMessageType, MessageNames } from '../../../typings';
import { createVoiceListener } from '../listener/voiceListener';

import { Music2TrackProtocol } from './mtt';

export const createMusicRecognizer = () => {
    const listener = createVoiceListener();
    let off: () => void;
    let currentMessageId: number;

    const stop = () => {
        if (listener.status !== 'stopped') {
            listener.stop();
        }
    };

    const start = ({
        sendVoice,
        messageId,
        onMessage,
    }: {
        sendVoice: (data: Uint8Array, last: boolean, messageName?: string) => void;
        messageId: number;
        onMessage: (cb: (message: OriginalMessageType) => void) => () => void;
    }) => {
        currentMessageId = messageId;

        return listener
            .listen((data: Uint8Array, last: boolean) => sendVoice(data, last, MessageNames.MUSIC_RECOGNITION))
            .then(() => {
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

                        const { decoderResultField, errorResponse } = Music2TrackProtocol.MttResponse.decode(
                            message.bytes.data,
                        );
                        if (decoderResultField?.isFinal || errorResponse) {
                            off();
                            stop();
                        }
                    }
                });
            });
    };

    return {
        start,
        stop,
        on: listener.on,
        get status() {
            return listener.status;
        },
        get messageId() {
            return currentMessageId;
        },
    };
};
