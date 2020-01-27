const path = require('path');
const {DefinePlugin, EnvironmentPlugin, HotModuleReplacementPlugin} = webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
// const TerserPlugin = require('terser-webpack-plugin');
const {VueLoaderPlugin} = require('vue-loader');
const {name} = require('./package.json');
const {version} = require('../../package.json');

module.exports = (env = {}) => {
  process.env.NODE_ENV = env.NODE_ENV || 'production';

  return {
    entry: path.resolve(__dirname, 'src/main.js'),
    mode: process.env.NODE_ENV || 'production',
    devtool: (process.env.NODE_ENV === 'development') ? 'eval-source-map' : 'none',
    output: {
      path: path.resolve(__dirname, 'build/'),
      filename: (process.env.NODE_ENV === 'development') ? `js/${name}.bundle.js` : `js/${name}-[hash].bundle.js`,
    },
    resolve: {
      extensions: ['.js', '.json', '.vue'],
    },
    devServer: {
      hot: true,
      watchOptions: {
        poll: true,
      },
      compress: true,
      port: 9000,
    },
    module: {
      rules: [
        {
          test: /\.vue$/,
          loader: 'vue-loader',
          exclude: /node_modules/,
          options: {
            hotReload: process.env.NODE_ENV === 'development',
          },
        },
        {
          test: /\.js$/,
          loader: 'babel-loader',
          exclude: /node_modules/,
        },
        {
          test: /\.(png|jpe?g|gif)$/i,
          loader: 'file-loader',
          options: {
            outputPath: 'images',
            esModule: false,
          },
        },
      ],
    },
    optimization: {
      minimize: process.env.NODE_ENV !== 'development',
      // minimizer: [
      //   new TerserPlugin({
      //     include: /\.js$/,
      //     extractComments: false,
      //   }),
      // ],
    },
    plugins: [
      new DefinePlugin({VERSION: JSON.stringify(version)}),
      new EnvironmentPlugin(['NODE_ENV']),
      new HtmlWebpackPlugin({
        title: 'Vue JSS Example',
        minify: process.env.NODE_ENV !== 'development',
      }),
      new HotModuleReplacementPlugin(),
      new VueLoaderPlugin(),
    ],
  };
};
