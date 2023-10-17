import React, { FC, useEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { AssistantEvent, createAssistantClient } from '@salutejs/client';

const SMARTMARKET_TOKEN = '';

const getRandomString = () => Math.random().toString(36).substring(2, 13) + Math.random().toString(36).substring(2, 13);

const createPortalClient = (token = '') =>
    createAssistantClient({
        url: 'wss://nlp2vps.online.sberbank.ru:443/vps/',
        userId: `webdbg_userid_${getRandomString()}`,
        getToken: () => Promise.resolve(token),
        userChannel: 'COMPANION_B2C',
        legacyDevice: undefined,
        locale: 'ru',
        device: {
            platformType: 'web',
            platformVersion: '1',
            surface: 'COMPANION',
            surfaceVersion: '23.10.1.13516',
            features: '',
            capabilities: '',
            deviceId: 'deviceid_rgbohdnn3jr78q03y9duq6',
            deviceManufacturer: '',
            deviceModel: '',
            additionalInfo: '',
        },
        settings: {
            dubbing: 1,
            echo: 1, // этот флаг отвечает за походы в платформу
            ttsEngine: '',
            asrEngine: '',
            asrAutoStop: 1,
            authConnector: 'developer_portal_jwt',
        },
        version: 5,
    });

const App: FC = () => {
    const [ttsText, setTtsText] = useState('');
    const [status, setStatus] = useState<'idle' | 'listen' | 'talk'>('idle');
    const assistantRef = useRef<ReturnType<typeof createAssistantClient>>();

    useEffect(() => {
        if (!SMARTMARKET_TOKEN) {
            alert('Упс, токен не задан');
            return;
        }

        assistantRef.current = createPortalClient(SMARTMARKET_TOKEN);
        assistantRef.current.on('assistant', ({ asr, emotion, mtt, }: AssistantEvent) => {
            if (asr) {
                console.log('asr', asr);
            }

            if (mtt) {
                console.log('mtt', mtt);
            }

            if (emotion) {
                switch (emotion) {
                    case 'idle':
                    case 'listen':
                    case 'talk':
                        setStatus(emotion);
                        break;
                    default:
                        setStatus('idle');
                        break;
                }
            }
        });
    }, []);

    const listen = () => {
        assistantRef.current?.changeSettings({ disableDubbing: true });
        assistantRef.current?.listen();
    }

    const shazam = () => {
        assistantRef.current?.changeSettings({ disableDubbing: true });
        assistantRef.current?.shazam();
    }

    const tts = () => {
        assistantRef.current?.changeSettings({ disableDubbing: false });
        assistantRef.current?.sendText(ttsText);
        setTtsText('');
    }

    return <>
        <h2>Статус: {status}</h2>
        <button onClick={listen}>listen</button><br/>
        <button onClick={shazam} >shazam</button><br/>
        <button onClick={tts}>tts</button>
        <input type="text" id="tts-source" onChange={({ target }) => setTtsText(target.value)} value={ttsText} />
    </>;
};

const root = createRoot(document.getElementById('root'));
root.render(<App />);