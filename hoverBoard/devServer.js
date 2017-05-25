const webpack = require('webpack')
const WebpackDevServer = require('webpack-dev-server')
const webpackConfig = require.main.require('../webpack.config')

const devServer = (proxy) => new WebpackDevServer(webpack(webpackConfig), {
  contentBase: '/build/',
  proxy: proxy,
  stats: {
    colors: true
  },
  hot: true,
  historyApiFallback: true
})

module.exports = devServer
