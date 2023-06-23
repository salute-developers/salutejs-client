/// <reference types="cypress" />

const bundles = {
    UMD: 'umd/assistant.production.min.js',
    ESM: 'cypress/fixtures/dist/createAssistant.js',
};

describe('Тест PROM-сборки', () => {
    Object.entries(bundles).forEach(([bundleType, bundleFile]) => {
        describe(bundleType, () => {
            it('Вызовы методов assistantClient из канваса транслируются в window.AssistantHost', (done) => {
                cy.visit('cypress/fixtures/canvas.root.html').then((rootWindow) => {
                    const canvasFrame = rootWindow.document.getElementById('canvas');
                    const canvasWindow = (canvasFrame as HTMLIFrameElement).contentWindow!;
                    let isDone = false;

                    // @ts-ignore
                    rootWindow.top.addEventListener('message', ({ data }) => {
                        if (JSON.parse(data).type === 'ready' && !isDone) {
                            isDone = true;
                            done();
                        }
                    });

                    cy.readFile(bundleFile).then((fileContent) => {
                        const script = canvasWindow.document.createElement('script');
                        script.innerText = `
                            ${fileContent}

                            assistant.createAssistant({
                                getState: () => ({}),
                                getRecoveryState: () => ({}),
                            });
                        `;

                        canvasWindow.document.body.appendChild(script);
                    });
                });
            });

            it('Команды для assistantClient приходят в канвас', () => {
                cy.visit('cypress/fixtures/canvas.root.html').then((rootWindow) => {
                    const canvasFrame = rootWindow.document.getElementById('canvas');
                    const canvasWindow = (canvasFrame as HTMLIFrameElement).contentWindow!;
                    const testCommand = { type: 'my_command', payload: 'test' };

                    cy.readFile(bundleFile)
                        .then((fileContent) => {
                            const script = canvasWindow.document.createElement('script');
                            script.innerText = `
                                ${fileContent}

                                const { on } = assistant.createAssistant({
                                    getState: () => ({}),
                                    getRecoveryState: () => ({}),
                                });

                                window.Canvas = {
                                    on,
                                };
                            `;

                            canvasWindow.document.body.appendChild(script);
                        })
                        .then(() => {
                            // @ts-ignore
                            canvasWindow.Canvas.on('data', (canvasCommand) => {
                                expect(canvasCommand).deep.eq(testCommand);
                            });

                            // @ts-ignore
                            canvasWindow.AssistantClient.onData(testCommand);
                        });
                });
            });
        });
    });
});
