import { AssistantWindow } from './src/typings';

declare global {
    // eslint-disable-next-line @typescript-eslint/no-empty-interface
    interface Window extends AssistantWindow {}

    interface Window {
        __ASSISTANT_CLIENT__: {
            version: string;
            firstSmartAppDataMid?: string;
        };
        webkitAudioContext?: new () => AudioContext;
    }
}
