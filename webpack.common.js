const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: {
    app: './src/js/index.tsx'
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html',
      hash: true
    })
  ],
  module: {
    rules: [{
        test: /\.(png|svg|jpg|gif)$/,
        use: ['file-loader']
      },   
      {
        test: /\.(ts|tsx|js|jsx)$/,
        exclude: /node_modules/,
        use: ['babel-loader']
      }
    ]
  }, 
  resolve: {
    extensions: ['*', '.js', '.jsx', '.ts', '.tsx']
  },
  output: {
    path: `${__dirname}/dist`,
    filename: 'bundle.[hash].js'
  }
};              