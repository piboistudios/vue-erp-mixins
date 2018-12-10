// webpack.config.js
const VueLoaderPlugin = require('vue-loader/lib/plugin')
const IconFontPlugin = require('icon-font-loader').Plugin;
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
    mode: 'development',
    entry: {
        'test-view-data': './test-view-data.js'
    },
    output: {
        filename: '[name].js',
        path: __dirname + '/dist',
        publicPath: __dirname + "/public",
    },
    module: {
        rules: [
            {
                test: /\.vue$/,
                loader: 'vue-loader'
            },
            {
                test: /\.pug$/,
                loader: 'pug-plain-loader',
            },
            // this will apply to both plain `.js` files
            // AND `<script>` blocks in `.vue` files
            {
                test: /\.js$/,
                loader: 'babel-loader'
            },
            // this will apply to both plain `.css` files
            // AND `<style>` blocks in `.vue` files
            {
                test: /\.css$/,
                use: [
                    'vue-style-loader',
                    'css-loader',
                    'icon-font-loader'
                ]
            }
        ]
    },
    plugins: [
        // make sure to include the plugin for the magic
        new VueLoaderPlugin(),
        new IconFontPlugin(),
        new CopyWebpackPlugin([
            { from: 'public' }
        ])
 
    ]
}