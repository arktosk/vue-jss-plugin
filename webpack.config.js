const webpack = require('webpack');
const project = require('./package.json');

module.exports = {
  mode: 'production',
  entry: './src/index.js',
  output: {
    library: project.name,
    libraryTarget: 'umd',
    umdNamedDefine: true,
    filename: `${project.name}.umd.js`,
    path: (__dirname + '/build'),
  },
  module: {
    rules: [{
      test: /\.js$/,
      include: [__dirname + '/src'],
      loader: 'babel-loader',
    }],
  },
  plugins: [
    new webpack.BannerPlugin([
      project.description,
      '',
      `@version ${project.version}`,
      `@copyright ${project.author.name} ${new Date().getFullYear()}`,
      `@website ${project.homepage}`,
      `@license ${project.license}`,
    ].join('\n')),
  ],
};
