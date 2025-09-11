export interface WavHeader {
    sampleRate: number;
    channels: number;
    headerSize: number;
}

/** Парсит WAV заголовок и возвращает информацию о файле */
export const parseWavHeader = (data: Uint8Array): WavHeader | null => {
    if (data.length < 12) return null;

    // Проверка RIFF сигнатуры
    const riffSignature = new TextDecoder().decode(data.slice(0, 4));
    const waveSignature = new TextDecoder().decode(data.slice(8, 12));

    if (riffSignature !== 'RIFF' || waveSignature !== 'WAVE') {
        return null;
    }

    // Минимальный размер для получения основной информации
    if (data.length < 44) return null;

    try {
        // Извлечение параметров из заголовка
        const dataView = new DataView(data.buffer, data.byteOffset);
        const sampleRate = dataView.getUint32(24, true);
        const channels = dataView.getUint16(22, true);

        // Поиск data chunk для определения точного размера заголовка
        let headerSize = 44; // минимальный размер
        let offset = 12;

        while (offset < data.length - 8) {
            const chunkId = new TextDecoder().decode(data.slice(offset, offset + 4));
            const chunkSize = dataView.getUint32(offset + 4, true);

            if (chunkId === 'data') {
                headerSize = offset + 8;
                break;
            }

            offset += 8 + chunkSize;
        }

        return { sampleRate, channels, headerSize };
    } catch (error) {
        console.warn('Ошибка при парсинге WAV заголовка:', error);
        return null;
    }
};
