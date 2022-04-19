
const path = require('path');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

//const plugin_dir = "/Users/xiaoqiang/Projects/cutterman-cn/cutterman-photoshop-panel/src/jsx";
const plugin_dir = "./dist";
const dist_dir = "./dist";

module.exports = (env, argv) => {
    const output_dir = argv.mode === 'development'? dist_dir : plugin_dir;
    return {
        mode: 'production',
        target: ['web', 'es5'],
        entry: {
            index: './src/index.ts'
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
                    test: /\.jsx(\?.*)?$/i,
                    uglifyOptions: {
                        mangle: false,
                        compress: false,
                        output: {
                            beautify: true,
                        },
                    }
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
        output: {
            filename: '[name].jsx',
            path: path.resolve(output_dir)
        }
    }};
