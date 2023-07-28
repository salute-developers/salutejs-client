/// <reference types="cypress" />

import { Server } from 'mock-socket';

import { createAssistantClient } from '../../src';
import { Message } from '../../src/proto';
import { initServer, initAssistantClient } from '../support/helpers/init';
import { createVoiceAnswer } from '../support/helpers/clientMethods.helpers';

describe('Проверяем изменение настроек озвучки', () => {
    const defaultDubbing = -1;

    let server: Server;
    let assistantClient: ReturnType<typeof createAssistantClient>;

    beforeEach(() => {
        server = initServer();
        assistantClient = initAssistantClient({ settings: { dubbing: defaultDubbing } });
    });

    afterEach(() => {
        server?.stop();
    });

    it('Вызов changeSettings должен отправлять Settings - если соединение активно', (done) => {
        let phase: 1 | 2 = 1;

        server.on('connection', (socket) => {
            socket.on('message', (data) => {
                const message = Message.decode((data as Uint8Array).slice(4));
                if (phase === 1 && message.initialSettings) {
                    expect(message.initialSettings.settings?.dubbing, 'dubbing при старте получен').to.equal(
                        defaultDubbing,
                    );
                    assistantClient.changeSettings({ disableDubbing: defaultDubbing !== -1 });
                    phase = 2;
                } else if (phase === 2 && message.settings) {
                    expect(message.settings.dubbing, 'изменения dubbing получены').to.equal(defaultDubbing * -1);
                    done();
                }
            });
        });
        assistantClient.start();
    });

    it('Вызов changeSettings не должен менять настройки протокола и отправлять Settings - если dubbing не поменялся', (done) => {
        let settingsReceived = false;

        server.on('connection', (socket) => {
            socket.on('message', (data) => {
                const message = Message.decode((data as Uint8Array).slice(4));
                if (message.initialSettings) {
                    expect(message.initialSettings.settings?.dubbing, 'dubbing при старте получен').to.equal(
                        defaultDubbing,
                    );
                    assistantClient.changeSettings({ disableDubbing: defaultDubbing === -1 });
                }

                if (message.settings) {
                    settingsReceived = true;
                }
            });
        });

        assistantClient.start();
        cy.wait(1000).then(() => {
            assert.isFalse(settingsReceived, 'Настройки были отправлены');
            done();
        });
    });

    it('Вызов changeSettings должен менять настройки протокола и не отправлять Settings - если соединение неактивно', (done) => {
        let settingsReceived = false;
        let phase: 1 | 2 = 1;

        server.on('connection', (socket) => {
            socket.on('message', (data) => {
                const message = Message.decode((data as Uint8Array).slice(4));
                if (message.initialSettings) {
                    if (phase === 1) {
                        expect(message.initialSettings.settings?.dubbing, 'dubbing при старте получен').to.equal(
                            defaultDubbing,
                        );
                        server.clients()[0].close();
                        assistantClient.changeSettings({ disableDubbing: defaultDubbing !== -1 });
                        phase = 2;
                        return;
                    }

                    expect(message.initialSettings.settings?.dubbing, 'dubbing при рестарте получен').to.equal(
                        defaultDubbing * -1,
                    );
                    done();
                }

                if (message.settings) {
                    settingsReceived = true;
                }
            });
        });

        assistantClient.start();
        cy.wait(1000).then(() => {
            assert.isFalse(settingsReceived, 'Настройки были отправлены');
            assistantClient.start();
        });
    });

    it('При неактивных озвучке и слушании changeSettings применит настройки сразу', (done) => {
        server.on('connection', (socket) => {
            socket.on('message', (data) => {
                const message = Message.decode((data as Uint8Array).slice(4));
                if (message.initialSettings) {
                    assistantClient.changeSettings({ disableDubbing: false });
                    expect(assistantClient.settings.disableDubbing, 'Настройки dubbing изменены').to.equal(false);
                    done();
                }
            });
        });
        assistantClient.start();
        assistantClient.changeSettings({ disableDubbing: true, disableListening: true });
    });

    it('При включенной озвучке changeSettings применит настройки при завершении озвучки', (done) => {
        let phase: 1 | 2 | 3 = 1;

        let intervalId;

        assistantClient.on('tts', ({ status }) => {
            if (status === 'start') {
                phase = 2; // talking phase
                expect(assistantClient.settings.disableDubbing, 'dubbing не изменился во время озвучки').to.equal(
                    false,
                );
                assistantClient.changeSettings({ disableDubbing: true });
            }
            if (status === 'stop' && phase === 2) {
                window.clearInterval(intervalId);
                phase = 3; // stopped talking phase
            }
        });

        server.on('connection', (socket) => {
            socket.on('message', (data) => {
                const message = Message.decode((data as Uint8Array).slice(4));

                if (message.messageName === 'OPEN_ASSISTANT') {
                    intervalId = setInterval(() => {
                        socket.send(
                            createVoiceAnswer({
                                last: -1,
                            }),
                        );
                    }, 100);
                }

                if (phase === 3 && message.settings?.dubbing === -1) {
                    expect(message.settings.dubbing, 'dubbing после завершения озвучки получен').to.equal(
                        defaultDubbing,
                    );
                    done();
                }
            });
        });

        assistantClient.start();
        assistantClient.changeSettings({ disableDubbing: false });
    });
    it('При выключенной озвучке changeSettings применит настройки при прекращении слушания', (done) => {
        let settingsSent = false;
        let cancelRecieved = false;

        server.on('connection', (socket) => {
            socket.on('message', (data) => {
                const message = Message.decode((data as Uint8Array).slice(4));

                if (message.settings && message.settings.dubbing === 1) {
                    assistantClient.listen();
                }

                if (message.voice && !settingsSent) {
                    assistantClient.changeSettings({
                        disableDubbing: true,
                    });
                    settingsSent = true;
                }

                if (message.voice && settingsSent) {
                    assistantClient.stopVoice();
                }

                if (message.cancel) {
                    cancelRecieved = true;
                }

                if (message.settings && settingsSent && cancelRecieved) {
                    expect(message.settings.dubbing, 'dubbing пришел после слушания').to.be.equal(defaultDubbing);
                    done();
                }
            });
        });
        assistantClient.start();
        assistantClient.changeSettings({
            disableDubbing: false,
        });
    });

    it('sendText отправляет переданный текст', (done) => {
        server.on('connection', (socket) => {
            socket.on('message', (data) => {
                const message = Message.decode((data as Uint8Array).slice(4));

                if (message.text) {
                    expect(message.text.data).to.equal('text');
                    done();
                }
            });
        });

        assistantClient.sendText('text');
    });

    it('sendText останавливает озвучку и слушание', (done) => {
        let intervalId;

        assistantClient.on('tts', ({ status }) => {
            if (status === 'start') {
                assistantClient.sendText('text');
            }

            if (status === 'stop') {
                window.clearInterval(intervalId);
                done();
            }
        });

        server.on('connection', (socket) => {
            socket.on('message', (data) => {
                const message = Message.decode((data as Uint8Array).slice(4));

                if (message.messageName === 'OPEN_ASSISTANT') {
                    intervalId = setInterval(() => {
                        socket.send(
                            createVoiceAnswer({
                                last: -1,
                            }),
                        );
                    }, 100);
                }
            });
        });
        assistantClient.start();
        assistantClient.changeSettings({ disableDubbing: false });
    });

    it('sendText при shouldSendDisableDubbing: отправляет {dubbing: -1}', (done) => {
        let settingsReceived = false;
        let textSent = false;

        server.on('connection', (socket) => {
            socket.on('message', (data) => {
                const message = Message.decode((data as Uint8Array).slice(4));

                if (message.settings && textSent && !settingsReceived) {
                    settingsReceived = true;
                    expect(message.settings.dubbing, 'dubbing при sendText получен').to.equal(defaultDubbing);
                    done();
                }

                if (message.settings?.dubbing === 1 && !textSent) {
                    assistantClient.sendText('text', true);
                    textSent = true;
                }
            });
        });

        assistantClient.start();
        assistantClient.changeSettings({ disableDubbing: defaultDubbing !== -1 });
    });
    it('sendText при shouldSendDisableDubbing: не отправляет {dubbing: -1}, если озвучка уже выключена', (done) => {
        let settingsReceived = false;

        server.on('connection', (socket) => {
            socket.on('message', (data) => {
                const message = Message.decode((data as Uint8Array).slice(4));

                if (message.messageName === 'OPEN_ASSISTANT') {
                    assistantClient.sendText('text', true);
                }

                if (message.text) {
                    assert.isFalse(settingsReceived, 'Настройки были отправлены');
                    done();
                }

                if (message.settings) {
                    settingsReceived = true;
                    throw new Error('Настройки были получены');
                }
            });
        });

        assistantClient.start();
    });

    it('stopVoice останавливает озвучку', (done) => {
        let intervalId;

        assistantClient.on('tts', ({ status }) => {
            if (status === 'start') {
                assistantClient.stopVoice();
                return;
            }

            expect(status, 'stopVoice останавливает озвучку').to.equal('stop');
            window.clearInterval(intervalId);
            done();
        });

        server.on('connection', (socket) => {
            socket.on('message', (data) => {
                const message = Message.decode((data as Uint8Array).slice(4));

                if (message.messageName === 'OPEN_ASSISTANT') {
                    intervalId = setInterval(() => {
                        socket.send(
                            createVoiceAnswer({
                                last: -1,
                            }),
                        );
                    }, 100);
                }
            });
        });

        assistantClient.start();
        assistantClient.changeSettings({ disableDubbing: false });
    });

    it('stopVoice останавливает слушание', (done) => {
        let listenerStatus: 'listen' | 'started' | 'stopped' | null = null;

        assistantClient.on('assistant', (event) => {
            if (event.listener) {
                listenerStatus = event.listener.status;
            }

            if (event.asr) {
                expect(listenerStatus, 'stopVoice останавливает слушание').to.equal('stopped');
                done();
            }
        });

        server.on('connection', (socket) => {
            socket.on('message', (data) => {
                const message = Message.decode((data as Uint8Array).slice(4));

                if (message.voice) {
                    assistantClient.stopVoice();
                }
            });
        });

        assistantClient.start();
        assistantClient.listen();
    });
});
