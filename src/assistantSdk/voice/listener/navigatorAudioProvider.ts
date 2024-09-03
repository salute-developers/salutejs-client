import { createAudioContext } from '../audioContext';

async function initWorklet(context: AudioContext) {
    await context.audioWorklet.addModule(new URL('./worklet.js', import.meta.url));
}

const TARGET_SAMPLE_RATE = 16000;
const IS_FIREFOX = typeof window !== 'undefined' && navigator.userAgent.toLowerCase().indexOf('firefox') > -1;

let context: AudioContext;
let pcmProcessingNode: AudioWorkletNode;
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
    cb?: (buffer: ArrayBuffer, analyserArray: Uint8Array | null, last: boolean) => void,
    useAnalyser?: boolean,
    onGetPort?: (port: MessagePort) => void,
): Promise<() => void> =>
    new Promise((resolve) => {
        let state: 'inactive' | 'recording' = 'inactive';

        const stop = () => {
            if (state === 'inactive') {
                return;
            }

            state = 'inactive';
            stream.getTracks().forEach((track) => {
                track.stop();
            });
            source.disconnect(pcmProcessingNode);
        };

        const start = async () => {
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
            }

            pcmProcessingNode = new AudioWorkletNode(context, 'pcm-processor', {
                processorOptions: { sampleRate: context.sampleRate },
            });
            if (onGetPort) {
                setTimeout(() => resolve(stop));
                onGetPort(pcmProcessingNode.port);
            } else {
                pcmProcessingNode.port.onmessage = (e) => {
                    const { data } = e;
                    const last = state === 'inactive';

                    let analyserArray: Uint8Array | null = null;
                    if (analyser) {
                        analyserArray = new Uint8Array(analyser.frequencyBinCount);

                        analyser?.getByteTimeDomainData(analyserArray);
                    }

                    resolve(stop);
                    cb && cb(data, analyserArray, last);
                };
            }

            source.connect(pcmProcessingNode);
            pcmProcessingNode.connect(context.destination);
        };

        start();
    });

/**
 * Запрашивает у браузера доступ к микрофону и резолвит Promise, если разрешение получено.
 * После получения разрешения, чанки с голосом будут передаваться в cb - пока не будет вызвана функция из результата.
 * @param cb Callback, куда будут передаваться чанки с голосом пользователя
 * @returns Promise, который содержит функцию прерывающую слушание
 */
export const createNavigatorAudioProvider = (
    cb?: (buffer: ArrayBuffer, analyserArray: Uint8Array | null, last: boolean) => void,
    useAnalyser?: boolean,
    onGetPort?: (port: MessagePort) => void,
): Promise<() => void> =>
    navigator.mediaDevices
        .getUserMedia({
            audio: true,
        })
        .then((stream) => {
            return createAudioRecorder(stream, cb, useAnalyser, onGetPort);
        })
        .catch((err) => {
            if (window.location.protocol === 'http:') {
                throw new Error('Audio is supported only on a secure connection');
            }

            throw err;
        });
