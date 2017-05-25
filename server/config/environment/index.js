/* eslint-disable global-require */
const _ = require('lodash')
const express = require('express');
const devServer = require.main.require('../hoverBoard/devServer')

const port = process.env.PORT || 3000
const graphQLPort = 8000

const config = {
  env: process.env.NODE_ENV || 'development',
  secret: process.env.SECRET || 'dev_secret',
  relay: {
    server: devServer({ '/graphql': `http://localhost:${graphQLPort}` }),
    port: port,
    endpoint: '/',
    middleware: []
  },
  graphQL: {
    server: express(),
    port: graphQLPort,
    endpoint: '/graphql',
    requestOptions: {
      graphiql: true,
      pretty: true
    }
  }
}

module.exports = _.extend(config, require(`./${config.env}`).default) // eslint-disable-line

