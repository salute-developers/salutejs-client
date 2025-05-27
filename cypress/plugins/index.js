import path from 'path';
import webpackPreprocessor from '@cypress/webpack-preprocessor';

module.exports = (on, config) => {
    const options = {
        webpackOptions: {
            resolve: {
                extensions: ['.js', '.jsx', '.ts', '.tsx'],
                alias: {
                    lib: 
                        process.env.CY_MODE === 'production'
                            ? path.resolve(__dirname, '../../esm/index.js')
                            : path.resolve(__dirname, '../../src/index'),
                },
            },
            module: {
                rules: [
                    {
                        test: /\.(ts|tsx)$/,
                        loader: 'ts-loader',
                        options: { transpileOnly: true },
                    },
                    {
                        test: /\.css$/,
                        exclude: [/node_modules/],
                        use: ['style-loader', 'css-loader'],
                    },
                    {
                        test: /\.(png|jpe?g|gif)$/i,
                        use: [
                            {
                                loader: 'file-loader',
                            },
                        ],
                    },
                ],
            },
        },
    };

    if (process.env.CY_MODE !== 'production') {
        options.webpackOptions.module.rules = [
            {
                test: /\.(ts|tsx)$/,
                use: { loader: 'istanbul-instrumenter-loader' },
                exclude: /node_modules|cypress/,
            },
            ...options.webpackOptions.module.rules,
        ];

        /// бандл в прод собирается без istanbul,
        /// поэтому коверейдж не нужен
        require('@cypress/code-coverage/task')(on, config);
    }

    on('file:preprocessor', webpackPreprocessor(options));

    return config;
};
