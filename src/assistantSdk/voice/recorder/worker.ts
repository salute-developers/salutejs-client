const instance = (() => {
    let chunks: Uint8Array[] = [];

    const listen = (port: MessagePort) => {
        chunks = [];

        port.onmessage = ({ data }) => {
            const chunk = new Uint8Array(data);

            chunks.push(chunk);
            self.postMessage({ type: 'chunk', chunk });
        };
    };

    return {
        listen,
        getChunks: () => {
            return chunks;
        },
    };
})();

self.addEventListener('message', (message) => {
    switch (message.data.type) {
        case 'listen': {
            instance.listen(message.ports[0]);
            break;
        }

        case 'getChunks': {
            self.postMessage({ type: 'chunks', chunks: instance.getChunks() });
            break;
        }

        default: {
            break;
        }
    }
});
