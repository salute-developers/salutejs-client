export const interpolateArray = (values: number[], targetLength: number) => {
    const returns = new Array(targetLength);
    const inputLength = values.length;

    if (inputLength === targetLength) {
        return [...values];
    }

    if (inputLength === 0) {
        return new Array(targetLength).fill(0);
    }

    if (inputLength === 1) {
        return new Array(targetLength).fill(values[0]);
    }

    for (let i = 0; i < targetLength; i++) {
        const position = (i * (inputLength - 1)) / (targetLength - 1);
        const leftIndex = Math.floor(position);
        const rightIndex = Math.min(leftIndex + 1, inputLength - 1);
        const fraction = position - leftIndex;

        returns[i] = Math.round(values[leftIndex] + (values[rightIndex] - values[leftIndex]) * fraction);
    }

    return returns;
};

export const createWaveform = async (volumeBars: number[], length: number) => {
    if (volumeBars.length === 0) {
        return null;
    }

    const raw = volumeBars.length >= length ? volumeBars : interpolateArray(volumeBars, length);
    const sampleRate = Math.floor(raw.length / length);
    const amplitudes = [];

    let maxAmplitude = 0;

    for (let i = 0; i < length; i++) {
        let sum = 0;

        for (let j = 0; j < sampleRate; j++) {
            sum += Math.abs(raw[i * sampleRate + j]);
        }

        amplitudes.push(sum);

        const avgAmplitude = sum / sampleRate;

        maxAmplitude = Math.max(maxAmplitude, avgAmplitude);
    }

    return amplitudes.reduce<number[]>((acc, amplitude) => {
        acc.push(Math.floor((amplitude / sampleRate / maxAmplitude) * 100));

        return acc;
    }, []);
};
