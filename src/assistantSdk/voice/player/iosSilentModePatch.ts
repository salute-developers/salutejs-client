const ctx = typeof window !== 'undefined' ? window : self;
const IS_APPLE_MOBILE =
    (/iPad|iPhone|iPod/.test(navigator.platform) ||
        (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)) &&
    !(ctx as any).MSStream;

function createSilentAudioFile(sampleRate: number) {
    const arrayBuffer = new ArrayBuffer(10);
    const dataView = new DataView(arrayBuffer);

    dataView.setUint32(0, sampleRate, true);
    dataView.setUint32(4, sampleRate, true);
    dataView.setUint16(8, 1, true);

    const missingCharacters = window
        .btoa(String.fromCharCode.apply(null, new Uint8Array(arrayBuffer) as unknown as number[]))
        .slice(0, 13);

    return `data:audio/wav;base64,UklGRisAAABXQVZFZm10IBAAAAABAAEA${missingCharacters}AgAZGF0YQcAAACAgICAgICAAAA=`;
}

const createIosSilentModePatch = () => {
    let audio: HTMLAudioElement | null = null;

    const turnOff = () => {
        if (audio === null) {
            return;
        }

        audio.src = 'about:blank';
        audio.load();
        audio = null;
    };

    return {
        turnOff,
        turnOn: () => {
            if (audio) {
                turnOff();
            }

            if (IS_APPLE_MOBILE) {
                audio = new Audio();
                audio.setAttribute('x-webkit-airplay', 'deny');
                audio.preload = 'auto';
                audio.loop = true;
                audio.src = createSilentAudioFile(16000);
                audio.load();
                audio.play().catch(() => {
                    if (audio) {
                        audio.src = 'about:blank';
                        audio.load();
                    }
                });
            }
        },
        get isActive() {
            return audio !== null;
        },
    };
};

export const iosSilentModePatch = createIosSilentModePatch();
