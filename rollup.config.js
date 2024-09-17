import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import replace from '@rollup/plugin-replace';
import json from '@rollup/plugin-json';
import typescript from '@rollup/plugin-typescript';
import terser from '@rollup/plugin-terser';
import copy from 'rollup-plugin-copy';

import pkg from './package.json';

const common = {
    input: 'src/index.ts',
    plugins: [
        commonjs({
            extensions: ['.js', '.jsx', '.ts', '.tsx'],
        }),
        replace({
            'process.env.APP_VERSION': pkg.version,
        }),
        json(),
    ],
};

const getUmdConfig = (fileName, input) => ({
    ...common,
    input,
    output: {
        ...common.output,
        file: fileName,
        format: 'umd',
        name: 'assistant',
        plugins: [terser()],
    },
    plugins: [
        nodeResolve({
            browser: true,
            preferBuiltins: true,
        }),
        typescript({ tsconfig: 'tsconfig.json', declaration: false, declarationMap: false }),
        ...common.plugins,
    ],
});

export default [
    {
        ...common,
        input: ['src/index.ts', 'src/createAssistantDevOrigin.ts'],
        output: {
            ...common.output,
            dir: 'dist',
            format: 'cjs',
        },
        plugins: [
            nodeResolve({
                browser: true,
                preferBuiltins: true,
            }),
            typescript({ tsconfig: 'tsconfig.json', outDir: 'dist' }),
            ...common.plugins,
            copy({
                targets: [
                    {
                        src: 'src/proto/*.d.ts',
                        dest: 'dist/proto',
                    },
                    {
                        src: 'src/assistantSdk/voice/recognizers/asr/*.d.ts',
                        dest: 'dist/assistantSdk/voice/recognizers/asr'
                    },
                    {
                        src: 'src/assistantSdk/voice/recognizers/mtt/*.d.ts',
                        dest: 'dist/assistantSdk/voice/recognizers/mtt'
                    },
                ],
            }),
        ],
    },
    {
        ...common,
        input: [
            'src/createAssistant.ts',
            'src/createAssistantDev.ts',
            'src/createAssistantDevOrigin.ts',
            'src/assistantSdk/assistant.ts',
            'src/mock.ts',
            'src/index.ts',
        ],
        output: {
            ...common.output,
            dir: 'esm',
            format: 'esm',
            manualChunks: {
                sdk: ['src/proto/index.js', 'src/assistantSdk/client/protocol.ts', 'src/typings.ts'],
                record: ['src/record/index.ts'],
                common: ['node_modules/tslib', 'src/nanoevents.ts', 'src/nanoobservable.ts'],
            },
        },
        plugins: [
            nodeResolve({
                browser: true,
                preferBuiltins: true,
            }),
            typescript({ outDir: 'esm', declaration: false, declarationMap: false, module: 'esnext' }),
            ...common.plugins,
        ],
    },
    {
        ...getUmdConfig(pkg.unpkgdev, 'src/createAssistantDevOrigin.ts'),
    },
    {
        ...getUmdConfig(pkg.unpkg, 'src/createAssistant.ts'),
    },
];
