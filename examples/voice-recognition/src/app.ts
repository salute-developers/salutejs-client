import { createAssistantClient } from '@salutejs/client';

function start(client: ReturnType<typeof createAssistantClient>) {
    const button: HTMLButtonElement | null = document.getElementById('listen-btn') as HTMLButtonElement;
    const input: HTMLInputElement | null = document.getElementById('asr-input') as HTMLInputElement;
    const bubbleContainer: HTMLDivElement | null = document.getElementById('bubble-container') as HTMLInputElement;
    
    let status: 'listen' | 'loading' | 'stop' = 'stop';

    if (typeof client === 'undefined') {
        throw new Error('Client ');
    }

    if (button === null || input === null || bubbleContainer === null) {
        throw new Error('Cant find controls on page')
    }

    client.on('assistant', (event) => {
        if (event.asr) {
            input.value = event.asr.text;
            if (event.asr.last) {
                bubbleContainer.innerHTML = `<div class="bubble">${event.asr.text}</div>`;
            }
        }

        switch (event.emotion) {
            case 'listen':
                button.classList.add('pulse');
                break;
            case 'idle':
                button.classList.remove('pulse');
                break;
            default:
                return;
        }
    });

    button.addEventListener('click', () => {
        switch(status) {
            case 'listen':
                bubbleContainer.innerHTML = '';
                status = 'loading';
                client.listen()
                    .then(() => {
                        status = 'listen';
                    })
                    .catch((error) => {
                        status='stop';
                        console.error(error);
                        alert('Ошибка доступа к микрофону')
                    });
            case 'stop':
                client.listen();
            case 'loading':
            default:
                return;
        }
    });
}

start(
    // https://developers.sber.ru/docs/ru/assistant-sdk/web/vps-initialization
    createAssistantClient({
        url: 'wss://nlp2b2b.sberchat.sberbank.ru/vps/',
        userId: `webdbg_userid_${
            Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
        }`,
        // обновление токена см https://developers.sber.ru/docs/ru/assistant-sdk/web/token-refresh
        getToken: () => Promise.resolve(process.env.DEV_TOKEN || ''),
        userChannel: 'B2C',
        locale: 'ru',
        device: {
            platformType: 'web',
            platformVersion: '1',
            surface: 'SBERBOX',
            surfaceVersion: '1',
            features: '',
            capabilities: '',
            deviceId: 'deviceid_rgbohdnn3jr78q03y9duq6',
            deviceManufacturer: '',
            deviceModel: '',
            additionalInfo: '',
        },
        settings: {
            dubbing: -1,
            echo: 1, // обязательно выставить 1
            ttsEngine: '',
            asrEngine: '',
            asrAutoStop: -1,
            authConnector: 'developer_portal_jwt', // заменить на '' когда будете ходить по своему токену
        },
        version: 5,
    }
));