import { createNanoEvents } from '../../nanoevents';
import { WSCreator } from '../../typings';

import { Transport, TransportEvents } from './types';

export type CreateTransportParams = {
    createWS?: WSCreator;
    checkCertUrl?: string;
};

const RETRY_INTERVAL = 300; // ms

const defaultWSCreator: WSCreator = (url: string) => new WebSocket(url);

export const createTransport = ({ createWS = defaultWSCreator, checkCertUrl }: CreateTransportParams): Transport => {
    const { on, emit } = createNanoEvents<TransportEvents>();

    let hasCert = !checkCertUrl;
    let retryTimeoutId = -1;
    let retries = 0;
    let status: 'closed' | 'closing' | 'connecting' | 'open' = 'closed';
    let webSocket: WebSocket;
    let stopped = true;

    const checkCert = (checkUrl: string) =>
        new Promise<boolean>((resolve) => {
            window
                .fetch(checkUrl)
                .then(() => resolve(true))
                .catch(() => resolve(false));
        });

    const close = () => {
        stopped = true;

        if (status === 'closing' || status === 'closed') {
            return;
        }

        status = 'closing';

        webSocket?.close();
    };

    const connect = async (url: string) => {
        status = 'connecting';
        emit('connecting');

        if (!hasCert && window.navigator.onLine) {
            const okay = await checkCert(checkCertUrl!);

            if (!okay) {
                status = 'closed';
                emit('close');

                emit('error', new Error('Cert authority invalid'));

                return;
            }

            hasCert = true;
        }

        webSocket = createWS(url);

        webSocket.binaryType = 'arraybuffer';

        webSocket.addEventListener('open', () => {
            if (webSocket.readyState !== 1) {
                return;
            }

            window.clearTimeout(retryTimeoutId);

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
                window.clearTimeout(retryTimeoutId);

                if (retries < 2) {
                    retryTimeoutId = window.setTimeout(() => {
                        // eslint-disable-next-line @typescript-eslint/no-use-before-define
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

        window.setTimeout(() => reconnect(url));

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
