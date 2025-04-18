import { Recorder } from '../../audio/recorder';
import { createAudioContext } from '../audioContext';

const HTTP_ERROR_MESSAGE = 'Audio is supported only on a secure connection';

let context: AudioContext;

const recorder = new Recorder({
    streamMode: true,
    resolveAudioContext: () => {
        if (!context) {
            context = createAudioContext();
        }

        return context;
    },
});

/**
 * Запрашивает у браузера доступ к микрофону и резолвит Promise, если разрешение получено.
 * После получения разрешения, чанки с голосом будут передаваться в cb - пока не будет вызвана функция из результата.
 * @param cb Callback, куда будут передаваться чанки с голосом пользователя
 * @returns Promise, который содержит функцию прерывающую слушание
 */
export const createNavigatorAudioProvider = (
    cb: (buffer: ArrayBuffer, analyserArray: Uint8Array | null, last: boolean) => void,
    useAnalyser?: boolean,
): Promise<() => void> => {
    return new Promise((resolve, reject) => {
        recorder.stop().then(() => {
            recorder.setAnalyzerEnabled(useAnalyser === true);

            const off = recorder.onData(({ data, analyserData, isLast }) => {
                resolve(recorder.stop.bind(recorder));
                cb(data.buffer, analyserData || null, isLast === true);

                if (isLast === true) {
                    off();
                }
            });

            return recorder
                .start(() => {
                    return window.navigator.mediaDevices.getUserMedia({ audio: true }).catch((err) => {
                        if (window.location.protocol === 'http:') {
                            throw new Error(HTTP_ERROR_MESSAGE);
                        }

                        throw err;
                    });
                })
                .catch(reject);
        });
    });
};
