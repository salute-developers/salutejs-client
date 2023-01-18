/// <reference types="cypress" />

import { Server } from 'mock-socket';

import { createAssistantClient } from '../../src';
import { Message } from '../../src/proto';

describe('Проверяем изменение настроек озвучки', () => {
    const defaultAddEventListener = document.addEventListener;
    const defaultDubbing = -1;
    const configuration = {
        settings: { dubbing: defaultDubbing },
        getToken: () => Promise.resolve(''),
        url: 'ws://path',
        userChannel: '',
        userId: '',
        version: 5,
    };

    let server: Server;
    let assistantClient: ReturnType<typeof createAssistantClient>;
    let documentClickListeners: Array<EventListenerOrEventListenerObject> = [];

    before(() => {
        Object.defineProperty(window.navigator, 'vendor', {
            get() {
                return 'Apple';
            },
        });

        cy.stub(document, 'addEventListener').callsFake((...args: Parameters<typeof document.addEventListener>) => {
            const [eventName, listener] = args;

            if (eventName === 'click') {
                documentClickListeners.push(listener);
            } else {
                defaultAddEventListener(...args);
            }
        });
    });

    beforeEach(() => {
        server = new Server(configuration.url);
        assistantClient = createAssistantClient(configuration);
    });

    afterEach(() => {
        if (server) {
            server.stop();
        }
    });

    it('Стартовый dubbing всегда -1. По готовности вывода (голоса) - отправляется 1', (done) => {
        assistantClient.changeSettings({ disableDubbing: false });

        server.on('connection', (socket) => {
            socket.on('message', (data) => {
                const message = Message.decode((data as Uint8Array).slice(4));

                if (message.initialSettings) {
                    expect(message.initialSettings.settings?.dubbing, 'При старте озвучка выключена').eq(-1);
                    documentClickListeners.forEach((listener) => (listener as () => void)());

                    return;
                }

                if (message.settings) {
                    expect(message.settings?.dubbing, 'Озвучка включилась по готовности вывода').eq(1);
                    documentClickListeners = [];
                    document.addEventListener = defaultAddEventListener;

                    done();
                }
            });
        });

        assistantClient.start();
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
