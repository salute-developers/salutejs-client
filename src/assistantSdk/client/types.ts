export interface TransportEvents {
    close: () => void;
    connecting: () => void;
    error: (error?: Event | Error) => void;
    message: (data: Uint8Array) => void;
    open: () => void;
}

export interface Transport {
    close: () => void;
    isOnline: boolean;
    on: <K extends keyof TransportEvents>(event: K, callback: TransportEvents[K]) => () => void;
    open: (url: string) => void;
    reconnect: (url: string) => void;
    send: (data: Uint8Array) => void;
}
