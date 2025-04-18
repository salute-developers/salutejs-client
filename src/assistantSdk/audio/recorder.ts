export const IS_RECORDING_SUPPORTED = Boolean(
    AudioContext && !!window.navigator?.mediaDevices?.getUserMedia && window.WebAssembly,
);

const encoderWorkerUrl = (() => {
    if (
        // eslint-disable-next-line camelcase
        typeof __webpack_require__ === 'undefined' &&
        (typeof window === 'undefined' || typeof window.Cypress === 'undefined')
    ) {
        return new URL('./encoderWorker.min.js', __import_meta_url);
    }

    return '/src/assistantSdk/audio/encoderWorker.min.js';
})();

const encoderWasmUrl = (() => {
    if (
        // eslint-disable-next-line camelcase
        typeof __webpack_require__ === 'undefined' &&
        (typeof window === 'undefined' || typeof window.Cypress === 'undefined')
    ) {
        return new URL('./encoderWasm.wasm', __import_meta_url);
    }

    return '/src/assistantSdk/audio/encoderWasm.wasm';
})();

export type RecorderData = {
    data: Uint8Array;
    /** Только при analyzerEnabled=false */
    analyserData?: Uint8Array;
    /** Только при streamMode=false */
    duration?: number;
    /** Только при streamMode=true */
    isLast?: boolean;
};

export type RecorderConfig = {
    /** Размер буфера для аудио данных в байтах */
    bufferLength?: number;
    /** Размер фрейма энкодера в миллисекундах */
    encoderFrameSize?: number;
    /** Частота дискретизации энкодера в Гц */
    encoderSampleRate?: number;
    /** Максимальное количество фреймов на страницу */
    maxFramesPerPage?: number;
    /** Количество аудио каналов (1 - моно, 2 - стерео) */
    numberOfChannels?: number;
    /** Качество передискретизации (от 0 до 10) */
    resampleQuality?: number;
    /**
     * 2048 - Запись голоса
     * 2049 - Полная полоса частот
     * 2051 - Ограниченная задержка
     * */
    encoderApplication?: number;
    /** целевой битрейт */
    encoderBitRate?: number;
};

export type RecorderOptions = {
    recordingGain: number;
    maxBytesLength?: number;
    maxDurationS?: number;
    analyzerEnabled?: boolean;
    streamMode?: boolean;
};

export type RecorderParams = {
    resolveAudioContext: () => AudioContext;
    config?: RecorderConfig;
} & Partial<RecorderOptions>;

type RecorderState = 'inactive' | 'loading' | 'starting' | 'recording';

export class Recorder {
    private dataSubscribers = new Set<(data: RecorderData) => void>();

    private stopSubscribers = new Set<() => void>();

    private state: RecorderState = 'inactive';

    private config: Required<RecorderConfig>;

    private options: RecorderOptions;

    private stream?: MediaStream;

    // @ts-ignore
    private recordingGainNode: GainNode;

    private sourceNode?: MediaStreamAudioSourceNode;

    // @ts-ignore
    private encoder: Worker | MessagePort;

    private recordedPages: Uint8Array[] = [];

    private recordedDuration = 0;

    private totalLength = 0;

    private audioContext: AudioContext | null = null;

    private scriptProcessorNode: ScriptProcessorNode | null = null;

    private analyzerNode: AnalyserNode | null = null;

    private analyzerData: Uint8Array | null = null;

    private resolveAudioContext: () => AudioContext;

    constructor({ resolveAudioContext, config, ...options }: RecorderParams) {
        this.resolveAudioContext = resolveAudioContext;

        this.config = {
            bufferLength: 2048,
            encoderFrameSize: 10,
            encoderSampleRate: 16000,
            maxFramesPerPage: 40,
            numberOfChannels: 1,
            resampleQuality: 3,
            encoderApplication: 2048,
            encoderBitRate: 32000,
            ...config,
        };

        this.options = {
            recordingGain: 1,
            streamMode: false,
            ...options,
        };
    }

    public close() {
        this.recordingGainNode?.disconnect();
        this.sourceNode?.disconnect();
        this.analyzerNode?.disconnect();
        this.clearStream();

        if (this.state === 'inactive') {
            if (this.encoder) {
                this.encoder.postMessage({ command: 'close' });

                // @ts-expect-error
                delete this.encoder;
            }
        }
    }

    public async start(resolveMediaStream?: () => Promise<MediaStream>) {
        if (this.state === 'recording') {
            throw new Error(`Can't start started recorder`);
        }

        if (this.state !== 'inactive') {
            return;
        }

        this.state = 'loading';

        try {
            this.initAudioContext();
            this.initProcessor();
            await this.initWorker();
        } catch (err) {
            this.state = 'inactive';

            throw err;
        }

        this.state = 'starting';

        const getMediaStream =
            resolveMediaStream || (() => window.navigator.mediaDevices.getUserMedia({ audio: true }));

        return getMediaStream().then((stream) => {
            this.state = 'recording';
            this.stream = stream;
            this.sourceNode = this.audioContext?.createMediaStreamSource(stream);
            this.analyzerData = null;

            this.encoder.postMessage({ command: 'getHeaderPages' });
            this.sourceNode?.connect(this.recordingGainNode);

            return stream;
        });
    }

    public async stop() {
        if (this.state !== 'inactive') {
            const prevState = this.state;

            this.state = 'inactive';
            this.scriptProcessorNode?.disconnect();
            this.recordingGainNode.disconnect();
            this.sourceNode?.disconnect();
            this.clearStream();

            if (prevState !== 'loading') {
                await new Promise((resolve) => {
                    const callback = (event: MessageEvent) => {
                        if (event.data.message === 'done') {
                            this.encoder?.removeEventListener('message', callback as EventListener);
                            resolve(undefined);
                        }
                    };

                    this.encoder.addEventListener('message', callback as EventListener);
                    this.encoder.postMessage({ command: 'done' });
                });
            }
        }
    }

