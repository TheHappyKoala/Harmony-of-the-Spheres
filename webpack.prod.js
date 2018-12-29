const merge = require('webpack-merge');
const common = require('./webpack.common.js');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const extractLess = new ExtractTextPlugin('main.css');

module.exports = merge(common, {
  plugins: [
    extractLess,
    new CleanWebpackPlugin('dist', {}),
    new CopyWebpackPlugin([
      {from:'src/models',to:'images'},          
      {from:'src/textures',to:'textures'},
      {from:'src/models',to:'models'}       
    ]), 
  ],
  module: {
    rules: [{
      test: /\.less$/,
      use: extractLess.extract({
        use: [{
            loader: 'css-loader'
          },
          {
            loader: 'less-loader'
          }
        ],
        fallback: 'style-loader'
      })
    }]
  }
});