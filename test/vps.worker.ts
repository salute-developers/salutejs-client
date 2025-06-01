import { v4 } from 'uuid';

import { createClient } from '@salutejs/client';
import { createProtocol } from '@salutejs/client';
import { createTransport } from '@salutejs/client';

export const WORKER_ENTRY_FILE_URL = import.meta.url;

function convertFieldValuesToString<
    Obj extends Record<string, unknown>,
    ObjStringified = { [key in keyof Obj]: string },
>(object: Obj): ObjStringified {
    return Object.keys(object).reduce((acc: Record<string, string>, key: string) => {
        if (object[key]) {
            acc[key] =
                typeof object[key] === 'string' && (object[key] as string).startsWith('{')
                    ? (object[key] as string)
                    : JSON.stringify(object[key]);
        }
        return acc;
    }, {}) as ObjStringified;
}

let _client: ReturnType<typeof createClient>;
let _stream: (chunk: Uint8Array, last: boolean) => void;
let _push: (text: string) => void;
let _buffer: Uint8Array[] = [];

function init({ token, voiceMeta, ...config }, restApiUrl: string) {
    const sessionId = v4();
    const convertedVoiceMeta = voiceMeta ? convertFieldValuesToString(voiceMeta) : '';
    const transport = createTransport({});
    const protocol = createProtocol(transport, { ...config, getToken: () => token });
    _client = createClient(protocol, undefined, {
        getVoiceMeta: () => convertedVoiceMeta,
    });
    _push = (message: string) =>
        fetch(restApiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json;charset=utf-8',
            },
            body: JSON.stringify({
                sessionId,
                message,
                timestamp: new Date().toISOString(),
            }),
        });

    _client.on('stt', ({ text, response }) => {
        if (text?.data) {
            _push(text.data);
            return;
        }

        if (response) {
            const { decoderResultField } = response;

            if (decoderResultField?.hypothesis?.length) {
                _push(decoderResultField.hypothesis[0].normalizedText || '');
            }
        }
    });
}

function start(port: MessagePort) {
    _client
        .init()
        .then(() => {
            _client.createVoiceStream(({ sendVoice }) => {
                _stream = sendVoice;
                
                if (_buffer.length > 0) {
                    for (let i = 0; i < _buffer.length; i++) {
                        _stream(_buffer[i], false);
                    }
                    _buffer = [];
                }

                return Promise.resolve();
            }, {});
        })
        .catch((err) => {
            console.error(err);
        });

    port.onmessage = (event) => {
        if (_stream) {
            _stream(event.data, false);
        } else {
            _buffer.push(event.data);
        }
    };
}

function handleChunk(chunk: Uint8Array, last: boolean) {
    _stream?.(chunk, last);
}

self.addEventListener('message', function (e) {
    switch (e.data.type) {
        case 'init':
            init(e.data.params[0], e.data.params[1]);
            break;
        case 'start':
            start(e.ports[0]);
            break;
        case 'chunk':
            handleChunk(e.data.params[0], e.data.params[1]);
            break;
        case 'stop':
            break;
    }
});
