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
          presets: ['env', 'react', 'stage-2'],
          plugins: ['transform-class-properties']
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
        test:/.svg$/,
        loader:'url-loader',
        query:{
          mimetype:'image/svg+xml',
          name:'./~/semantic-ui-css/themes/default/assets/fonts/icons.svg'
         }
      },
      {
        test:/.woff$/,
        loader:'url-loader',
        query:{
          mimetype:'application/font-woff',
          name:'./~/semantic-ui-css/themes/default/assets/fonts/icons.woff'
        }
      },
      {
        test:/.woff2$/,
        loader:'url-loader',
        query:{
          mimetype:'application/font-woff2',
          name:'./~/semantic-ui-css/themes/default/assets/fonts/icons.woff2'
        }
      },
      {
        test:/.[ot]tf$/,
        loader:'url-loader',
        query:{
          mimetype:'application/octet-stream',
          name:'./~/semantic-ui-css/themes/default/assets/fonts/icons.ttf'
        }
      },
      {
        test:/.eot$/,
        loader:'url-loader',
        query:{
          mimetype:'application/vnd.ms-fontobject',
          name:'./~/semantic-ui-css/themes/default/assets/fonts/icons.eot'
        }
      },
      {
        test:/.png$/,
        loader:'url-loader',
        query:{
          mimetype:'image/png',
          name:'./~/semantic-ui-css/themes/default/assets/images/flags.png'
        }
      }
    ]
  },
  plugins:[
    new ExtractTextPlugin('app.css')
  ]
};
