'use strict'

const path = require('path')
const webpack = require('webpack')
const autoprefixer = require('autoprefixer')
const precss = require('precss')
const HtmlWebpackPlugin = require('html-webpack-plugin')

let appEntry
let devtool
let plugins

const htmlTemplate = new HtmlWebpackPlugin({
  title: 'Hoverboard - Integrated with Relay, GraphQL, Express, ES6/ES7, JSX, Webpack, Babel, Material Design Lite, and PostCSS',
  template: './client/index.html',
  mobile: true,
  inject: false
})

if (process.env.NODE_ENV === 'production') {
  appEntry = [path.join(__dirname, 'client/index.js')]
  devtool = 'source-map'
  plugins = [
    new webpack.optimize.OccurrenceOrderPlugin(),
    new webpack.optimize.CommonsChunkPlugin({name: 'vendor', filename: 'vendor.js'}),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('production')
      }
    }),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false,
        screw_ie8: true
      }
    }),
    htmlTemplate
  ]
} else {
  appEntry = [
    // activate HMR for React
    'react-hot-loader/patch',
    path.join(__dirname, 'client/index.js'),
    'webpack-dev-server/client?http://localhost:3000',
    'webpack/hot/only-dev-server'
  ]
  devtool = 'eval'
  plugins = [
    new webpack.optimize.CommonsChunkPlugin({name: 'vendor', filename: 'vendor.js'}),
    new webpack.NoEmitOnErrorsPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NamedModulesPlugin(),
    new webpack.DefinePlugin({
      __DEV__: true
    }),
    htmlTemplate
  ]
}

module.exports = {
  entry: {
    app: appEntry,
    vendor: ['react', 'react-dom', 'react-mdl', 'react-relay', 'react-router', 'react-router-relay']
  },
  output: {
    path: path.join(__dirname, 'build'),
    publicPath: '/',
    filename: '[name].js'
  },
  devtool,
  module: {
    rules: [{
      test: /\.jsx?$/,
      loader: 'babel-loader',
      exclude: /node_modules/
    }, {
      test: /\.css$/,
      use: [
        'style-loader',
        'css-loader'
      ],
    }, {
      test: /\.scss$/,
      use: [
        'style-loader',
        {
          loader: 'css-loader',
          options: {
            modules: true,
            importLoaders: 1,
            localIdentName: "[name]__[local]___[hash:base64:5]",
          }
        },
        {
          loader: 'postcss-loader',
          options: {
            //https://github.com/postcss/postcss-loader/issues/164
            // use ident if passing a function
            ident: 'postcss', plugins: () => [
              require('precss'),
              require('autoprefixer')
            ]
          }
        }
      ]
    }, {
      test: /\.(png|jpg|jpeg|gif)$/,
      use: [
        {
          loader: 'url-loader',
          options: {
            limit: 1000,
            name: "assets/[hash].[ext]"
          }
        }
      ]
    },
    {
      test: /\.woff2?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
      loader: "url-loader",
      options: {
        limit: 1000,
        name: "assets/[hash].[ext]"
      }
    },
    {
      test: /\.(ttf|eot|svg)(\?[\s\S]+)?$/,
      loader: 'file-loader'
    }]
  },
  plugins,
  resolve: {
    modules: [
      path.resolve('./client'),
      path.resolve('./server'),
      path.resolve('./hoverBoard'),
      path.resolve('./node_modules')
    ]
  },
}
