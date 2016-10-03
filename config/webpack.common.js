var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var helpers = require('./helpers');

module.exports = {
    entry: {
        'polyfills': './demo/polyfills.ts',
        'vendor': './demo/vendor.ts',
        'app': './demo/main.ts'
    },

    resolve: {
        extensions: ['', '.js', '.ts']
    },

    devtool: 'source-map',

    module: {

        preLoaders: [
            {
                test: /\.ts$/,
                include: helpers.root('src'),
                loader: "tslint"
            }
        ],

        loaders: [
            {
                test: /\.ts$/,
                loaders: [
                    'awesome-typescript-loader',
                    'angular2-template-loader'
                ]
            },
            {
                test: /\.html$/,
                loader: 'raw-loader'
            },
            {
                test: /\.(png|jpe?g|gif|svg|woff|woff2|ttf|eot|ico)$/,
                loader: 'file?name=assets/[name].[hash].[ext]'
            },
            {
                test: /\.css$/,
                exclude: helpers.root('src'),
                loader: ExtractTextPlugin.extract('style', 'css?sourceMap')
            },
            {
                test: /\.css$/,
                include: helpers.root('src'),
                loader: 'raw'
            },
            {
                test: /\.less$/,
                loaders: ['css-to-string', 'css', 'less']
                // loader: ExtractTextPlugin.extract('raw!css!less')
                // loader: ExtractTextPlugin.extract(
                //     // activate source maps via loader query
                //     'css?sourceMap!' +
                //     'less?sourceMap'
                // )
            }
        ]
    },

    plugins: [
        new webpack.optimize.CommonsChunkPlugin({
            name: ['app', 'vendor', 'polyfills']
        }),

        new webpack.optimize.UglifyJsPlugin({
            beautify: false, //prod
            mangle: { screw_ie8 : true, keep_fnames: true }, //prod
            compress: { screw_ie8: true }, //prod
            comments: false //prod

        }),

        new HtmlWebpackPlugin({
            template: 'demo/index.html'
        })
    ],

    tslint: {
        configuration: {
            rules: {
                quotemark: [true, 'single']
            }
        },

        // tslint errors are displayed by default as warnings
        // set emitErrors to true to display them as errors
        emitErrors: false,

        // tslint does not interrupt the compilation by default
        // if you want any file with tslint errors to fail
        // set failOnHint to true
        failOnHint: true,

        // name of your formatter (optional)
        // formatter: "yourformatter",

        // path to directory containing formatter (optional)
        // formattersDirectory: "node_modules/tslint-loader/formatters/",

        // These options are useful if you want to save output to files
        // for your continuous integration server
        // fileOutput: {
        //     // The directory where each file's report is saved
        //     dir: "./foo/",
        //
        //     // The extension to use for each report's filename. Defaults to "txt"
        //     ext: "xml",
        //
        //     // If true, all files are removed from the report directory at the beginning of run
        //     clean: true,
        //
        //     // A string to include at the top of every report file.
        //     // Useful for some report formats.
        //     header: "<?xml version=\"1.0\" encoding=\"utf-8\"?>\n<checkstyle version=\"5.7\">",
        //
        //     // A string to include at the bottom of every report file.
        //     // Useful for some report formats.
        //     footer: "</checkstyle>"
        // }
    }
};