
const path = require('path');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const JSXBinWebpackPlugin = require('jsxbin-webpack-plugin')

const dist_dir = "./dist";

module.exports = (env, argv) => {
    return {
        mode: 'production',
        target: ['web', 'es3'],
        entry: {
            index: './src/index.ts',
            main: './src/main.ts',
        },
        resolve: {
            extensions: ['.js', '.ts', '.json'],
        },
        devServer: {
            contentBase: path.join(__dirname, 'dist'),
            compress: false,
            port: 8080,
        },
        optimization: {
            minimizer:  [
                new UglifyJsPlugin({
                    test: /\.js(\?.*)?$/i,
                    uglifyOptions: {
                        mangle: false,
                        compress: false,
                        output: {
                            beautify: true,
                        },
                    }
                }),
                /*
                new JSXBinWebpackPlugin({
                    test: /\.js$/
                })
                 */
            ]
        },
        module: {
            rules: [{
                test: /\.ts?$/,
                use: 'ts-loader',
                exclude: /node_modules/
            }]
        },
        plugins: [
        ],
        output: {
            filename: '[name].js',
            path: path.resolve(dist_dir),
        }
    }};
