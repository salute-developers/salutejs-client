import { AppInfo } from '../../typings';

export interface AudioEncoder {
    destroy: () => void;
    finish: () => void;
    onmessage: (handler: (data: any) => void) => void;
    outPort?: MessagePort;
}

export interface TtsEvent {
    status: 'start' | 'stop';
    messageId: number;
    appInfo: AppInfo;
}
