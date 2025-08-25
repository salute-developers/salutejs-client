import { createChunkQueue } from './chunkQueue';
import { parseWavHeader } from './utils';

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
        let sample = incomingData[i] / 32768.0;

        // Ограничиваем значения диапазоном [-1.0, 1.0]
        sample = Math.max(-1.0, Math.min(1.0, sample));

        // Защита от NaN и бесконечности
        if (!isFinite(sample)) {
            sample = 0.0;
        }

        outputData[i] = sample;
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
    const targetChunkSize = sampleRate * numberOfChannels * HZ_BYTES_COUNT * 0.1;
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

        const isPlaying = status === 'play';
        if (!isPlaying) {
            status = 'play';
            onPlay && onPlay();
        }

        const bytesPerSecond = sampleRate * HZ_BYTES_COUNT * numberOfChannels;
        const bufferDurationSeconds = buffer.byteLength / bytesPerSecond;

        // воспроизводим трек, если источник уже проигрывается или поток полностью загрузился или длина загруженного
        // больше задержки
        if (isPlaying || loaded || bufferDurationSeconds >= delay) {
            if (buffer.byteLength >= targetChunkSize || (loaded && buffer.byteLength > 0)) {
                const chunk = getChunkFromBuffer();
                if (!chunk.buffer) {
                    return;
                }

                startTime = queue.length === 0 ? ctx.currentTime : startTime;
                queue.push(chunk);
                chunk.start(startTime + lastChunkOffset);

                const chunkDuration = chunk.buffer.duration || 0;
                lastChunkOffset += chunkDuration;
            }
        }

        if (loaded && queue.ended) {
            end();
            return;
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
            if (queue.ended && status !== 'end' && loaded) {
                status = 'end';
                onEnd && onEnd();
            }
        };
        return source;
    };

    /** Получить чанк из буфера */
    const getChunkFromBuffer = () => {
        const chunkSizeToTake = Math.min(targetChunkSize, buffer.byteLength);

        // Если данных мало и поток не завершен, не обрабатываем
        if (chunkSizeToTake < targetChunkSize && !loaded) {
            return createChunk(new Float32Array(0)); // Возвращаем пустой чанк
        }

        // Извлекаем порцию данных
        const chunkBuffer = buffer.slice(0, chunkSizeToTake);

        // Обновляем основной буфер (убираем обработанную часть)
        const remainingBuffer = buffer.slice(chunkSizeToTake);
        buffer = remainingBuffer;

        const data = new Uint8Array(chunkBuffer);

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
        let slicePoint = 0;

        if (firstChunk) {
            // Проверяем наличие WAV заголовка
            const wavHeader = parseWavHeader(data);

            if (wavHeader) {
                // Найден валидный WAV заголовок - пропускаем его
                slicePoint = wavHeader.headerSize;
                // actualSampleRate = wavHeader.sampleRate;
                // actualChannels = wavHeader.channels;

                // Предупреждение о несоответствии параметров
                if (wavHeader.sampleRate !== sampleRate) {
                    console.warn(`WAV файл содержит sampleRate ${wavHeader.sampleRate}, но ожидался ${sampleRate}`);
                }
                if (wavHeader.channels !== numberOfChannels) {
                    console.warn(`WAV файл содержит ${wavHeader.channels} каналов, но ожидался ${numberOfChannels}`);
                }
            } else {
                slicePoint = 0;
            }

            firstChunk = false;
        }

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
