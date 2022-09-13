import { createNanoEvents } from '../../../nanoevents';

import { createNavigatorAudioProvider } from './navigatorAudioProvider';

export type VoiceListenerStatus = 'listen' | 'started' | 'stopped';

export type VoiceHandler = (data: Uint8Array, last: boolean) => void;

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
        cb: (data: ArrayBuffer, last: boolean) => void,
    ) => Promise<() => void> = createNavigatorAudioProvider,
) => {
    const { emit, on } = createNanoEvents<VoiceStreamEvents>();
    let stopRecord: () => void;
    let status: VoiceListenerStatus = 'stopped';

    const stop = () => {
        status = 'stopped';
        stopRecord?.();
        emit('status', 'stopped');
    };

    const listen = (handleVoice: VoiceHandler) => {
        status = 'started';
        emit('status', 'started');

        return createAudioProvider((data: ArrayBuffer, last: boolean) => {
            if (status !== 'stopped' || last) {
                handleVoice(new Uint8Array(data), last);
            }
        })
            .then((recStop) => {
                stopRecord = recStop;
            })
            .then(() => {
                if (status === 'stopped') {
                    stopRecord();
                    return;
                }

                status = 'listen';
                emit('status', 'listen');
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
