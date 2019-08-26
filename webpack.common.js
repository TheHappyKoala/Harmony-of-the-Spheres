const HtmlWebpackPlugin = require("html-webpack-plugin");
const webpack = require("webpack");

module.exports = {
  entry: {
    app: "./src/js/index.tsx"
  },
  plugins: [
    new HtmlWebpackPlugin({  
      template: "./src/index.html",
      hash: true
    }),
    new webpack.DefinePlugin({
      DEFAULT_SCENARIO: JSON.stringify("Earth VS. the Rings of Saturn"),
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
    path: `${__dirname}/dist`,
    filename: "bundle.[hash].js",
    globalObject: 'this'
  }
};
  