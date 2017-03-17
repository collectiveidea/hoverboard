/* eslint-disable no-console, no-shadow */
import config from 'config/environment'
import http as http from 'http'
import Api from './Api'

const app = new Api(config)
let graphQlConfig

if (config.env === 'development') {
  graphQlConfig = {
    port: 8000,
    graphiql: true,
    pretty: true
  }

  const relayServer = new WebpackDevServer(webpack(webpackConfig), {
    contentBase: '/build/',
    proxy: {
      '/graphql': `http://localhost:${this.graphQlPort}`
    },
    stats: {
      colors: true
    },
    hot: true,
    historyApiFallback: true
  })


  // Development middlware stack
  app.server.use('/', graphQLHTTP((req) => {
    // const { user, session, body, method, originalUrl } = req
    const { session, body, method, originalUrl } = req

    // FIXME: Stub in user for now until we get passport working
    const user = db.getUser('1')

    Logger.print(`graphQLHTTP ${method} ${originalUrl}`, body.query, user)

    return {
      graphiql: true,
      pretty: true,
      schema,
      context: { user, session }
    }
  }))
  app.webpackDevServer.use('/', express.static(path.join(__dirname, '../build')))

  const server = http.createServer(app.webpackDevServer)
  server.listen(config.port)
  server.on('listening', () => console.log(chalk.green(`Relay is listening on port ${config.port}`)))

  const relayServer = http.createServer(app.server)
  relayServer.listen(config.graphql.port)
  relayServer.on('listening', () => console.log(chalk.green(`GraphQL is listening on port ${graphQlPort}`)))

} else if (config.env === 'production') {
  graphQlConfig = {
    port: 3000,
    graphiql: false,
    pretty: false
  }

  // Production middleware stack
  app.server.use(historyApiFallback())
  app.server.use('/', express.static(path.join(__dirname, '../build')))
  app.server.use('/graphql', graphQLHTTP((req) => {
    const { user, session } = req

    return {
      schema,
      context: { user, session }
    }
  }))
  app.server.use(historyApiFallback())

  const server = http.createServer(app.server)
  server.listen(config.port)
  server.on('listening', () => console.log(chalk.green(`Relay is listening on port ${config.port}`)))
}
