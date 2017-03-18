import webpack from 'webpack'
import WebpackDevServer from 'webpack-dev-server'
import webpackConfig from './../../webpack.config'

const devServer = (proxy) => new WebpackDevServer(webpack(webpackConfig), {
  contentBase: '/build/',
  proxy: proxy,
  stats: {
    colors: true
  },
  hot: true,
  historyApiFallback: true
})

export default devServer
