const path = require('path');
const webpack = require('webpack');
const BrowserSyncPlugin = require('browser-sync-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

// Phaser webpack config for BrowserSync
const phaserModule = path.join(__dirname, '/node_modules/phaser-ce/');
const phaser = path.join(phaserModule, 'build/custom/phaser-split.js');
const pixi = path.join(phaserModule, 'build/custom/pixi.js');
const p2 = path.join(phaserModule, 'build/custom/p2.js');

const definePlugin = new webpack.DefinePlugin({
    __DEV__: JSON.stringify(JSON.parse(process.env.BUILD_DEV || 'true'))
});

const chunksPlugin = new webpack.optimize.SplitChunksPlugin({
    optimization: {
        splitChunks: {
            cacheGroups: {
                vendor: {
                    test: /[\\/]node_modules[\\/]/,
                    chunks: 'all',
                    name: 'vendor',
                    enforce: true,
                    minChunks: 3
                }
            }
        }
    }
});

module.exports = {
    entry: {
        game: './src/main.js',
        vendor: ['pixi', 'p2', 'phaser', 'webfontloader']
    },
    devtool: 'cheap-source-map',
    output: {
        pathinfo: true,
        path: path.resolve('dist'),
        filename: '[name].bundle.js'
    },
    watch: true,
    plugins: [
        new CleanWebpackPlugin(['dist']),
        definePlugin,
        chunksPlugin,
        new HtmlWebpackPlugin({
            filename: '../index.html',
            template: './src/index-dev.html',
            chunks: ['game'],
            chunksSortMode: 'manual',
            minify: {
                removeAttributeQuotes: false,
                collapseWhitespace: false,
                html5: false,
                minifyCSS: false,
                minifyJS: false,
                minifyURLs: false,
                removeComments: false,
                removeEmptyAttributes: false
            },
            hash: false
        }),
        new CopyWebpackPlugin([
            { from: 'src/assets', to: 'assets' },
            { from: 'src/favicon.ico', to: 'favicon.ico' }
        ]),
        new BrowserSyncPlugin(
            // BrowserSync options
            {
                host: 'localhost',
                port: 3000 || 3002,
                server: {
                    baseDir: ['./', './dist']
                }
            }
        )
    ],
    module: {
        rules: [
            { test: /\.js$/, use: ['babel-loader'], include: path.join(__dirname, 'src') },
            { test: /pixi\.js/, use: ['expose-loader?PIXI'] },
            { test: /phaser-split\.js$/, use: ['expose-loader?Phaser'] },
            { test: /p2\.js/, use: ['expose-loader?p2'] }
        ]
    },
    node: {
        fs: 'empty',
        net: 'empty',
        tls: 'empty'
    },
    resolve: {
        alias: {
            phaser: phaser,
            pixi: pixi,
            p2: p2
        }
    }
};
