const path = require('path');
const CopyPlugin = require('copy-webpack-plugin')

module.exports = {
  mode: 'development',
  entry: './src/index.js',
  devtool: 'inline-source-map',
  devServer: {
    static: './dist'
  },
  // 关闭警告
  performance: {
    hints: false   
  },
  plugins: [
    new CopyPlugin({
      patterns: [
        {
          from: path.resolve(__dirname, 'public'),
          to: path.resolve(__dirname, 'dist'),
          globOptions: {
            toType: 'dir',
            ignore: ['.*']
          }
        },
        {
          from: path.resolve(__dirname, 'index.html'),
          to: path.resolve(__dirname, 'dist/index.html'),
          globOptions: {
            toType: 'dir',
            ignore: ['.*']
          }
        }
      ]
    })
  ],
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
    clean: true
  }
};