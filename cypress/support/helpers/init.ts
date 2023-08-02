import { Server } from 'mock-socket';

import { createAssistantClient } from 'lib';

const defaultConfiguration: Parameters<typeof createAssistantClient>[0] = {
	settings: { dubbing: -1 },
	getToken: () => Promise.resolve(''),
	url: 'ws://path',
	userChannel: '',
	userId: '',
	version: 5,
};

export const initAssistantClient = (configuration: Partial<Parameters<typeof createAssistantClient>[0]> = {}) => {
	return createAssistantClient({ ...defaultConfiguration, ...configuration });
}

export const initServer = (url = defaultConfiguration.url) => {
	return new Server(url);
};
