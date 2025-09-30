import type { VpsConfiguration } from '../../typings';
import { createNavigatorAudioProvider } from '../voice/listener/navigatorAudioProvider';
import { createVoiceListener } from '../voice/listener/voiceListener';

export type InifinteListenParams = Omit<VpsConfiguration, 'fakeVps' | 'logger' | 'getToken' | 'vpsToken'> & {
    token: string;
    voiceMeta: Record<string, unknown>;
};

const worker = new Worker(new URL('./vps.worker.js', import.meta.url), { type: 'module' });

export function createInifiniteListen(config: InifinteListenParams, restApiUrl: string) {
    const listener = createVoiceListener(
        (stream, cb, ...args) => createNavigatorAudioProvider(stream, cb, ...args),
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
