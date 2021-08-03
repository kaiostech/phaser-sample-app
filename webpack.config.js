const path = require('path');
const webpack = require('webpack');
const BrowserSyncPlugin = require('browser-sync-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

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

module.exports = (env, argv) => {
    const webpackConfig = {
        mode: JSON.stringify(argv.mode),
        entry: {
            game: './src/main.js',
            vendor: ['phaser']
        },
        devtool: 'cheap-source-map',
        output: {
            pathinfo: true,
            path: path.resolve('dev'),
            filename: '[name].bundle.js'
        },
        watch: true,
        plugins: [
            new webpack.DefinePlugin({
                CANVAS_RENDERER: JSON.stringify(true),
                WEBGL_RENDERER: JSON.stringify(true)
            }),
            new CleanWebpackPlugin(['dev']),
            definePlugin,
            chunksPlugin,
            new CopyWebpackPlugin([
                { from: 'src/assets', to: 'assets' },
                { from: 'src/favicon.ico', to: 'favicon.ico' }
            ]),
            new HtmlWebpackPlugin({
                filename: '../index.html',
                template: './src/index.html'
            }),
            new BrowserSyncPlugin(
                // BrowserSync options
                {
                    host: 'localhost',
                    port: 3000 || 3002,
                    server: {
                        baseDir: ['./', './dev']
                    }
                }
            )
        ],
        module: {
            rules: [
                { test: /\.js$/, use: ['babel-loader'], include: path.join(__dirname, 'src') },
                {
                    test: /\.html$/,
                    use: [{ loader: 'html-loader' }, { loader: 'preprocess-loader', options: env }],
                    include: path.join(__dirname, 'src')
                }
            ]
        }
    };

    return webpackConfig;
};
