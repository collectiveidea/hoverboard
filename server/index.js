/* eslint-disable no-console, no-shadow */
import chalk from 'chalk'
import http from 'http'
import config from 'config/environment'
import Api from 'models/api'
//import createGraphQlServer from 'config/graphQlServer'
//import createRelayServer from 'config/relayServer'

const app = new Api(config)
const server = http.createServer(app.express)

server.listen(
  config.graphql.port,
  () => console.log(
    chalk.green(`GraphQL is listening on port ${config.graphql.port}`)
  ) // eslint-disable-line no-console
)

// createRelayServer(config)
