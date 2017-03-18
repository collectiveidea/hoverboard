import webpack from 'webpack'
import WebpackDevServer from 'webpack-dev-server'
import webpackConfig from './../webpack.config'
import config from 'config/environment'

const devServer = () => new WebpackDevServer(webpack(webpackConfig), {
  contentBase: '/build/',
  proxy: {
    '/graphql': `http://localhost:${config.graphQLPort}`
  },
  stats: {
    colors: true
  },
  hot: true,
  historyApiFallback: true
})

export default devServer
