const path = require('path');
const VueLoaderPlugin = require('vue-loader/lib/plugin') 
module.exports = {
    entry: path.resolve(__dirname, '../src/core/plugin.js'),
    output: {
        library: {
            root: 'vue-pipe',
            amd: 'vue-pipe',
            commonjs: 'vue-pipe'
        },
        libraryTarget: 'umd',
    },
    mode: 'production',
    module: {
        rules: [
            {
                test: /\.vue$/,
                loader: 'vue-loader'
            },
            {
               test: /\.m?js$/,
                exclude: /(node_modules|bower_components)/,
                use: {
                    loader: 'babel-loader',
                    options: {
                    presets: ['@babel/preset-env']
                    }
                }
            },
        ]
    },  
    plugins: [
        // 请确保引入这个插件！
        new VueLoaderPlugin()
    ],
    externals: {
        vue: 'vue'
    }
}