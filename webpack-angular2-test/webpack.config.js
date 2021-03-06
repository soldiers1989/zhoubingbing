var webpack = require('webpack');
const path = require('path');
const {
    TsConfigPathsPlugin
} = require('awesome-typescript-loader');
var HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    entry: {
        polyfills: './src/polyfills.ts',
        app: './src/app.ts',
    },
    output: {
        path: __dirname + '/dist',
        filename: process.env.NODE_ENV !== 'production' ? '[name].bundle.js' : '[name].bundle.js?v=[chunkhash]',
        publicPath: process.env.NODE_ENV !== 'production' ? '/' : './',
    },
    plugins: [
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)
        }),
        new HtmlWebpackPlugin({
            filename: './index.html',
            template: __dirname + '/src/index.html',
            inject: true,
            chunks: ['polyfills', 'app'],
            chunksSortMode: 'manual'
        }),
        // 如果没有该插件，在 devtool: 'inline-source-map' 的情况下 sourceMap 是有的
        /*  new webpack.optimize.UglifyJsPlugin({
             sourceMap: false,
             compress: {
                 warnings: false,
             },
             output: {
                 comments: false,
             }
         }) */

    ],
    devServer: {
        inline: true,
        port: 3089,
    },
    module: {
        rules: [{
                test: /\.tsx?$/,
                use: [
                    // 'babel-loader',
                    'awesome-typescript-loader'
                ],
                exclude: /node_modules/
            }, {
                test: /\.(gif|svg|woff|woff2|eot|ttf|otf)$/,
                use: [
                    'file-loader?name=[path][name].[ext]'
                ]
            }, {
                test: /\.(png|jpg)$/,
                use: 'url-loader?limit=8192'
            }
            /* , {
                        test: /\.html?$/,
                        use: [
                            'html-loader'
                        ]
                    } */
        ]
    },
    resolve: {
        extensions: ['.ts', '.tsx', '.js'],
        plugins: [
            new TsConfigPathsPlugin({
                configFileName: "tsconfig.json",
                compiler: "typescript",
            })
        ]
    }
}
