import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import replace from '@rollup/plugin-replace';
import json from '@rollup/plugin-json';
import typescript from '@rollup/plugin-typescript';
import terser from '@rollup/plugin-terser';
import copy from 'rollup-plugin-copy';
import { string } from 'rollup-plugin-string';

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
        string({
            include: 'src/assistantSdk/voice/recorder/worklet.js',
            exclude: ['**/*.ts', '**/*.tsx'],
        }),
        string({
            include: 'src/assistantSdk/voice/encoder/encoderWorker.min.js',
            exclude: ['**/*.ts', '**/*.tsx'],
        }),
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
            manualChunks: (id) => {
                if (id.includes('encoderWorker.min.js')) {
                    return 'encoderWorker.min';
                }

                if (id.includes('worklet.js')) {
                    return 'worklet';
                }

                return null;
            },
            entryFileNames: '[name].js',
            chunkFileNames: '[name].js',
        },
        plugins: [
            string({
                include: 'src/assistantSdk/voice/encoder/encoderWorker.min.js',
                exclude: ['**/*.ts', '**/*.tsx'],
            }),
            string({
                include: 'src/assistantSdk/voice/recorder/worklet.js',
                exclude: ['**/*.ts', '**/*.tsx'],
            }),
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
                        dest: 'dist/assistantSdk/voice/recognizers/asr',
                    },
                    {
                        src: 'src/assistantSdk/voice/recognizers/mtt/*.d.ts',
                        dest: 'dist/assistantSdk/voice/recognizers/mtt',
                    },
                    {
                        src: 'src/assistantSdk/voice/encoder/opusEncoder.wasm',
                        dest: 'dist',
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
            'src/assistantSdk/voice/encoder/opusEncoder.ts',
        ],
        output: {
            ...common.output,
            dir: 'esm',
            format: 'esm',
            manualChunks: (id) => {
                if (id.includes('encoderWorker.min.js')) {
                    return 'encoderWorker.min';
                }
                if (id.includes('worklet.js')) {
                    return 'worklet';
                }
                if (
                    id.includes('src/proto/index.js') ||
                    id.includes('src/assistantSdk/client/protocol.ts') ||
                    id.includes('src/typings.ts')
                ) {
                    return 'sdk';
                }
                if (id.includes('src/record/index.ts')) {
                    return 'record';
                }
                if (
                    id.includes('node_modules/tslib') ||
                    id.includes('src/nanoevents.ts') ||
                    id.includes('src/nanoobservable.ts')
                ) {
                    return 'common';
                }
                return null;
            },
            entryFileNames: '[name].js',
            chunkFileNames: '[name].js',
        },
        plugins: [
            string({
                include: 'src/assistantSdk/voice/encoder/encoderWorker.min.js',
                exclude: ['**/*.ts', '**/*.tsx'],
            }),
            string({
                include: 'src/assistantSdk/voice/recorder/worklet.js',
                exclude: ['**/*.ts', '**/*.tsx'],
            }),
            nodeResolve({
                browser: true,
                preferBuiltins: true,
            }),
            typescript({ outDir: 'esm', declaration: false, declarationMap: false, module: 'esnext' }),
            ...common.plugins,
            copy({
                targets: [
                    {
                        src: 'src/assistantSdk/voice/encoder/opusEncoder.wasm',
                        dest: 'esm',
                    },
                ],
            }),
        ],
    },
    {
        ...getUmdConfig(pkg.unpkgdev, 'src/createAssistantDevOrigin.ts'),
    },
    {
        ...getUmdConfig(pkg.unpkg, 'src/createAssistant.ts'),
    },
];
