import { createNanoEvents } from '../../nanoevents';
import { WSCreator } from '../../typings';

import { Transport, TransportEvents, TransportStatus } from './types';

const CONNECTION_TIMEOUT = 5000; // ms (Slow 3G)
const CONNECT_INTERVAL = 300; // ms

const defaultWSCreator: WSCreator = (url: string) => new WebSocket(url);

export const createTransport = (createWS: WSCreator = defaultWSCreator): Transport => {
    const { on, emit } = createNanoEvents<TransportEvents>();

    let connectionTimeoutId: number | undefined;
    let connectTimeoutId: number | undefined;
    let retries = 0;
    let status: TransportStatus = 'closed';
    let webSocket: WebSocket;

    const close = () => {
        if (status === 'closed') {
            return;
        }

        status = 'closing';

        if (connectTimeoutId) {
            clearTimeout(connectTimeoutId);
            connectTimeoutId = undefined;
        }

        webSocket?.close();
    };

    const connect = (url: string) => {
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
            connectionTimeoutId = undefined;

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
                connectTimeoutId = window.setTimeout(() => {
                    connect(url);
                }, CONNECT_INTERVAL * retries);

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

        status = 'connecting';

        emit('connecting');

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
        on,
        open,
        reconnect,
        send,
        get status() {
            if (!window.navigator.onLine) {
                close();
            }

            return status;
        },
    };
};
