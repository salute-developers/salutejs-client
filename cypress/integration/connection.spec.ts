/// <reference types="cypress" />

import { createAssistantClient } from '../../src';
import { Message } from '../../src/proto';
import { initAssistantClient } from '../support/helpers/init';

describe('Подключение к сокету', () => {
	const serverWs = {
		onmessage: (event: Uint8Array) => {},
		onconnection: () => {},
		onclose: () => {},
	};

	let clientWs: ReturnType<typeof createClientWs>;

	// Собственная реализация необходима, так как пакет mock-socket не эмитит событие сокета close на клиенте.
	// Другие пакеты использовать не хочется
	const createClientWs = () => {
		const listeners: Record<string, Array<(e?: Error | { data: unknown }) => void>> = {};

		let readyState = WebSocket.OPEN;

		const addEventListener = (event: 'open' | 'close' | 'error' | 'message', listener: (event?: Error | { data: unknown }) => void) => {
			if (!listeners[event]) { 
				listeners[event] = [];
			}

			listeners[event].push(listener);
		};

		const send = (event) => {
			serverWs.onmessage?.(event);
		};

		const emit = (event: 'open' | 'close' | 'error' | 'message', data?: Error | unknown) => {
			listeners[event]?.forEach((listener) => {
				switch (event) {
					case 'error':
						listener(data as Error);
						break;
					case 'message':
						listener({ data });
						break;
					case 'open':
					case 'close':
					default:
						listener();
						break;
				}
			});
		}

		const close = () => {
			readyState = WebSocket.CLOSED;

			serverWs.onclose?.();
			emit('close');
		}

		serverWs.onconnection?.();
		window.setTimeout(() => emit('open'));

		// @ts-ignore
		return {
			addEventListener,
			send,
			emit,
			close,
			binaryType: 'arraybuffer',
			get readyState() {
				return readyState;
			},
		} as WebSocket;
	};

	let assistantClient: ReturnType<typeof createAssistantClient>;

    beforeEach(() => {
        assistantClient = initAssistantClient({
			fakeVps: {
				createFakeWS: () => {
					clientWs = createClientWs();

					return clientWs;
				},
			},
		});
    });

    it('Переподключение к сокету при разрыве соединения работает', (done) => {
		let connectionTimes = 0;

		serverWs.onconnection = () => {
			connectionTimes += 1;
		};

		serverWs.onmessage = (messageOriginal) => {
			const { messageName, text } = Message.decode(messageOriginal.slice(4));

			if (messageName === 'OPEN_ASSISTANT') {
				// В `protocol` установлен таймаут на 500ms, в течении которых сокет считается открытым
				window.setTimeout(clientWs.close, 1000);
			}

			if (text?.data === 'reconnect' && connectionTimes === 2) {
				done();
			}
		};

		serverWs.onclose = () => {
			assistantClient.sendText('reconnect');
		};

        assistantClient.start();
    });
});
