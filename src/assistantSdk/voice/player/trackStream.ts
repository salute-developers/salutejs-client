import { createChunkQueue } from './chunkQueue';

const HZ_BYTES_COUNT = 2;

type BytesArraysSizes = {
    incomingMessageVoiceDataLength: number;
    sourceLen: number;
    start: number;
    prepend: number | null;
};

const from16BitToFloat32 = (incomingData: Int16Array) => {
    const l = incomingData.length;
    const outputData = new Float32Array(l);
    for (let i = 0; i < l; i += 1) {
        outputData[i] = incomingData[i] / 32768.0;
    }
    return outputData;
};

/** Возвращает потоковый подгружаемый трек, который умеет себя проигрывать */
export const createTrackStream = (
    ctx: AudioContext,
    {
        sampleRate = 24000,
        numberOfChannels = 1,
        delay = 0,
        onPlay,
        onEnd,
        onStop,
        trackStatus,
    }: {
        sampleRate?: number;
        numberOfChannels?: number;
        // минимальная длина кусочка для воспроизведения, сек
        delay?: number;
        onPlay?: () => void;
        onEnd?: () => void;
        onStop?: () => void;
        trackStatus?: 'stop' | 'play' | 'end';
    } = {},
) => {
    // очередь загруженных чанков (кусочков) трека
    const queue = createChunkQueue<AudioBufferSourceNode>();
    let buffer = new ArrayBuffer(0);
    let extraByte: number | null = null;
    let status: 'stop' | 'play' | 'end' = trackStatus || 'stop';

    let lastChunkOffset = 0;
    let startTime = 0;
    let firstChunk = true;
    let loaded = false;

    const end = () => {
        // останавливаем воспроизведение чанков из очереди воспроизведения
        queue.chunks.forEach((chunk) => {
            chunk.stop();
        });

        status = 'end';
        onEnd && onEnd();
        startTime = 0;
        lastChunkOffset = 0;
    };

    const stop = () => {
        onStop?.();
        end();
    };

    const play = () => {
        if (status === 'end') {
            return;
        }

        if (status !== 'play') {
            status = 'play';
            onPlay && onPlay();
        }

        if (loaded && queue.ended) {
            end();
            return;
        }

        // воспроизводим трек, если он полностью загрузился или длина загруженного больше задержки
        if (loaded || buffer.byteLength / (sampleRate * HZ_BYTES_COUNT) >= delay) {
            if (buffer.byteLength < 1) {
                return;
            }

            const chunk = getChunkFromBuffer();
            startTime = queue.length === 0 ? ctx.currentTime : startTime;
            queue.push(chunk);
            chunk.start(startTime + lastChunkOffset);
            lastChunkOffset += chunk.buffer?.duration || 0;
        }
    };

    /** Удаляет или добавляет байт для четности */
    const getExtraBytes = (data: Uint8Array, bytesArraysSizes: BytesArraysSizes) => {
        if (extraByte == null && bytesArraysSizes.incomingMessageVoiceDataLength % 2) {
            extraByte = data[bytesArraysSizes.incomingMessageVoiceDataLength - 1];
            bytesArraysSizes.incomingMessageVoiceDataLength -= 1;
            bytesArraysSizes.sourceLen -= 1;
        } else if (extraByte != null) {
            bytesArraysSizes.prepend = extraByte;
            bytesArraysSizes.start = 1;
            if (bytesArraysSizes.incomingMessageVoiceDataLength % 2) {
                bytesArraysSizes.incomingMessageVoiceDataLength += 1;
                extraByte = null;
            } else {
                extraByte = data[bytesArraysSizes.incomingMessageVoiceDataLength - 1];
                bytesArraysSizes.sourceLen -= 1;
            }
        }
    };

    const createChunk = (chunk: Float32Array) => {
        const audioBuffer = ctx.createBuffer(numberOfChannels, chunk.length / numberOfChannels, sampleRate);
        for (let i = 0; i < numberOfChannels; i++) {
            const channelChunk = new Float32Array(chunk.length / numberOfChannels);
            let index = 0;
            for (let j = i; j < chunk.length; j += numberOfChannels) {
                channelChunk[index++] = chunk[j];
            }

            audioBuffer.getChannelData(i).set(channelChunk);
        }
        const source = ctx.createBufferSource();
        source.buffer = audioBuffer;
        source.connect(ctx.destination);
        source.onended = () => {
            queue.remove(source);
            if (queue.ended && status !== 'end') {
                status = 'end';
                onEnd && onEnd();
            }
        };
        return source;
    };

    /** Получить чанк из буфера */
    const getChunkFromBuffer = () => {
        const tmp = buffer;
        buffer = new ArrayBuffer(0);
        const data = new Uint8Array(tmp);

        const bytesArraysSizes: BytesArraysSizes = {
            incomingMessageVoiceDataLength: data.length,
            sourceLen: data.length,
            start: 0,
            prepend: null,
        };

        // выравние по два байта
        getExtraBytes(data, bytesArraysSizes);

        const dataBuffer = new ArrayBuffer(bytesArraysSizes.incomingMessageVoiceDataLength);

        const bufferUi8 = new Uint8Array(dataBuffer);
        const bufferI16 = new Int16Array(dataBuffer);

        bufferUi8.set(data.slice(0, bytesArraysSizes.sourceLen), bytesArraysSizes.start);
        if (bytesArraysSizes.prepend != null) {
            bufferUi8[0] = bytesArraysSizes.prepend;
        }

        return createChunk(from16BitToFloat32(bufferI16));
    };

    /** добавляет чанк в очередь на воспроизведение */
    const write = (data: Uint8Array) => {
        // 44 байта - заголовок трека
        const slicePoint = firstChunk ? 44 : 0;

        firstChunk = false;

        if (slicePoint >= data.length) {
            return;
        }

        const tmp = new Uint8Array(buffer.byteLength + data.length - slicePoint);
        tmp.set(new Uint8Array(buffer), 0);
        tmp.set(slicePoint ? data.slice(slicePoint) : data, buffer.byteLength);
        buffer = tmp;

        if (status === 'play') {
            play();
        }
    };

    return {
        get loaded() {
            return loaded;
        },
        setLoaded: () => {
            loaded = true;

            if (status === 'play') {
                play();
            }
        },
        write,
        get status() {
            return status;
        },
        play,
        stop,
    };
};
