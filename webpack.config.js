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
    }
};
