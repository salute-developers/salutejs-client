import { TARGET_SAMPLE_RATE } from '../const';
import type { AudioEncoder } from '../types';

// @ts-ignore
import encoderWorkerCode from './encoderWorker.min.js';

const wasmUrl = '/opusEncoder.wasm';

const getWasmUrl = () => {
    if (typeof window === 'undefined') {
        return wasmUrl;
    }

    // Добавляем хост к URL
    return `${window.location.origin}${wasmUrl}`;
};

export type EncoderConfig = {
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

export type EncoderOptions = {
    recordingGain: number;
    streamMode?: boolean;
    encoderWasmUrl?: string;
};

export type EncoderParams = {
    config?: EncoderConfig;
} & Partial<EncoderOptions>;

export class OpusEncoder implements AudioEncoder {
    private config: Required<EncoderConfig>;

    private options: EncoderOptions;

    private encoder?: Worker | MessagePort;

    private handler?: (data: any) => void;

    constructor(private port: MessagePort, { config, ...options }: EncoderParams) {
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

        if (typeof window !== 'undefined') {
            // прогрев wasm
            fetch(this.options.encoderWasmUrl || getWasmUrl());
        }

        this.init();
    }

    public destroy() {
        if (!this.encoder) {
            return;
        }

        // Отправляем команду закрытия воркеру
        this.encoder.postMessage({ command: 'flush' });

        // Отключаем все обработчики событий
        this.encoder.onmessage = null;
        if ('onerror' in this.encoder) {
            this.encoder.onerror = null;
        }

        // Закрываем воркер
        if ('terminate' in this.encoder) {
            this.encoder.terminate();
        }

        // Очищаем URL объекта Blob
        if (this.encoder instanceof Worker && 'scriptURL' in this.encoder) {
            URL.revokeObjectURL(this.encoder.scriptURL as string);
        }

        this.encoder = undefined;
    }

    public finish() {
        this.encoder?.postMessage({ command: 'close' });
    }

    set outPort(port: MessagePort) {
        this.encoder?.postMessage({ command: 'setOutPort', port }, [port]);
    }

    set onmessage(handler: (data: any) => void) {
        this.handler = handler;
    }

    private async init() {
        await this.initWorker();

        if (!this.encoder) {
            throw new Error('Encoder is not initialized');
        }

        this.encoder.postMessage({ command: 'getHeaderPages' });

        // Передаем MessagePort в воркер для поддержки чтения пакетов
        this.encoder.postMessage({ command: 'setPort', port: this.port }, [this.port]);
    }

    private async initWorker(): Promise<void> {
        if (!this.encoder) {
            if (typeof window === 'undefined') {
                throw new Error('Worker is not supported in this environment');
            }

            const blob = new Blob([encoderWorkerCode], { type: 'application/javascript' });
            this.encoder = new window.Worker(URL.createObjectURL(blob), { type: 'module' });
        }

        return new Promise<void>((resolve) => {
            const callback = ({ data }: MessageEvent) => {
                switch (data.message) {
                    case 'ready':
                        resolve();
                        break;
                    case 'page':
                        this.streamChunk(data.page);
                        break;
                    case 'done':
                        this.encoder?.removeEventListener('message', callback as EventListener);
                        this.finish();
                        break;
                }
            };

            this.encoder?.addEventListener('message', callback as EventListener);

            this.encoder?.postMessage({
                command: 'init',
                originalSampleRate: TARGET_SAMPLE_RATE,
                wavSampleRate: TARGET_SAMPLE_RATE,
                wasmUrl: this.options.encoderWasmUrl || getWasmUrl(),
                ...this.config,
            });
        });
    }

    private streamChunk(page: Uint8Array) {
        this.handler?.(page);
    }
}
