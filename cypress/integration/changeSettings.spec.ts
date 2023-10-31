/// <reference types="cypress" />

import { Server } from 'mock-socket';

import { createAssistantClient } from '../../src';
import { Message } from '../../src/proto';
import { initServer, initAssistantClient } from '../support/helpers/init';

describe('Проверяем изменение настроек озвучки', () => {
    let server: Server;
    let assistantClient: ReturnType<typeof createAssistantClient>;

    beforeEach(() => {
        server = initServer();
        assistantClient = initAssistantClient({ settings: { dubbing: -1 } });
    });

    afterEach(() => {
        if (server) {
            server.stop();
        }
    });

    it('sendText всегда использует последний settings.sendTextAsSsml', (done) => {
        server.on('connection', (socket) => {
            let textCount = 0;

            socket.on('message', (data) => {
                const message = Message.decode((data as Uint8Array).slice(4));

                if (message.text) {
                    textCount += 1;

                    expect(
                        message.text.type,
                        textCount === 1 ? 'sendTextAsSsml выключен' : 'sendTextAsSsml включен',
                    ).eq(textCount === 1 ? '' : 'application/ssml');

                    textCount === 2 && done();
                }
            });
        });

        assistantClient.changeSettings({ sendTextAsSsml: false });
        assistantClient.sendText('Lorem');
        assistantClient.listen();
        assistantClient.changeSettings({ sendTextAsSsml: true });
        assistantClient.sendText('Lorem');
    });
});
