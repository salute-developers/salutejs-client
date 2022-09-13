import { createNanoEvents } from '../../../nanoevents';
import { VoiceListenerStatus } from '../listener/voiceListener';

import { createMusicRecognizer } from './musicRecognizer';
import { createSpeechRecognizer } from './speechRecognizer';

type RecognizersEvents = {
    status: (status: VoiceListenerStatus) => void;
};

export const createRecognizers = () => {
    const { emit, on } = createNanoEvents<RecognizersEvents>();
    const speechRecognizer = createSpeechRecognizer();
    const musicRecognizer = createMusicRecognizer();

    const off1 = speechRecognizer.on('status', (status) => {
        switch (status) {
            case 'stopped':
                if (musicRecognizer.status === 'stopped') {
                    emit('status', 'stopped');
                }
                break;
            case 'listen':
            case 'started':
            default:
                if (musicRecognizer.status !== status) {
                    emit('status', status);
                }
                break;
        }
    });

    const off2 = musicRecognizer.on('status', (status) => {
        switch (status) {
            case 'stopped':
                if (speechRecognizer.status === 'stopped') {
                    emit('status', 'stopped');
                }
                break;
            case 'listen':
            case 'started':
            default:
                if (speechRecognizer.status !== status) {
                    emit('status', status);
                }
                break;
        }
    });

    return {
        on,
        destroy: () => {
            off1();
            off2();

            if (speechRecognizer.status !== 'stopped') {
                speechRecognizer.stop();
            }

            if (musicRecognizer.status !== 'stopped') {
                musicRecognizer.stop();
            }
        },
        speechRecognizer,
        musicRecognizer,
    };
};
