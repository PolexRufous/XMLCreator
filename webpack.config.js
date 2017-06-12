'use strict';
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');

const IS_DEVELOP_MODE = process.env.NODE_ENV === undefined;

module.exports = [{
    context: __dirname,
    entry: {
        main: './src/main.entry'
    },
    output: {
        path: __dirname + '/dist/',
        filename: '[name].js',
        library: '[name]'
    },
    module: {
        rules: [
            {
                test: /(\.js$|\.jsx$)/,
                exclude: /(node_modules)/,
                loader: 'babel-loader',
                query: {
                    presets: ['react', 'es2015', 'es2016', 'stage-0'],
                    plugins: ['react-html-attrs', 'transform-class-properties', 'transform-decorators-legacy']
                }
            },
            {
                test: /\.css$/,
                use: [ 'style-loader', 'css-loader' ]
            },
            {
                test: /\.json$/,
                loader: 'json-loader'
            },
            {
                test: /\.less$/,
                use: [ 'style-loader', 'css-loader', 'less-loader' ]
            },
            {
                test: /(\.jpeg$|\.png$|\.gif$|\.svg$)/,
                use: [ 'url-loader?limit=10000', 'img-loader' ]
            },
            {
                test: /\.(woff|woff2|eot|ttf)$/,
                use: [ 'url-loader?limit=10000' ]
            }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            title: 'XML Creator',
            filename: 'index.html',
            template: 'src/index.ejs',
            chunks: ['main'],
            hash: true,
            xhtml: true
        })
    ],

    watch: IS_DEVELOP_MODE,

    devtool: IS_DEVELOP_MODE ? "source-map" : false,
    cache: false

}];
