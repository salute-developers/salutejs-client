import { createNanoEvents } from '../../../nanoevents';

export type VoiceListenerStatus = 'listen' | 'started' | 'stopped';

export type VoiceHandler = (data: Uint8Array, analyserArray: Uint8Array | null, last: boolean) => void;

type VoiceStreamEvents = {
    status: (status: VoiceListenerStatus) => void;
    hypotesis: (text: string, last: boolean) => void;
};

/**
 * Возвращает объект, позволяющий получать запись голоса пользователя и управлять ею.
 * @param createAudioProvider Источник голоса
 * @returns Api для запуска и остановки слушания
 */
export const createVoiceListener = (
    createAudioProvider: (
        cb: (data: ArrayBuffer, analyserArray: Uint8Array | null, last: boolean) => void,
    ) => Promise<() => void>,
) => {
    const { emit, on } = createNanoEvents<VoiceStreamEvents>();
    let stopRecord: () => void;
    let status: VoiceListenerStatus = 'stopped';
    let cancelableToken = { current: false };

    const stop = () => {
        cancelableToken.current = true;
        cancelableToken = { current: false };
        status = 'stopped';
        stopRecord?.();
        emit('status', 'stopped');
    };

    const listen = (handleVoice?: VoiceHandler): Promise<void> => {
        cancelableToken = { current: false };
        let capturedToken = cancelableToken;
        status = 'started';
        emit('status', 'started');

        return createAudioProvider((data, analyser, last) => handleVoice?.(new Uint8Array(data), analyser, last))
            .then((recStop) => {
                stopRecord = recStop;
            })
            .then(() => {
                if (capturedToken.current === true || status === 'stopped') {
                    stopRecord();
                } else {
                    status = 'listen';
                    emit('status', 'listen');
                }
            })
            .catch((err) => {
                status = 'stopped';
                emit('status', 'stopped');
                throw err;
            });
    };

    return {
        listen,
        stop,
        on,
        get status() {
            return status;
        },
    };
};
