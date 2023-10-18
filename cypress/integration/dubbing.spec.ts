import { Server } from 'mock-socket';

import { Message } from '../../src/proto';
import { createAssistantClient, MessageNames } from '../../src';
import { createMessage } from '../support/helpers/clientMethods';
import { initServer, initAssistantClient } from '../support/helpers/init';

describe('Автослушание', () => {
    let server: Server;
    let assistantClient: ReturnType<typeof createAssistantClient>;

    beforeEach(() => {
        server = initServer();
        assistantClient = initAssistantClient();
    });

    afterEach(() => {
        server?.stop();
    });

    it('При принудительной остановке озвучки отправляется Cancel', (done) => {
        server.on('connection', (socket) => {
            socket.on('message', (data) => {
                const message = Message.decode((data as Uint8Array).slice(4));

                if (message.messageName === 'OPEN_ASSISTANT') {
                    socket.send(
                        createMessage({
                            messageId: message.messageId,
                            messageName: MessageNames.ANSWER_TO_USER,
                            appendVoice: true,
                        }),
                    );
                }

                if (message.cancel) {
                    done();
                }
            });
        });

        assistantClient.on('assistant', ({ emotion }) => {
            if (emotion === 'talk') {
                assistantClient.stopVoice();
            }
        });

        assistantClient.changeSettings({ disableDubbing: false });
        assistantClient.start();
    });
});
