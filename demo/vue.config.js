const path = require('path');

module.exports = {
    outputDir: path.resolve(__dirname, '../docs'),
    publicPath: './',
    configureWebpack: {
        resolve: {
            alias: {
                'vue-pipe': path.resolve(__dirname, '../src/core/plugin.js'),
            }
        }
    }
}