/// <reference types="cypress" />

import { Server } from 'mock-socket';

import { Message } from '../../src/proto';
import { createAssistantClient, MessageNames, EmotionId } from '../../src';
import { createMessage, createVoiceMessage } from '../support/helpers/clientMethods.helpers';
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

	it('Озвучивание прекращается при установке disableDubbing=true', (done) => {
		let currentEmotion: EmotionId = 'idle';

		server.on('connection', (socket) => {
			socket.on('message', (data) => {
				const message = Message.decode((data as Uint8Array).slice(4));
				const { messageId, text } = message;

				if (text?.data === 'hello') {
					[1,2,3,4,5,6,7,8].forEach((i) => {
						if (i === 4) {
							assistantClient.changeSettings({ disableDubbing: true });
						}

						socket.send(
							createVoiceMessage({
								messageId,
								last: i === 8 ? 1 : -1,
							})
						);

						expect(currentEmotion).eq(i >= 4 ? 'idle' : 'talk', 'Остановка озвучки работает');
						
						if (i === 8) {
							done();
						}
					});
				}
			});
		});

		assistantClient.on('assistant', ({ emotion }) => {
			if (typeof emotion !== 'undefined') {
				currentEmotion = emotion;
			}
		});

		assistantClient.changeSettings({ disableDubbing: false });

		assistantClient.start();

		assistantClient.sendText('hello');
	});

	it('Автослушание не запускается при disableListening=true', () => {
		server.on('connection', (socket) => {
			socket.on('message', (data) => {
				const message = Message.decode((data as Uint8Array).slice(4));
				const { messageId, text, voice } = message;

				if (voice) {
					throw new Error('Слушание запускаться не должно');
				}

				if (text?.data === 'hello') {
					socket.send(
						createMessage({
							messageId,
							messageName: MessageNames.ANSWER_TO_USER,
							systemMessage: {
								auto_listening: true,
								items: [{ bubble: { text: 'Hello!' } }],
							},
							last: 1,
						})
					);
				}
			});
		});

		assistantClient.changeSettings({
			disableDubbing: true,
			disableListening: true,
		});

		assistantClient.start();

		assistantClient.sendText('hello');

		cy.wait(2000);
	});

	it('При установке disableDubbing=true после запуска слушания ответ не озвучивается, запускается автослушание', () => {
		let hadListening = false;

		server.on('connection', (socket) => {
			socket.on('message', (data) => {
				const message = Message.decode((data as Uint8Array).slice(4));
				const { messageId, text, voice } = message;

				if (voice) {
					hadListening = true;
				}

				if (text?.data === 'hello') {
					socket.send(
						createVoiceMessage({
							messageId,
							messageName: MessageNames.ANSWER_TO_USER,
							systemMessage: {
								auto_listening: true,
							},
							last: 1,
						})
					);
				}
			});
		});

		assistantClient.on('assistant', ({ emotion }) => {
			if (emotion === 'talk') {
				throw new Error('Озвучивание запускаться не должно');
			}
		});

		assistantClient.changeSettings({
			disableDubbing: true,
			disableListening: false,
		});

		assistantClient.start();

		assistantClient.sendText('hello');

		// Не используем done(), чтобы в любом случае пройти обе проверки
		cy.wait(2000).then(() => {
			expect(hadListening).eq(true, 'Автослушание должно запуститься');
		});
	});

	const testAutolisteningAfterVoiceAnswer = (done: () => void, disableDubbing: boolean) => {
		let isTestDone = false;

		server.on('connection', (socket) => {
			socket.on('message', (data) => {
				const message = Message.decode((data as Uint8Array).slice(4));
				const { messageId, text, voice } = message;

				if (voice && !isTestDone) {
					done();

					isTestDone = true;
				}

				if (text?.data === 'hello') {
					socket.send(
						createVoiceMessage({
							messageId,
							messageName: MessageNames.ANSWER_TO_USER,
							systemMessage: {
								auto_listening: true,
							},
							last: 1,
						})
					);
				}
			});
		});

		assistantClient.changeSettings({
			disableDubbing,
			disableListening: false,
		});

		assistantClient.start();

		assistantClient.sendText('hello');
	};

	it('Автослушание после голосового ответа работает (при disableDubbing=false)', (done) => {
		testAutolisteningAfterVoiceAnswer(done, false);
	});

	it('Автослушание после голосового ответа работает (при disableDubbing=true)', (done) => {
		testAutolisteningAfterVoiceAnswer(done, true);
	});
});
