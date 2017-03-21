import express from 'express'
import historyApiFallback from 'connect-history-api-fallback'

const relayServer = express()
const port = process.env.PORT || 3000

export default {
  relay: {
    server: relayServer,
    port: port,
    endpoint: '/',
    middleware:  [ historyApiFallback() ]
  },
  graphQL: {
    server: relayServer,
    port: port,
    endpoint: '/graphql',
    requestOptions: {
      graphiql: false,
      pretty: false
    }
  }
}
