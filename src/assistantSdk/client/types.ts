export interface TransportEvents {
    close: () => void;
    connecting: () => void;
    error: (error?: Event) => void;
    message: (data: Uint8Array) => void;
    open: () => void;
}

export type TransportStatus = 'closed' | 'closing' | 'connecting' | 'open';

export interface Transport {
    close: () => void;
    on: <K extends keyof TransportEvents>(event: K, callback: TransportEvents[K]) => () => void;
    open: (url: string) => void;
    reconnect: (url: string) => void;
    send: (data: Uint8Array) => void;
    status: TransportStatus;
}
