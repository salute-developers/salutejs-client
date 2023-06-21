import { createAudioContext } from '../audioContext';

/**
 * Понижает sample rate c inSampleRate до значения outSampleRate и преобразует Float32Array в ArrayBuffer
 * @param buffer Аудио
 * @param inSampleRate текущий sample rate
 * @param outSampleRate требуемый sample rate
 * @returns Аудио со значением sample rate = outSampleRate
 */
const downsampleBuffer = (buffer: Float32Array, inSampleRate: number, outSampleRate: number): ArrayBuffer => {
    if (outSampleRate > inSampleRate) {
        throw new Error('downsampling rate show be smaller than original sample rate');
    }
    const sampleRateRatio = inSampleRate / outSampleRate;
    const newLength = Math.round(buffer.length / sampleRateRatio);
    const result = new Int16Array(newLength);

    let offsetResult = 0;
    let offsetBuffer = 0;

    while (offsetResult < result.length) {
        const nextOffsetBuffer = Math.round((offsetResult + 1) * sampleRateRatio);
        let accum = 0;
        let count = 0;
        for (let i = offsetBuffer; i < nextOffsetBuffer && i < buffer.length; i++) {
            accum += buffer[i];
            count++;
        }

        result[offsetResult] = Math.min(1, accum / count) * 0x7fff;
        offsetResult++;
        offsetBuffer = nextOffsetBuffer;
    }

    return result.buffer;
};

const TARGET_SAMPLE_RATE = 16000;
const IS_FIREFOX = typeof window !== 'undefined' && navigator.userAgent.toLowerCase().indexOf('firefox') > -1;
const IS_SAFARI = typeof window !== 'undefined' && /^((?!chrome|android).)*safari/i.test(navigator.userAgent);

let context: AudioContext;
let processor: ScriptProcessorNode;

/**
 * Преобразует stream в чанки (кусочки), и передает их в cb,
 * будет это делать, пока не будет вызвана функция остановки
 * @param stream Аудио-поток
 * @param cb callback, куда будут переданы чанки из потока
 * @returns Функция, вызов которой остановит передачу чанков
 */
const createAudioRecorder = (
    stream: MediaStream,
    cb: (buffer: ArrayBuffer, last: boolean) => void,
): Promise<() => void> =>
    new Promise((resolve) => {
        let state: 'inactive' | 'recording' = 'inactive';
        let input: MediaStreamAudioSourceNode;

        const stop = () => {
            if (state === 'inactive') {
                return;
            }

            state = 'inactive';
            stream.getTracks().forEach((track) => {
                track.stop();
            });
            input.disconnect();
        };

        const start = () => {
            if (state !== 'inactive') {
                throw new Error("Can't start not inactive recorder");
            }

            state = 'recording';

            if (!context) {
                context = createAudioContext({
                    // firefox не умеет выравнивать samplerate, будем делать это самостоятельно
                    sampleRate: IS_FIREFOX ? undefined : TARGET_SAMPLE_RATE,
                });
            }

            input = context.createMediaStreamSource(stream);

            if (!processor) {
                processor = context.createScriptProcessor(2048, 1, 1);
            }

            const listener = (e: AudioProcessingEvent) => {
                const buffer = e.inputBuffer.getChannelData(0);
                const data = downsampleBuffer(buffer, context.sampleRate, TARGET_SAMPLE_RATE);

                const last = state === 'inactive';
                // отсылаем только чанки где есть звук voiceData > 0, т.к.
                // в safari первые несколько чанков со звуком пустые
                const dataWithVoice = new Uint8Array(data).some((voiceData) => voiceData > 0);

                if (!IS_SAFARI || dataWithVoice) {
                    resolve(stop);
                    cb(data, last);
                }

                if (last) {
                    processor.removeEventListener('audioprocess', listener);
                }
            };

            processor.addEventListener('audioprocess', listener);

            input.connect(processor);
            processor.connect(context.destination);
        };

        start();
    });

/**
 * Запрашивает у браузера доступ к микрофону и резолвит Promise, если разрешение получено.
 * После получения разрешения, чанки с голосом будут передаваться в cb - пока не будет вызвана функция из результата.
 * @param cb Callback, куда будут передаваться чанки с голосом пользователя
 * @returns Promise, который содержит функцию прерывающую слушание
 */
export const createNavigatorAudioProvider = (cb: (buffer: ArrayBuffer, last: boolean) => void): Promise<() => void> =>
    navigator.mediaDevices
        .getUserMedia({
            audio: true,
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
