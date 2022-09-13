import { createNanoEvents } from '../../../nanoevents';
import { MessageNames, OriginalMessageType } from '../../../typings';
import { createVoiceListener, VoiceHandler, VoiceListenerStatus } from '../listener/voiceListener';

import { PacketWrapperFromServer } from './asr';

type SpeechRecognizerEvents = {
    status: (status: VoiceListenerStatus) => void;
    hypotesis: (text: string, last: boolean, mid: OriginalMessageType['messageId']) => void;
};

export const createSpeechRecognizer = () => {
    const { emit, on } = createNanoEvents<SpeechRecognizerEvents>();
    const listener = createVoiceListener();
    let off: () => void;
    let status: VoiceListenerStatus = 'stopped';
    let currentMessageId: number;

    const stop = () => {
        if (status !== 'stopped') {
            status = 'stopped';
            listener.stop();
            emit('status', 'stopped');
        }
    };

    const start = ({
        sendVoice,
        messageId,
        onMessage,
    }: {
        sendVoice: VoiceHandler;
        messageId: number;
        onMessage: (cb: (message: OriginalMessageType) => void) => () => void;
    }) => {
        currentMessageId = messageId;

        const provider = listener.listen(sendVoice);

        status = 'started';
        emit('status', 'started');

        return provider.then(() => {
            if (listener.status === 'stopped') {
                return;
            }

            status = 'listen';
            emit('status', 'listen');

            off = onMessage((message: OriginalMessageType) => {
                if (message.status && message.status.code != null && message.status.code < 0) {
                    off();
                    stop();
                }

                if (message.messageId === messageId && message.messageName === MessageNames.STT) {
                    if (message.text) {
                        emit('hypotesis', message.text.data || '', message.last === 1, message.messageId);
                        if (message.last === 1) {
                            off();
                            stop();
                        }
                    }

                    if (message.bytes?.data) {
                        const { decoderResultField } = PacketWrapperFromServer.decode(message.bytes.data);

                        if (decoderResultField && decoderResultField.hypothesis?.length) {
                            emit(
                                'hypotesis',
                                decoderResultField.hypothesis[0].normalizedText || '',
                                !!decoderResultField.isFinal,
                                message.messageId,
                            );
                            if (decoderResultField.isFinal) {
                                off();
                                stop();
                            }
                        }
                    }
                }
            });
        });
    };

    return {
        start,
        stop,
        on,
        get status() {
            return status;
        },
        get messageId() {
            return currentMessageId;
        },
    };
};
