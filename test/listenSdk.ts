import type { VpsConfiguration } from '@salutejs/client';
import { createAudioRecorder, createNavigatorAudioProvider, createVoiceListener, OpusEncoder } from '@salutejs/client';

export type InifinteListenParams = Omit<VpsConfiguration, 'fakeVps' | 'logger' | 'getToken' | 'vpsToken'> & {
    token: string;
    voiceMeta?: Record<string, unknown>;
};

const worker = new Worker(new URL('./vps.worker.ts', import.meta.url), { type: 'module' });

export function createInifiniteListen(config: InifinteListenParams, restApiUrl: string) {
    const encoderProvider = (port: MessagePort) => {
        const channel = new MessageChannel();
        const encoder = new OpusEncoder(port, {
            streamMode: true,
            encoderWasmUrl: 'http://localhost:1234/opusEncoder.wasm',
        });
        encoder.outPort = channel.port1;

        worker.postMessage({ type: 'start' }, [channel.port2]);

        return encoder;
    };
    const recorderProvider = (
        stream: MediaStream,
        cb: (data: ArrayBuffer, analyserArray: Uint8Array | null, last: boolean) => void,
    ) => createAudioRecorder(stream, cb, false, encoderProvider);
    const listener = createVoiceListener((cb, ...args) => createNavigatorAudioProvider(recorderProvider, cb, ...args));
    worker.postMessage({ type: 'init', params: [config, restApiUrl] });

    return {
        start: () => {
            listener.listen();
        },
        stop: () => {
            listener.stop();
        },
    };
}
