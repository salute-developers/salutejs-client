const DEFAULT_BUFFER_SIZE = 2048;
const DEFAULT_SAMPLE_RATE = 16000;

function encode(buffer, sampleRate, targetSampleRate) {
    if (sampleRate > targetSampleRate) {
        throw new Error('downsampling rate show be smaller than original sample rate');
    }

    const sampleRateRatio = sampleRate / targetSampleRate;
    const newLength = Math.round(buffer.length / sampleRateRatio);
    const result = new Int16Array(newLength);

    let offsetResult = 0;
    let offsetBuffer = 0;

    while (offsetResult < result.length) {
        const nextOffsetBuffer = Math.round((offsetResult + 1) * sampleRateRatio);
        let accum = 0;
        let count = 0;
        for (let i = offsetBuffer; i < nextOffsetBuffer && i < buffer.length; i++) {
            accum += buffer[i];
            count++;
        }

        result[offsetResult] = Math.min(1, accum / count) * 0x7fff;
        offsetResult++;
        offsetBuffer = nextOffsetBuffer;
    }

    return result.buffer;
}

class PcmWorkletProcessor extends AudioWorkletProcessor {
    _bufferSize = DEFAULT_BUFFER_SIZE;
    _bytesWritten = 0;
    _buffer = new Float32Array(this._bufferSize);
    _sampleRate = DEFAULT_SAMPLE_RATE;
    _targetSampleRate = DEFAULT_SAMPLE_RATE;
    _worker;

    constructor(options) {
        super();

        this._bufferSize = options.processorOptions?.bufferSize || DEFAULT_BUFFER_SIZE;
        this._buffer = new Float32Array(this._bufferSize);
        this._sampleRate = options.processorOptions?.sampleRate || DEFAULT_SAMPLE_RATE;
        this._targetSampleRate = options.processorOptions?.targetSampleRate || DEFAULT_SAMPLE_RATE;
    }

    append(channelData) {
        if (!channelData) {
            return;
        }

        for (let i = 0; i < channelData.length; i++) {
            this._buffer[this._bytesWritten++] = channelData[i];
            if (this._bytesWritten >= this._bufferSize) {
                this.push();
            }
        }
    }

    process(inputs, outputs, parameters) {
        this.append(inputs[0][0]);
        return true;
    }

    push() {
        const chunk = encode(
            this._bytesWritten < this.bufferSize ? this._buffer.slice(0, this._bytesWritten) : this._buffer,
            this._sampleRate,
            this._targetSampleRate,
        );

        // TODO: SharedArray
        this.port.postMessage(chunk);
        this._bytesWritten = 0;
    }
}

registerProcessor('pcm-processor', PcmWorkletProcessor);
