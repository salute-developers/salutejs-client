/** Создает структуру для хранения загружаемых и воспроизводимых частей трека */
export const createChunkQueue = <T extends AudioBufferSourceNode>() => {
    const chunks: Array<T> = []; // очередь воспроизведения

    /** Добавить чанк в очередь воспроизведения */
    const push = (chunk: T) => {
        chunks.push(chunk);
    };

    /** Удалить чанк из очереди воспроизведения */
    const remove = (chunk: T) => {
        chunks.splice(chunks.indexOf(chunk), 1);
    };

    return {
        get chunks() {
            return chunks;
        },
        remove,
        push,
        get length() {
            return chunks.length;
        },
        get ended() {
            // считаем трек законченным, когда все воспроизведено
            return chunks.length === 0;
        },
    };
};
