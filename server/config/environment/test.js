import express from 'express'
import historyApiFallback from 'connect-history-api-fallback';

const relayServer = express()

export default {
  relay: {
    server: relayServer,
    port: process.env.PORT || 3000,
    endpoint: '/',
    middleware:  [ historyApiFallback() ]
  },
  graphQL: {
    server: relayServer,
    port: 3000,
    endpoint: '/graphql',
    requestOptions: {
      graphiql: true,
      pretty: true
    }
  }
}
