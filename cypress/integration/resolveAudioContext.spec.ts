/// <reference types="cypress" />

import { Message } from '../../src/proto';
import { initServer, initAssistantClient } from '../support/helpers/init';

describe('AudioContext', () => {
    let emitClick = () => {};

    before(() => {
        const audioContext = (() => {
            let state = 'suspended';

            return {
                onstatechange: () => {},
                resume() {
                    state = 'running';

                    this.onstatechange();
                },
                get state() {
                    return state;
                },
            };
        })();

        cy.stub(window, 'AudioContext').callsFake(() => audioContext);

        const listenersStub = cy.stub(document, 'addEventListener');

        emitClick = () => {
            listenersStub.args.forEach(([, listener]) => listener());
        };
    });

    it('Dubbing не будет готов до резолва контекста (резолв при клике по document)', (done) => {
        const server = initServer();
        const assistantClient = initAssistantClient({ settings: { dubbing: 1 } });

        let hasClick = false;

        server.on('connection', (socket) => {
            socket.on('message', (data) => {
                const message = Message.decode((data as Uint8Array).slice(4));

                if (message.initialSettings) {
                    expect(message.initialSettings.settings?.dubbing, 'Dubbing не готов').eq(-1);
                    cy.wait(1000).then(() => {
                        hasClick = true;

                        emitClick();
                    });
                }

                if (message.settings) {
                    expect(hasClick, 'Контекст готов').to.be.true;
                    expect(message.settings?.dubbing, 'Dubbing готов после резолва контекста').eq(1);
                    done();
                }
            });
        });

        assistantClient.start();
    });
});
