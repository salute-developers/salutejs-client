import terser from '@rollup/plugin-terser';

const getConfig = (input) => ({
    input,
    output: {
        dir: 'cypress/fixtures/dist',
        format: 'umd',
        name: 'assistant',
        plugins: [terser()],
    },
});

export default [getConfig('esm/createAssistant.js'), getConfig('esm/createAssistantDevOrigin.js')];
