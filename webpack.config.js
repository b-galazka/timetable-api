const path = require('path');

module.exports = {

    mode: 'production',
    entry: './index.js',

    output: {
        path: path.resolve(__dirname, 'build'),
        filename: 'app.js'
    },

    resolve: {
        extensions: ['.mjs', '.js', '.json']
    },

    devtool: 'source-map',
    context: __dirname,
    target: 'node'
};