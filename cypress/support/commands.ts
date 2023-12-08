import { Server } from 'mock-socket';

import { AssistantWindow } from '../../src/typings';
import { Message } from '../../src/proto';

declare global {
    interface Window extends AssistantWindow {}

    namespace Cypress {
        interface Chainable {
            mockVps: typeof mockVps;
        }
    }
}

const mockVps = (onMessage: (message: Message) => void) => {
    const server = new Server('ws://path');

    server?.on('connection', (socket) => {
        socket.binaryType = 'arraybuffer';
        socket.on('message', (message) => {
            onMessage(Message.decode((message as Uint8Array).slice(4)));
        });
    });

    return cy.wrap(server);
};

Cypress.Commands.add('mockVps', { prevSubject: false }, mockVps);
