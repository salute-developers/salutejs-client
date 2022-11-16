import { createNanoEvents } from '../../nanoevents';
import { WSCreator } from '../../typings';

import { Transport, TransportEvents } from './types';

const CONNECTION_TIMEOUT = 2100; // ms (Slow 3G)
const CONNECT_INTERVAL = 300; // ms

const defaultWSCreator: WSCreator = (url: string) => new WebSocket(url);

export const createTransport = (createWS: WSCreator = defaultWSCreator): Transport => {
    const { on, emit } = createNanoEvents<TransportEvents>();

    let connectionTimeoutId = -1;
    let connectTimeoutId = -1;
    let retries = 0;
    let status: 'closed' | 'closing' | 'connecting' | 'open' = 'closed';
    let webSocket: WebSocket;

    const close = () => {
        if (status === 'closing' || status === 'closed') {
            return;
        }

        status = 'closing';

        clearTimeout(connectTimeoutId);

        webSocket?.close();
    };

    const connect = (url: string) => {
        status = 'connecting';

        emit('connecting');

        retries++;

        webSocket = createWS(url);

        connectionTimeoutId = window.setTimeout(() => {
            webSocket.close();
        }, CONNECTION_TIMEOUT);

        webSocket.binaryType = 'arraybuffer';

        webSocket.addEventListener('open', () => {
            if (webSocket.readyState !== 1) {
                return;
            }

            clearTimeout(connectionTimeoutId);

            retries = 0;

            status = 'open';

            emit('open');
        });

        webSocket.addEventListener('close', () => {
            if (status === 'closing') {
                status = 'closed';

                emit('close');

                return;
            }

            if (retries < 3) {
                connectTimeoutId = window.setTimeout(connect, CONNECT_INTERVAL * retries, url);

                return;
            }

            retries = 0;

            status = 'closed';

            emit('error');

            emit('close');
        });

        webSocket.addEventListener('message', ({ data }) => {
            emit('message', data);
        });
    };

    const open = (url: string) => {
        if (status === 'connecting' || status === 'open') {
            return;
        }

        connect(url);
    };

    const reconnect = (url: string) => {
        if (status === 'closed') {
            open(url);
            return;
        }

        close();
        setTimeout(() => reconnect(url));
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