    public onData(callback: (data: RecorderData) => void) {
        this.dataSubscribers.add(callback);

        return () => {
            this.dataSubscribers.delete(callback);
        };
    }

    public onStop(callback: () => void) {
        this.stopSubscribers.add(callback);

        return () => {
            this.stopSubscribers.delete(callback);
        };
    }

    public setAnalyzerEnabled(isEnabled: boolean) {
        this.options.analyzerEnabled = isEnabled;
    }

    private clearStream() {
        if (this.stream) {
            if (this.stream.getTracks) {
                this.stream.getTracks().forEach((track) => track.stop());
            } else {
                (this.stream as unknown as { stop: () => void }).stop();
            }
        }
    }

    private encodeBuffers(inputBuffer: AudioBuffer) {
        if (this.state === 'recording') {
            this.commitAnalyzerData();

            const buffers: Float32Array[] = [];

            for (let i = 0; i < inputBuffer.numberOfChannels; i++) {
                buffers[i] = inputBuffer.getChannelData(i);
            }

            this.encoder.postMessage({
                command: 'encode',
                buffers,
            });
        }
    }

    private commitAnalyzerData() {
        if (this.analyzerNode && this.analyzerData && this.options.analyzerEnabled) {
            this.analyzerNode.getByteTimeDomainData(this.analyzerData);
        }
    }

    private initAudioContext() {
        this.audioContext = this.resolveAudioContext();
    }

    private initProcessor() {
        // Первый буфер может содержать старые данные
        this.encodeBuffers = () => {
            // @ts-expect-error
            delete this.encodeBuffers;
        };

        if (this.audioContext) {
            this.scriptProcessorNode = this.audioContext.createScriptProcessor(
                this.config.bufferLength,
                this.config.numberOfChannels,
                this.config.numberOfChannels,
            );

            this.scriptProcessorNode.connect(this.audioContext.destination);
            this.scriptProcessorNode.onaudioprocess = (e) => {
                if (
                    this.options.maxDurationS &&
                    // Намеренно не игнорируем уже записанные чанки
                    this.recordedDuration + e.inputBuffer.duration > this.options.maxDurationS
                ) {
                    this.stop();

                    return;
                }

                this.recordedDuration += e.inputBuffer.duration;
                this.encodeBuffers(e.inputBuffer);
            };

            this.recordingGainNode = this.audioContext.createGain();
            this.setRecordingGain(this.options.recordingGain);
            this.recordingGainNode.connect(this.scriptProcessorNode);

            if (this.options.analyzerEnabled) {
                this.analyzerNode = this.audioContext.createAnalyser();
                this.analyzerNode.fftSize = 2048;
                this.analyzerData = new Uint8Array(this.analyzerNode.frequencyBinCount);
                this.recordingGainNode.connect(this.analyzerNode);
            }
        }
    }

    private initWorker(): Promise<void> {
        const onPage = (this.options.streamMode ? this.streamChunk : this.storeChunk).bind(this);

        this.recordedPages = [];
        this.recordedDuration = 0;
        this.totalLength = 0;

        if (!this.encoder) {
            this.encoder = new window.Worker(encoderWorkerUrl, { type: 'module' });
        }

        return new Promise<void>((resolve) => {
            const callback = ({ data }: MessageEvent) => {
                switch (data.message) {
                    case 'ready':
                        resolve();
                        break;
                    case 'page':
                        if (
                            this.options.maxBytesLength &&
                            this.totalLength + data.page.length > this.options.maxBytesLength
                        ) {
                            this.stop();

                            return;
                        }

                        onPage(data.page);
                        break;
                    case 'done':
                        this.encoder?.removeEventListener('message', callback as EventListener);
                        this.finish();
                        break;
                }
            };

            this.encoder.addEventListener('message', callback as EventListener);

            this.encoder.postMessage({
                command: 'init',
                originalSampleRate: this.audioContext?.sampleRate,
                wavSampleRate: this.audioContext?.sampleRate,
                wasmUrl: typeof encoderWasmUrl === 'string' ? encoderWasmUrl : encoderWasmUrl.href,
                ...this.config,
            });
        });
    }

    private setRecordingGain(gain: number) {
        this.options.recordingGain = gain;

        if (this.recordingGainNode && this.audioContext) {
            this.recordingGainNode.gain.setTargetAtTime(gain, this.audioContext.currentTime, 0.01);
        }
    }

    private storeChunk(page: Uint8Array) {
        this.recordedPages.push(page);
        this.totalLength += page.length;
    }

    private streamChunk(page: Uint8Array) {
        this.emitData(page, undefined, this.state === 'inactive');
    }

    private finish() {
        if (!this.options.streamMode) {
            const data = new Uint8Array(this.totalLength);

            this.recordedPages.reduce((offset, page) => {
                data.set(page, offset);

                return offset + page.length;
            }, 0);

            this.emitData(data, this.recordedDuration);
        }

        this.stopSubscribers.forEach((callback) => callback());
    }

    private emitData(data: Uint8Array, duration?: number, isLast?: boolean) {
        const result: RecorderData = {
            data,
            duration,
            isLast,
        };

        if (this.analyzerData) {
            result.analyserData = this.analyzerData;
        }

        this.dataSubscribers.forEach((callback) => callback(result));
    }
}
