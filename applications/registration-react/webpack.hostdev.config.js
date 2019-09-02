const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
  mode: 'development',
  devtool: 'cheap-module-source-map',
  entry: ['@babel/polyfill', 'whatwg-fetch', './src/index.jsx'],
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'bundle.js'
  },
  devServer: {
    host: '0.0.0.0',
    port: 4301,
    historyApiFallback: true,
    before: app =>
      app.get('/env.json', (_, res) =>
        res.json({
          SEARCH_HOST: process.env.SEARCH_HOST || 'http://localhost:8080',
          REGISTRATION_API_HOST:
            process.env.REGISTRATION_API_HOST || 'http://localhost:8114',
          CONCEPT_REGISTRATION_API_HOST:
            process.env.CONCEPT_REGISTRATION_API_HOST ||
            'http://localhost:8200',
          CONCEPT_REGISTRATION_HOST:
            process.env.CONCEPT_REGISTRATION_HOST || 'http://localhost:8202',
          SSO_HOST: process.env.SSO_HOST || 'http://localhost:8084'
        })
      )
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /(node_modules)/,
        loader: 'babel-loader'
      },
      {
        test: /\.s?css$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          'resolve-url-loader',
          {
            loader: 'sass-loader',
            options: {
              sourceMap: true,
              sourceMapContents: false
            }
          }
        ]
      },
      {
        test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        loader: 'url-loader?limit=10000&mimetype=application/font-woff'
      },
      {
        test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        loader: 'file-loader'
      },
      {
        test: /\.(png|jpg)$/,
        use: [
          {
            loader: 'url-loader',
            options: { limit: 10000 } // Convert images < 10k to base64 strings
          }
        ]
      }
    ]
  },
  resolve: {
    alias: {
      react: path.resolve('./node_modules/react')
    },
    extensions: ['.js', '.jsx', '.webpack.js', '.web.js']
  },
  resolveLoader: {
    modules: [__dirname, 'node_modules']
  },
  optimization: {
    minimize: false
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html',
      filename: 'index.html',
      inject: true
    }),
    new MiniCssExtractPlugin({
      filename: 'styles.css'
    }),
    new CopyWebpackPlugin(
      [{ from: './src/assets/img/*', to: './static/img', flatten: true }],
      {
        copyUnmodified: true
      }
    )
  ]
};
