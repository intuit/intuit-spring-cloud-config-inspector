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
        loader: 'babel-loader',
        query: {
          presets: ['env', 'react']
        }
      },
      {
        test:/\.(sass|scss)$/,
        loader:ExtractTextPlugin.extract(['css-loader','sass-loader'])
      },
      {
        test:/\.css$/,
        loader:ExtractTextPlugin.extract(['css-loader'])
      }
    ]
  },
  plugins:[
    new ExtractTextPlugin('app.css')
  ]
};
