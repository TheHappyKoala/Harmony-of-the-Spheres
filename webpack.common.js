const HtmlWebpackPlugin = require("html-webpack-plugin");
const webpack = require("webpack");
const TerserJSPlugin = require('terser-webpack-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const path = require('path');

module.exports = {
  entry: {
    app: `${path.resolve(__dirname, 'src')}/js/index.tsx`
  },
  optimization: {
    minimizer: [new TerserJSPlugin({}), new OptimizeCSSAssetsPlugin({})]
  },
  plugins: [
    new HtmlWebpackPlugin({  
      template: `${path.resolve(__dirname, 'src')}/index.html`,
      hash: true
    }),
    new MiniCssExtractPlugin({
      filename: 'main.[hash].css'
    }),
    new webpack.DefinePlugin({
      DEFAULT_SCENARIO: JSON.stringify({name: "Earth Spoils Saturn", type: "What-If", fileName: "spoilingSaturn.json"}),
      EXOPLANET_ARCHIVE_DATA: JSON.stringify([
        {
          query: `where=pl_facility like 'Transiting Exoplanet Survey Satellite (TESS)'`,
          alias: "TESS"
        },
        {
          query: `where=pl_pnum>1`,
          alias: "Multiplanetary Exosystems"
        }   
      ])
    })
  ],   
  module: {
    rules: [
      {
        test: /\.(less)$/,
        use: [
            MiniCssExtractPlugin.loader,
            "css-loader",
            "less-loader"
        ]
      },
      {
        test: /\.(png|svg|jpg|gif)$/,
        use: ["file-loader"]
      },
      {
        test: /\.(ts|tsx|js|jsx)$/,
        exclude: /node_modules/,   
        use: ["babel-loader"]
      }
    ]
  },
  resolve: {
    extensions: ["*", ".js", ".jsx", ".ts", ".tsx"]
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: "bundle.[hash].js",
    globalObject: 'this'
  }
};
  

