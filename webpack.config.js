const path = require('path');

module.exports = {
  entry: './server.ts',

  module: {
    rules: [
      {
        test: /\.ts$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },

  resolve: {
    fallback: {
      util: require.resolve('util/'),
      http: require.resolve('stream-http'),
    },
    extensions: ['*.ts', '*.js'],
  },

  output: {
    path: path.resolve(__dirname, 'build'),
    filename: 'bundle.js',
  },
};
