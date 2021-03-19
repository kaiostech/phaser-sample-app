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

const config = require('./package.json');

const ENVIRONMENTS = {
    // INCLUDED KAIADS
    default: {
        environment: 'default',
        adsPackageName: 'KAI'
    }
};

const definePlugin = new webpack.DefinePlugin({
    __DEV__: JSON.stringify(JSON.parse(process.env.BUILD_DEV || 'true'))
});

module.exports = (env, argv) => {
    const BUILD_ENVIRONMENT = (env && env.BUILD_ENVIRONMENT) || 'default';
    const appEnv = ENVIRONMENTS[BUILD_ENVIRONMENT];

    appEnv.NODE_ENV = argv.mode || 'development';

    const date = new Date();
    let month = '' + (date.getMonth() + 1);
    let day = '' + date.getDate();
    const year = date.getFullYear();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    const dateStr = [year, month, day].join('-');
    const scriptType = appEnv.NODE_ENV === 'production' ? 'PROD' : 'DEV';

    const packageName = `${config.name}__${config.version}_${scriptType}_${appEnv.adsPackageName}_${dateStr}`;

    const webpackConfig = {
        devtool: 'source-map',
        entry: {
            game: './src/main.js'
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
                { from: 'src/favicon.ico', to: 'favicon.ico' },
                { from: 'src/manifest.webapp.json', to: 'manifest.webapp' }
            ])
        ],
        module: {
            rules: [
                { test: /\.js$/, use: ['babel-loader'], include: path.join(__dirname, 'src') }
            ]
        }
    };

    return webpackConfig;
};
