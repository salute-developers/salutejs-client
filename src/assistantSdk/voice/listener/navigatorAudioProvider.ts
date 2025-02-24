/**
 * Запрашивает у браузера доступ к микрофону и резолвит Promise, если разрешение получено.
 * После получения разрешения, чанки с голосом будут передаваться в cb - пока не будет вызвана функция из результата.
 * @param cb Callback, куда будут передаваться чанки с голосом пользователя
 * @returns Promise, который содержит функцию прерывающую слушание
 */
export const createNavigatorAudioProvider = (
    createAudioRecorder: (
        stream: MediaStream,
        cb: (buffer: ArrayBuffer, analyserArray: Uint8Array | null, last: boolean) => void,
    ) => Promise<() => void>,
    cb: (buffer: ArrayBuffer, analyserArray: Uint8Array | null, last: boolean) => void,
): Promise<() => void> =>
    navigator.mediaDevices
        .getUserMedia({
            audio: {
                /**
                 * Отключение подавления фоновых шумов, автоматического управления громкостью и тд
                 * @see https://developer.mozilla.org/en-US/docs/Web/API/MediaTrackSettings/noiseSuppression
                 * @see https://developer.mozilla.org/en-US/docs/Web/API/MediaTrackSettings/echoCancellation
                 * @see https://developer.mozilla.org/en-US/docs/Web/API/MediaTrackSettings/autoGainControl
                 */
                noiseSuppression: false,
                echoCancellation: false,
                autoGainControl: false,
            },
        })
        .then((stream) => {
            return createAudioRecorder(stream, cb);
        })
        .catch((err) => {
            if (window.location.protocol === 'http:') {
                throw new Error('Audio is supported only on a secure connection');
            }

            throw err;
        });
