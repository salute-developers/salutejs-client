import { WebSocket } from 'mock-socket';

import { createNanoEvents } from '../../../src/nanoevents';

type ServerEvents = {
    close: (connection: WebSocket) => void;
    connection: (connection: WebSocket) => void;
};

type ConnectionClientEvents = {
    open: (e?: Error | { data: unknown }) => void;
    close: (e?: Error | { data: unknown }) => void;
    error: (e?: Error | { data: unknown }) => void;
    message: (e?: Error | { data: unknown }) => void;
};

type ConnectionServerEvents = {
    close: () => void;
    message: (event: Uint8Array) => void;
};

export const createFakeWs = () => {
    const { on, emit } = createNanoEvents<ServerEvents>();

    const server = {
        on,
    };

    const connect = () => {
        const { on: onConnectionServer, emit: emitConnectionServer } = createNanoEvents<ConnectionServerEvents>();
        const { on: onConnectionClient, emit: emitConnectionClient } = createNanoEvents<ConnectionClientEvents>();

        let readyState: 0 | 1 | 2 | 3 = WebSocket.OPEN;
        let close: () => void;

        // @ts-ignore
        const connectionServer = {
            on: onConnectionServer,
            send: (message: Uint8Array) => {
                emitConnectionClient('message', { data: message });
            },
            close: () => close(),
        } as WebSocket;

        // @ts-ignore
        const connectionClient = {
            addEventListener: onConnectionClient,
            send: (message: Uint8Array) => {
                emitConnectionServer('message', new Uint8Array(message));
            },
            close: () => close(),
            binaryType: 'arraybuffer',
            get readyState() {
                return readyState;
            },
        } as WebSocket;

        close = () => {
            readyState = WebSocket.CLOSED;

            emit('close', connectionClient);
            emitConnectionServer('close');
            emitConnectionClient('close');
        };

        window.setTimeout(() => {
            emit('connection', connectionServer);
            emitConnectionClient('open');
        });

        return connectionClient;
    };

    return {
        server,
        connect,
    };
};
