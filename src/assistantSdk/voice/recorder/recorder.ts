import { createAudioContext } from '../audioContext';
import { TARGET_SAMPLE_RATE } from '../const';
import { AudioEncoder } from '../types';

// @ts-ignore
import workletCode from './worklet.js';

const IS_FIREFOX = typeof window !== 'undefined' && navigator.userAgent.toLowerCase().indexOf('firefox') > -1;

async function initWorklet(context: AudioContext) {
    await context.audioWorklet.addModule(
        URL.createObjectURL(new Blob([workletCode], { type: 'application/javascript' })),
    );
}

let context: AudioContext;
let pcmProcessingNode: AudioWorkletNode;
let source: MediaStreamAudioSourceNode;
let analyser: AnalyserNode | null = null;
let encoder: AudioEncoder | null = null;
/**
 * Преобразует stream в чанки (кусочки), и передает их в cb,
 * будет это делать, пока не будет вызвана функция остановки
 * @param stream Аудио-поток
 * @param cb callback, куда будут переданы чанки из потока
 * @returns Функция, вызов которой остановит передачу чанков
 */
export const createAudioRecorder = (
    stream: MediaStream,
    cb?: (buffer: ArrayBuffer, analyserArray: Uint8Array | null, last: boolean) => void,
    useAnalyser?: boolean,
    createEncoder?: (port: MessagePort) => AudioEncoder,
    // onGetPort?: (port: MessagePort) => void,
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
            encoder?.finish();
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
                analyser.fftSize = 2048;
            }

            if (typeof window !== 'undefined' && (window as any).Cypress) {
                resolve(stop);
                cb && cb(new ArrayBuffer(0), null, false);
                return;
            }

            pcmProcessingNode = new AudioWorkletNode(context, 'pcm-processor', {
                processorOptions: { sampleRate: context.sampleRate },
            });
            if (createEncoder) {
                encoder = createEncoder(pcmProcessingNode.port);
                encoder.onmessage = (data: any) => {
                    const last = state === 'inactive';

                    let analyserArray: Uint8Array | null = null;
                    if (analyser) {
                        analyserArray = new Uint8Array(analyser.frequencyBinCount);

                        analyser?.getByteTimeDomainData(analyserArray);
                    }

                    if (last) {
                        encoder?.destroy();
                        encoder = null;
                    }

                    resolve(stop);
                    cb && cb(data, analyserArray, last);
                };
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
