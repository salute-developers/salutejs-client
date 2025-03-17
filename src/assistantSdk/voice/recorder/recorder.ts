import { createNanoEvents } from '../../../nanoevents';
import { createNavigatorAudioProvider } from '../listener/navigatorAudioProvider';
import { VoiceListenerStatus } from '../listener/voiceListener';

export type RecorderEvents = {
    chunk: (chunk: Uint8Array) => void;
    status: (status: VoiceListenerStatus) => void;
};

const workerUrl = (() => {
    if (
        // eslint-disable-next-line camelcase
        typeof __webpack_require__ === 'undefined' &&
        (typeof window === 'undefined' || typeof window.Cypress === 'undefined')
    ) {
        return new URL('./worker.js', __import_meta_url);
    }

    return '/src/assistantSdk/voice/recorder/worker.js';
})();

const worker = new Worker(workerUrl, { type: 'module' });

export const createRecorder = () => {
    const { on, emit } = createNanoEvents<RecorderEvents>();

    let status: VoiceListenerStatus = 'stopped';

    let stopListen = () => {};
    let offListen = () => {};
    let resolveGetChunks: null | ((chunks: Uint8Array[]) => void) = null;

    worker.onmessage = ({ data }) => {
        switch (data.type) {
            case 'chunk': {
                emit('chunk', data.chunk);
                break;
            }

            case 'chunks': {
                resolveGetChunks?.(data.chunks);
                break;
            }

            default: {
                break;
            }
        }
    };

    const stop = () => {
        stopListen();
        offListen();

        status = 'stopped';
        emit('status', 'stopped');
    };

    return {
        on,
        listen: (callback?: (chunk: Uint8Array) => void) => {
            if (status !== 'stopped') {
                return Promise.reject();
            }

            let mediaStream: MediaStream;

            offListen();

            if (callback) {
                offListen = on('chunk', callback);
            }

            status = 'started';
            emit('status', 'started');

            return createNavigatorAudioProvider(
                undefined,
                undefined,
                (stream) => {
                    mediaStream = stream;
                },
                (port) => {
                    worker.postMessage({ type: 'listen' }, [port]);
                },
            ).then((stop) => {
                stopListen = stop;

                status = 'listen';
                emit('status', 'listen');

                return mediaStream;
            });
        },
        stop,
        destroy: () => {
            stop();
            worker.terminate();
            worker.onmessage = null;
        },
        get status() {
            return status;
        },
        getCurrent: () => {
            return new Promise((resolve: (chunks: Uint8Array[]) => void) => {
                resolveGetChunks?.([]);

                resolveGetChunks = resolve;

                worker.postMessage({ type: 'getChunks' });
            });
        },
    };
};
