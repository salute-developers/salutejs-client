import { createNanoEvents } from '../../nanoevents';
import { WSCreator } from '../../typings';

import { Transport, TransportEvents, TransportStatus } from './types';

const defaultWSCreator: WSCreator = (url: string) => new WebSocket(url);

export const createTransport = (createWS: WSCreator = defaultWSCreator): Transport => {
    const { on, emit } = createNanoEvents<TransportEvents>();

    let timeoutId: number | undefined;
    let retries = 0;
    let status: TransportStatus = 'closed';
    let webSocket: WebSocket;

    const close = () => {
        status = 'closing';

        if (timeoutId) {
            clearTimeout(timeoutId);

            timeoutId = undefined;
        }

        webSocket?.close();
    };

    const connect = (url: string) => {
        retries++;

        webSocket = createWS(url);

        webSocket.binaryType = 'arraybuffer';

        webSocket.addEventListener('open', () => {
            if (webSocket.readyState !== 1) {
                return;
            }

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

            emit('close');

            if (retries < 3) {
                timeoutId = window.setTimeout(() => {
                    connect(url);
                }, 300 * retries);

                return;
            }

            retries = 0;

            status = 'closed';

            emit('error');
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
            if (window.navigator.onLine) {
                return status;
            }

            close();

            return status; // 'closing'
        },
    };
};
