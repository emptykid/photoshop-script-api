
const path = require('path');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const JSXBinWebpackPlugin = require('jsxbin-webpack-plugin')


const plugin_dir = "/Users/xiaoqiang/Projects/cutterman-cn/cutterman-photoshop-panel/src/panel/assets/jsx";
//const plugin_dir = "/Users/xiaoqiang/Projects/cutterman-cn/psd-cleaner/src/panel/assets/jsx";
//const plugin_dir = "/Users/xiaoqiang/Library/Application Support/Adobe/CEP/extensions/com.cutterman.cutterman.panel.unsigned/panel/assets/jsx";
//const plugin_dir = "./dist";
const dist_dir = "./dist";

module.exports = (env, argv) => {
    const output_dir = plugin_dir;
    return {
        mode: 'production',
        target: ['web', 'es5'],
        entry: {
            app: './src/cutterman/Main.ts',
            /*
            app: './src/PSDCleaner.ts',
            index: './src/index.ts',
            test: './src/Test.ts'
             */
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
                            beautify: false,
                        },
                    }
                }),
                new JSXBinWebpackPlugin({
                    test: /\.js$/
                })
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
            path: path.resolve(output_dir)
        }
    }};
