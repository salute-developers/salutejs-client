import { createNanoEvents } from '../../nanoevents';
import { WSCreator } from '../../typings';

import { Transport, TransportEvents } from './types';

const RETRY_INTERVAL = 300; // ms

const defaultWSCreator: WSCreator = (url: string) => new WebSocket(url);

export const createTransport = (createWS: WSCreator = defaultWSCreator): Transport => {
    const { on, emit } = createNanoEvents<TransportEvents>();

    let retryTimeoutId = -1;
    let retries = 0;
    let status: 'closed' | 'closing' | 'connecting' | 'open' = 'closed';
    let webSocket: WebSocket;
    let stopped = true;

    const close = () => {
        stopped = true;
        if (status === 'closing' || status === 'closed') {
            return;
        }

        status = 'closing';
        webSocket?.close();
    };

    const connect = (url: string) => {
        status = 'connecting';

        emit('connecting');

        webSocket = createWS(url);

        webSocket.binaryType = 'arraybuffer';

        webSocket.addEventListener('open', () => {
            if (webSocket.readyState !== 1) {
                return;
            }

            clearTimeout(retryTimeoutId);

            retries = 0;

            status = 'open';

            emit('open');
        });

        webSocket.addEventListener('close', () => {
            status = 'closed';
            emit('close');
        });

        webSocket.addEventListener('error', (e) => {
            if (status !== 'connecting') {
                throw e;
            }

            // пробуем переподключаться, если возникла ошибка при коннекте
            if (!webSocket || (webSocket.readyState === 3 && !stopped)) {
                clearTimeout(retryTimeoutId);

                if (retries < 2) {
                    retryTimeoutId = window.setTimeout(() => {
                        open(url);
                        retries++;
                    }, RETRY_INTERVAL * retries);
                } else {
                    retries = 0;
                    emit('error', e);
                }
            }
        });

        webSocket.addEventListener('message', ({ data }) => {
            emit('message', data);
        });
    };

    const open = (url: string) => {
        if (status === 'connecting' || status === 'open') {
            return;
        }

        stopped = false;
        connect(url);
    };

    const reconnect = (url: string) => {
        if (status === 'closed') {
            open(url);
            return;
        }

        setTimeout(() => reconnect(url));
        close();
    };

    const send = (data: Uint8Array) => {
        webSocket.send(data);
    };

    return {
        close,
        get isOnline() {
            return window.navigator.onLine;
        },
        on,
        open,
        reconnect,
        send,
    };
};
