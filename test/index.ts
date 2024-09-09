import { createAssistantClient } from '@salutejs/client';
import { createInifiniteListen } from './listenSdk'; 

const token = '';
const apiUrl = '/stt';

const btn = document.createElement('button');
btn.innerText = "start";
document.body.appendChild(btn);

function withoutWorker() {
  const assistant = createAssistantClient({
      url: "wss://nlp2vps.online.sberbank.ru:443/vps/",
      userId: `webdbg_userid_${
        Math.random().toString(36).substring(2, 13) +
        Math.random().toString(36).substring(2, 13)
      }`,
      userChannel: "B2C",
      locale: "ru",
      device: {
        platformType: "web",
        surface: "SBERBOX",
      },
      settings: {
        dubbing: -1,
        asrAutoStop: -1,
        authConnector: "developer_portal_jwt",
      },
      version: 5,
      getToken: () => Promise.resolve(token),
      getVoiceMeta: () => ({
        SEND_EOU: true,
        MAX_EOU_TIMEOUT_SEC: 4,
      })
  });

  assistant.on('assistant', (event) => {
    if (event.asr) {
      fetch(apiUrl, {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json;charset=utf-8',
          },
          body: JSON.stringify({
              sessionId: '29aa7fd7-ba0d-40c7-86e7-9f1ae115638b',
              message: event.asr.text,
              timestamp: new Date().toISOString(),
          }),
      });
    }
  });

  btn.addEventListener('click', () => {
    const audio = document.querySelector("audio");
    audio?.play();
    let counter = 0;
    const started = Date.now();
    setInterval(() => {
      timeoutTicks.innerText = ++counter;
      fromStart.innerText = Math.round((Date.now() - started)/1000);
    }, 1000);
    // start
    assistant.listen();
  });
}

function withWorker() {
    const listener = createInifiniteListen(
        {
          voiceMeta: {
            SEND_EOU: true,
            MAX_EOU_TIMEOUT_SEC: 4,
          },
          url: "wss://nlp2vps.online.sberbank.ru:443/vps/",
          userId: `webdbg_userid_${
            Math.random().toString(36).substring(2, 13) +
            Math.random().toString(36).substring(2, 13)
          }`,
          userChannel: "B2C",
          locale: "ru",
          device: {
            platformType: "web",
            surface: "SBERBOX",
          },
          settings: {
            dubbing: -1,
            asrAutoStop: -1,
            authConnector: "developer_portal_jwt",
          },
          version: 5,
          token,
    }, apiUrl);


    btn.addEventListener('click', () => {
      const audio = document.querySelector("audio");
      audio?.play();
      let counter = 0;
      const started = Date.now();
      setInterval(() => {
        timeoutTicks.innerText = ++counter;
        fromStart.innerText = Math.round((Date.now() - started)/1000);
      }, 1000);
      // start
      listener.start();
    });
}

withoutWorker();