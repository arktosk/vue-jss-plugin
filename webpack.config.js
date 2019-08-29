module.exports = {
  mode: 'production',
  entry: './src/index.js',
  output: {
    libraryTarget: 'umd',
    library: 'Lib',
    filename: 'vue-jss-plugin.min.js',
    path: (__dirname + '/build'),
  },
  module: {
    rules: [{
      test: /\.js$/,
      include: [__dirname + '/src'],
      loader: 'babel-loader',
    }],
  },
};
