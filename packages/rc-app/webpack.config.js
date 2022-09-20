const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');

module.exports = {
  mode: 'development',
  optimization: {
    minimize: false
  },
  entry: './src/index.tsx',
  output: {
    filename: 'js/[name].bundle.js',
    path: path.resolve(__dirname, "dist")
  },
  devtool: 'source-map',
  resolve: {
    extensions: ['.js', '.jsx', '.json', '.ts', '.tsx'],
    alias: {
      "rc-app": path.resolve(__dirname, './src'),
    },
  },
  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/,
        loader: 'ts-loader'
      },
      { enforce: "pre", test: /\.js$/, use: ["source-map-loader"] },
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader'],
      },
    ]
  },
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      title: 'Development',
      template: 'index.html'
    }),
    new CopyPlugin({patterns: [
      {
        from: 'lib/photon/Photon-Javascript_SDK.js',
        to: 'js/photon.js'
      },
      {
        from: 'side-by-side.html',
        to: 'side-by-side.html'
      }
    ]}),
  ],
  devServer: {
    port: 8000,
    devMiddleware: {
      writeToDisk: true
    }
  }
}
