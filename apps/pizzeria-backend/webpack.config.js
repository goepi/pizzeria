const webpack = require('webpack');
const path = require('path');
const dotenv = require('dotenv');

module.exports = env => {
  // /environments/.env.dev or /environments/.env.prod
  const envPath = path.join(__dirname) + '/environments/.env.' + env.ENVIRONMENT;

  // Set the path parameter in the dotenv config, get the parsed environment variables
  const fileEnv = dotenv.config({ path: envPath }).parsed;

  // make the keys have prefix REACT_APP_
  const envKeys = Object.keys(fileEnv).reduce((prev, next) => {
    prev[`ENV_${next}`] = JSON.stringify(fileEnv[next]);
    return prev;
  }, {});

  envKeys.env = JSON.stringify(env.ENVIRONMENT);
  return {
    entry: './server/index.ts',
    watch: true,
    target: 'node',
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: 'index.js',
    },
    module: {
      rules: [
        { test: /\.tsx?$/, loader: 'ts-loader' },
        {
          test: /\.js?$/,
          exclude: /(node_modules|build)/,
          use: [{ loader: 'babel-loader' }],
        },
      ],
    },
    resolve: {
      extensions: ['.ts', '.tsx', '.js'],
    },
    plugins: [new webpack.DefinePlugin(envKeys)],
    node: {
      __dirname: true,
    },
    context: path.resolve(__dirname),
  };
};
