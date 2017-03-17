import chalk from 'chalk'
import path from 'path'
import webpack from 'webpack'
import webpackConfig from '../webpack.config'
import WebpackDevServer from 'webpack-dev-server'
import express from 'express'

import graphQLHTTP from 'express-graphql'
import historyApiFallback from 'connect-history-api-fallback'
import schema from './schema'

export default function createRelayServer(config) {
  // Launch Relay by using webpack.config.js

  let relayServer

  if (config.env === 'development') {
    relayServer = new WebpackDevServer(webpack(webpackConfig), {
      contentBase: '/build/',
      proxy: {
        '/graphql': `http://localhost:${config.graphql.port}`
      },
      stats: {
        colors: true
      },
      hot: true,
      historyApiFallback: true
    })

    // Serve static resources
    relayServer.use('/', express.static(path.join(__dirname, '../build')))
    relayServer.listen(
      config.port,
      () => console.log(chalk.green(`Relay is listening on port ${config.port}`)) // eslint-disable-line no-console
    )
  } else if (config.env === 'production') {
    // Launch Relay by creating a normal express server
    relayServer = express()
    relayServer.use(historyApiFallback())
    relayServer.use('/', express.static(path.join(__dirname, '../build')))
    relayServer.use('/graphql', graphQLHTTP({ schema }))
    relayServer.listen(
      config.port,
      () => console.log(chalk.green(`Relay is listening on port ${config.port}`)) // eslint-disable-line no-console
    )
  }
  return relayServer
}
