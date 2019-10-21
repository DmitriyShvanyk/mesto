const webpack = require('webpack');

// плагин, который превращает относительный путь в абсолютный
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const WebpackMd5Hash = require('webpack-md5-hash');

// плагин для чтения css внутри js-кода
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const isDev = process.env.NODE_ENV === 'development';

module.exports = {
  entry: {
    main: './src/index.js'
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: './js/[name].[chunkhash].js'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader"
        }
      },
      {
        test: /\.css$/,
        use: [
          (isDev ? 'style-loader' : MiniCssExtractPlugin.loader),
          'css-loader',
          'postcss-loader'
        ]
      },      
      {
        test: /\.(png|jpg|gif|ico|svg)$/,
        use: {
          loader: "file-loader",
          options: {
            name: "./images/[name].[ext]",            
            outputPath: '',
            publicPath: "../",
          },
        },
      },

      {
        test: /\.(ttf|eot|woff|woff2)$/,
        use: {
          loader: "file-loader",
          options: {
            name: "./vendor/fonts/[name].[ext]",
            publicPath: "../",
          },
        },
      },

    ]
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: './css/main.[contenthash].css',
      options: {
        publicPath: "../",
      },
    }),
    new HtmlWebpackPlugin({
      inject: false,
      hash: true,
      template: './src/index.html',
      filename: 'index.html'
    }),
    new WebpackMd5Hash(),
    new webpack.DefinePlugin({
      'NODE_ENV': JSON.stringify(process.env.NODE_ENV)
    }),
    new OptimizeCssAssetsPlugin({
      assetNameRegExp: /\.css$/g,
      cssProcessor: require('cssnano'),
      cssProcessorPluginOptions: {
        preset: ['default'],
      },
      canPrint: true
    }),
    new UglifyJsPlugin({
      uglifyOptions: {
        compress: {
          global_defs: {
            "@alert": "console.log",
          },
          drop_console: true
        }
      }
    })
  ]
};




