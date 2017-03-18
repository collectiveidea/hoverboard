/* eslint-disable global-require */
import _ from 'lodash'
import express from 'express';
import devServer from 'hoverBoard/devServer'

const port = process.env.PORT || 3000

const config = {
  env: process.env.NODE_ENV || 'development',
  secret: process.env.SECRET || 'dev_secret',
  relay: {
    server: devServer({ '/graphql': `http://localhost:${port}` }),
    port: port,
    endpoint: '/',
    middleware: []
  },
  graphQL: {
    server: express(),
    port: 8000,
    endpoint: '/graphql',
    requestOptions: {
      graphiql: true,
      pretty: true
    }
  }
}

export default _.extend(config, require(`./${config.env}`).default) // eslint-disable-line

