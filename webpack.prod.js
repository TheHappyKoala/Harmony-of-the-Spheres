const merge = require('webpack-merge');
const common = require('./webpack.common.js');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const BannerPlugin = require('webpack').BannerPlugin; 

const extractLess = new ExtractTextPlugin('main.css');

module.exports = merge(common, {
  plugins: [
    extractLess,
    new CleanWebpackPlugin('dist', {}),
    new CopyWebpackPlugin([
      {from:'src/images',to:'images'},          
      {from:'src/textures',to:'textures'},
      {from:'src/models',to:'models'}       
    ]),
    new BannerPlugin({
      banner: `
        Harmony of the Spheres - Newtonian n-body gravity simulator
        Copyright (C) 2019 Darrell A. Huffman
        License: GNU GENERAL PUBLIC LICENSE Version 3, 29 June 2007
        Email: darrell.arjuna.huffman@gmail.com
        Full License: https://github.com/TheHappyKoala/Harmony-of-the-Spheres/blob/master/LICENSE

      `
    })
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