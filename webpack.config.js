var webpack = require('webpack');
var path = require('path');

var BUILD_DIR = path.resolve(__dirname + '/build');
var APP_DIR = path.resolve(__dirname + '/app');

const ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
  entry: APP_DIR + '/index.jsx',
  output: {
    path: BUILD_DIR,
    filename: 'bundle.js',
    publicPath: '/'
  },
  devtool: 'source-map',
  devServer: {
    inline: true,
    contentBase: BUILD_DIR,
    port: 3333
  },
  module: {
    loaders: [
      {
        test: /\.jsx?/,
        include: APP_DIR,
        exclude: /node_modules/,
        loader: 'babel-loader',
        query: {
          babelrc: false,
          presets: ['es2015', 'react', 'stage-2']
        }
      },
      {
        test:/\.(sass|scss)$/,
        loader:ExtractTextPlugin.extract(['css-loader','sass-loader'])
      },
      {
        test:/\.css$/,
        loader:ExtractTextPlugin.extract({fallback: 'style-loader', use: ['css-loader']})
      },
      {
        test:/\.json/,
        loader:"json-loader"
      },
      {
        test:/\.properties/,
        loader:"properties-loader"
      },
      {
        test:/\.(yml|yaml)/,
        loader:"json-loader!yaml-loader"
      },
      {
        test:/\.txt/,
        loader:'raw-loader'
      },
      {
        test: /\.(jpe?g|png|gif|svg|eot|ttf|woff|woff2)$/i,
        loader: 'url-loader'
      }
    ]
  },
  plugins:[
    new ExtractTextPlugin('app.css')
  ]
};
