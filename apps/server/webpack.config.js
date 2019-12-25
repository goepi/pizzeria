const webpack = require('webpack');
const path = require('path');

module.exports = {
  entry: './src/index.ts',
  target: 'node',
  watch: true,
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'index.js',
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: 'ts-loader',
        options: { context: path.resolve(__dirname), configFile: 'tsconfig.webpack.json' },
      },
      {
        test: /\.js?$/,
        exclude: /(node_modules|dist)/,
        use: [{ loader: 'babel-loader' }],
      },
    ],
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js'],
  },
  node: {
    __dirname: true,
  },
  context: path.resolve(__dirname),
};
