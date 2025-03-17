import { createAudioContext } from '../audioContext';

const workletUrl = (() => {
    if (
        // eslint-disable-next-line camelcase
        typeof __webpack_require__ === 'undefined' &&
        (typeof window === 'undefined' || typeof window.Cypress === 'undefined')
    ) {
        return new URL('./worklet.js', __import_meta_url);
    }

    return '/src/assistantSdk/voice/listener/worklet.js';
})();

async function initWorklet(context: AudioContext) {
    await context.audioWorklet.addModule(workletUrl);
}

const TARGET_SAMPLE_RATE = 16000;
const IS_FIREFOX = typeof window !== 'undefined' && navigator.userAgent.toLowerCase().indexOf('firefox') > -1;

let context: AudioContext;
let workletNode: AudioWorkletNode;
let source: MediaStreamAudioSourceNode;
let analyser: AnalyserNode | null = null;

/**
 * Преобразует stream в чанки (кусочки), и передает их в cb,
 * будет это делать, пока не будет вызвана функция остановки
 * @param stream Аудио-поток
 * @param cb callback, куда будут переданы чанки из потока
 * @returns Функция, вызов которой остановит передачу чанков
 */
const createAudioRecorder = (
    stream: MediaStream,
    callback?: (buffer: ArrayBuffer, analyserArray: Uint8Array | null, last: boolean) => void,
    setMessagePort?: (port: MessagePort) => void,
    useAnalyser?: boolean,
): Promise<() => void> => {
    return new Promise((resolve) => {
        let state: 'inactive' | 'recording' = 'inactive';

        const stop = () => {
            if (state === 'inactive') {
                return;
            }

            state = 'inactive';
            stream.getTracks().forEach((track) => {
                track.stop();
            });
            source.disconnect(workletNode);
        };

        (async () => {
            if (state !== 'inactive') {
                throw new Error("Can't start not inactive recorder");
            }

            state = 'recording';

            if (!context) {
                context = createAudioContext({
                    // firefox не умеет выравнивать samplerate, будем делать это самостоятельно
                    sampleRate: IS_FIREFOX ? undefined : TARGET_SAMPLE_RATE,
                });

                await initWorklet(context);
            }

            source = context.createMediaStreamSource(stream);

            if (!analyser && useAnalyser) {
                analyser = context.createAnalyser();
                analyser.fftSize = 1024;
            }

            workletNode = new AudioWorkletNode(context, 'pcm-processor', {
                processorOptions: { sampleRate: context.sampleRate },
            });

            if (setMessagePort) {
                setMessagePort(workletNode.port);
                setTimeout(() => resolve(stop));
            }

            if (callback) {
                workletNode.port.onmessage = (message) => {
                    const last = state === 'inactive';

                    let analyserArray: Uint8Array | null = null;

                    if (analyser) {
                        analyserArray = new Uint8Array(analyser.frequencyBinCount);

                        analyser?.getByteTimeDomainData(analyserArray);
                    }

                    resolve(stop);
                    callback?.(message.data, analyserArray, last);
                };
            }

            source.connect(workletNode);
            workletNode.connect(context.destination);
        })();
    });
};

/**
 * Запрашивает у браузера доступ к микрофону и резолвит Promise, если разрешение получено.
 * После получения разрешения, чанки с голосом будут передаваться в cb - пока не будет вызвана функция из результата.
 * @param cb Callback, куда будут передаваться чанки с голосом пользователя
 * @returns Promise, который содержит функцию прерывающую слушание
 */
export const createNavigatorAudioProvider = (
    cb?: (buffer: ArrayBuffer, analyserArray: Uint8Array | null, last: boolean) => void,
    useAnalyser?: boolean,
    setMediaStream?: (mediaStream: MediaStream) => void,
    setMessagePort?: (port: MessagePort) => void,
): Promise<() => void> => {
    return navigator.mediaDevices
        .getUserMedia({
            audio: {
                /**
                 * Отключение автоматической обработки аудио
                 * @see https://developer.mozilla.org/en-US/docs/Web/API/MediaTrackSettings/noiseSuppression
                 * @see https://developer.mozilla.org/en-US/docs/Web/API/MediaTrackSettings/echoCancellation
                 */
                noiseSuppression: false,
                echoCancellation: false,
            },
        })
        .then((stream) => {
            setMediaStream?.(stream);

            return createAudioRecorder(stream, cb, setMessagePort, useAnalyser);
        })
        .catch((err) => {
            if (window.location.protocol === 'http:') {
                throw new Error('Audio is supported only on a secure connection');
            }

            throw err;
        });
};
