const path = require('path');

module.exports = {
    configureWebpack: {
        resolve: {
            alias: {
                'vue-pipe': path.resolve(__dirname, '../index.js'),
            }
        }
    }
}