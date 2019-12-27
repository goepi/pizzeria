const webpack = require('webpack');
const path = require('path');
const dotenv = require('dotenv');

module.exports = env => {
  const envPath = path.join(__dirname) + '/envs/.env.' + env.ENVIRONMENT;

  // Set the path parameter in the dotenv config, get the parsed environment variables
  const fileEnv = dotenv.config({ path: envPath }).parsed;

  // make the keys have prefix REACT_APP_
  const envKeys = Object.keys(fileEnv).reduce((prev, next) => {
    prev[`ENV_${next}`] = JSON.stringify(fileEnv[next]);
    return prev;
  }, {});

  envKeys.env = JSON.stringify(env.ENVIRONMENT);
  return {
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
    plugins: [
      new webpack.DefinePlugin(envKeys),
      new webpack.ProvidePlugin({
        Debug: 'Debug',
      }),
    ],
    node: {
      __dirname: true,
    },
    context: path.resolve(__dirname),
  };
};
