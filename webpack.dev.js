const merge = require('webpack-merge');
const common = require('./webpack.common.js');
const webpack = require('webpack');

module.exports = merge(common, {
  devtool: 'source-map',
  devServer: {
    contentBase: './src',    
    hot: true,
    port: 7000
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin()
  ],
  module: {
    rules: [{
      test: /\.js$/,
      exclude: /node_modules/,
      use: ['babel-loader', 'eslint-loader']
    }, {
      test: /\.less$/,
      use: [{
          loader: 'style-loader'
        },
        {
          loader: 'css-loader'
        },
        {
          loader: 'less-loader'
        }
      ]
    }]
  }
});