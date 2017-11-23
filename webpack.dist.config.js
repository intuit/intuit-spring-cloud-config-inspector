var webpack = require('webpack');
var path = require('path');

var BUILD_DIR = path.resolve(__dirname + '/build');
var APP_DIR = path.resolve(__dirname + '/app');

var reactExternal = {
  root: 'React',
  commonjs2: 'react',
  commonjs: 'react',
  amd: 'react'
};
var reactDOMExternal = {
  root: 'ReactDOM',
  commonjs2: 'react-dom',
  commonjs: 'react-dom',
  amd: 'react-dom'
};

const ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
  entry: APP_DIR + '/index.jsx',
  output: {
    filename: '[name].js',
    chunkFilename: '[id].chunk.js',
    path: BUILD_DIR,
    publicPath: './',
    libraryTarget: 'umd',
    library: 'DevPortalAddon'
  },
  devtool: 'source-map',
  devServer: {
    inline: true,
    contentBase: BUILD_DIR,
    port: 3333
  },

  externals: {
    'react': reactExternal,
    'react-dom': reactDOMExternal
  },

  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        include: APP_DIR,
        loader: 'babel-loader',
        exclude: /node_modules/,
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
