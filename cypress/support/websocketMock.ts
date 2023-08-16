import { createNanoEvents } from "../../src/nanoevents";

export interface WebSocketEvents {
    open: () => {},
    close: () => {},
    error: (error: Error) => {},
    message: (message : { data: any }) => {},
}

export class WebSocketMock {
    events;
    readyState;
    constructor(url) {
        this.events = createNanoEvents<WebSocketEvents>();
        this.readyState = WebSocket.CONNECTING;
    }

    addEventListener(event: keyof WebSocketEvents, handler: () => {}) {
        this.events.on(event, handler);
    }

    send(data) { }

    close(code, reason) { }
}