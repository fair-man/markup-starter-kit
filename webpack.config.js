let path = require('path');
let webpack = require('webpack');

const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

let pathsToClean = [
  'dist'
];

let cleanOptions = {
  root: __dirname,
  verbose: true,
  dry: false,
  watch: true
};

let config = {
  entry: {
    main: './src/main'
  },
  output: {
    path: path.join(__dirname, 'dist'),
    filename: '[name].[hash].js',
    library: '[name]'
  },
  module: {
    rules: [
      {
        use: ['babel-loader'],
        include: [
          path.resolve(__dirname, "src"),
        ],
        test: /\.js$/
      }
    ]
  }
};

module.exports = (env, argv) => {
  const MODE = argv.mode || 'development';

  if (MODE == 'development') {
    config.devtool = 'inline-cheap-module-source-map';
    config.watch = true
  }

  config.plugins = [
    new CleanWebpackPlugin(pathsToClean, cleanOptions),
    new webpack.DefinePlugin({
      MODE: JSON.stringify(MODE)
    }),
    new HtmlWebpackPlugin({
      template: path.join(__dirname, '/src/index.html')
    }),
    new MiniCssExtractPlugin({
      filename: MODE === 'development' ? '[name].css' : '[name].[hash].css',
      chunkFilename: MODE === 'development' ? '[id].css' : '[id].[hash].css',
    })
  ];

  config.module.rules.push({
    test: /\.(sa|sc|c)ss$/,
    use: [
      MODE === 'development' ? 'style-loader' : MiniCssExtractPlugin.loader,
      'css-loader',
      'sass-loader',
    ],
  });

  if (MODE === 'production') {
    config.optimization = {
      minimizer: [
        new UglifyJsPlugin({
          cache: true,
          parallel: true,
          uglifyOptions: {
            compress: false,
            warnings: false
          },
        })
      ]
    }
  }

  return config;
};