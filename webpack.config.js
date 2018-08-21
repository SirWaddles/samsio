var path = require('path');

module.exports = {
    mode: 'production',
    entry: './index.js',
    output: {
        libraryTarget: 'umd',
        library: 'samsio',
    },
    externals: {
        react: 'react',
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['env'],
                    }
                },
            }
        ]
    }
};
