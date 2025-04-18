import { AssistantWindow } from './src/typings';

declare global {
    // eslint-disable-next-line @typescript-eslint/no-empty-interface
    interface Window extends AssistantWindow {}

    interface Window {
        webkitAudioContext?: new () => AudioContext;
        Cypress?: any;
    }

    /** import.meta.url */
    declare const __import_meta_url: string;
    declare const __webpack_require__: any;
}
