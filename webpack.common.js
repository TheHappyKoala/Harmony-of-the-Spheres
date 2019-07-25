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
          query: `where=pl_facility like 'La Silla Observatory' and pl_pnum>3`,
          alias: "La Silla"
        },
        {
          query: `where=pl_facility like 'W. M. Keck Observatory' and pl_pnum>2`,
          alias: "Keck"
        },
        {
          query: `where=pl_facility like 'Roque de los Muchachos Observatory' and pl_pnum>0`,
          alias: "Roque de los Muchachos"
        },
        {
          query: `where=pl_facility like 'McDonald Observatory' and pl_pnum>1`,
          alias: "McDonald"
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
    filename: "bundle.[hash].js"
  }
};
