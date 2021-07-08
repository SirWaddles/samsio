var path = require('path');

module.exports = {
    mode: 'production',
    entry: './index.ts',
    output: {
        libraryTarget: 'umd',
        library: 'samsio',
    },
    externals: {
        react: 'react',
    },
    module: {
        rules: [{
            test: /\.tsx?$/,
            use: 'ts-loader',
            exclude: /node_modules/,
        }, ],
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js'],
    },
};
