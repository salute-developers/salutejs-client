import type { VpsConfiguration } from '@salutejs/client';
import { createNavigatorAudioProvider } from '@salutejs/client';
import { createVoiceListener } from '@salutejs/client';

export type InifinteListenParams = Omit<VpsConfiguration, 'fakeVps' | 'logger' | 'getToken' | 'vpsToken'> & {
    token: string;
    voiceMeta: Record<string, unknown>;
};

const worker = new Worker(new URL('./vps.worker.ts', import.meta.url), { type: 'module' });

export function createInifiniteListen(config: InifinteListenParams, restApiUrl: string) {
    const listener = createVoiceListener(
        (cb, ...args) => createNavigatorAudioProvider(cb, ...args),
        (port: MessagePort) => {
            worker.postMessage({ type: 'start' }, [port]);
        },
    );
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
