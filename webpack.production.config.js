const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const FileManagerPlugin = require('filemanager-webpack-plugin');
const ZipFilesPlugin = require('webpack-zip-files-plugin');

// If you need to minify your app, here are the options: (Default: UglifyJsPlugin)
// const TerserPlugin = require('terser-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

// Phaser webpack config for production
const phaserModule = path.join(__dirname, '/node_modules/phaser-ce/');
const phaser = path.join(phaserModule, 'build/custom/phaser-split.js');
const pixi = path.join(phaserModule, 'build/custom/pixi.js');
const p2 = path.join(phaserModule, 'build/custom/p2.js');

const config = require('./package.json');

const definePlugin = new webpack.DefinePlugin({
    __DEV__: JSON.stringify(JSON.parse(process.env.BUILD_DEV || 'true'))
});

module.exports = (env, argv) => {
    const date = new Date();
    let month = '' + (date.getMonth() + 1);
    let day = '' + date.getDate();
    const year = date.getFullYear();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    const dateStr = [year, month, day].join('-');
    const scriptType = argv.mode === 'production' ? 'PROD' : 'DEV';
    const upperStrVersion = env.VERSION.toString().toUpperCase();

    const packageName = `${config.name}__${config.version}_${scriptType}_${upperStrVersion}_${dateStr}`;

    const manifestSwap = () => {
        if (env.VERSION === 'kaiNext') {
            return new CopyPlugin([
                { from: 'manifestNext', to: '' },
                { from: 'src/manifest.webmanifest.json', to: 'manifest.webmanifest' }
            ]);
        } else {
            return new CopyPlugin([
                { from: 'src/manifest.webapp.json', to: 'manifest.webapp' }]
            );
        }
    };

    const webpackConfig = {
        devtool: 'source-map',
        entry: {
            game: './src/main.js'
            // vendor: ['pixi', 'p2', 'phaser', 'webfontloader']
        },
        output: {
            pathinfo: true,
            path: path.resolve('build'),
            filename: '[name].bundle.js'
        },
        performance: {
            maxEntrypointSize: 5120000,
            maxAssetSize: 5120000
        },
        optimization: {
            minimize: true,
            minimizer: [
                new UglifyJsPlugin({
                    sourceMap: false,
                    uglifyOptions: {
                        warnings: false,
                        compress: {
                            drop_console: true,
                            unused: true,
                            dead_code: true
                        },
                        output: {
                            comments: false
                        }
                    }
                })
                // new TerserPlugin({
                //     terserOptions: {
                //         ecma: undefined,
                //         parse: {},
                //         compress: {},
                //         mangle: true, // Note `mangle.properties` is `false` by default.
                //         // Deprecated
                //         output: {
                //             comments: false
                //         },
                //         format: null,
                //         toplevel: false,
                //         nameCache: null,
                //         ie8: false,
                //         keep_classnames: undefined,
                //         keep_fnames: false,
                //         safari10: false
                //     }
                // })
            ],
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
        },
        plugins: [
            definePlugin,
            new FileManagerPlugin({
                onStart: {
                    mkdir: [path.resolve('./package/')]
                }
            }),
            new CleanWebpackPlugin(['build']),
            new ZipFilesPlugin({
                entries: [{ src: path.join(__dirname, './build'), dist: '../' }],
                output: path.join(__dirname, `./package/${packageName}`),
                format: 'zip'
            }),
            new HtmlWebpackPlugin({
                filename: 'index.html', // path.resolve(__dirname, 'build', 'index.html'),
                template: './src/index.html',
                chunks: ['game'],
                chunksSortMode: 'manual',
                minify: {
                    removeAttributeQuotes: true,
                    collapseWhitespace: true,
                    html5: true,
                    minifyCSS: true,
                    minifyJS: true,
                    minifyURLs: true,
                    removeComments: true,
                    removeEmptyAttributes: true
                },
                hash: true
            }),
            new CopyPlugin([
                { from: 'src/ads', to: 'ads' },
                { from: 'src/assets', to: 'assets' },
                { from: 'src/favicon.ico', to: 'favicon.ico' }
            ]),
            manifestSwap()
        ],
        module: {
            rules: [
                { test: /\.js$/, use: [{ loader: 'babel-loader' }], include: path.join(__dirname, 'src') },
                {
                    test: /\.html$/,
                    use: [{ loader: 'html-loader' }, { loader: 'preprocess-loader', options: env }],
                    include: path.join(__dirname, 'src')
                },
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

    return webpackConfig;
};
