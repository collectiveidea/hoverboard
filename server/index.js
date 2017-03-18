/* eslint-disable no-console, no-shadow */
import path from 'path';
import express from 'express';
import graphQLHTTP from 'express-graphql';
import historyApiFallback from 'connect-history-api-fallback';
import chalk from 'chalk';
import config from 'config/environment';
import schema from 'config/schema';
import _ from 'lodash';
import Api from 'models/api'
import devServer from 'lib/devServer'

const production = config.env === 'production'

const relayServer = production ? express() : devServer()

const app = new Api({
  relayServer: relayServer,
  relayPort: config.port,
  graphQLServer: production ? relayServer : express(),
  graphQLPort: config.graphQLPort,
  graphQLEndpoint: config.graphQLEndpoint,
  middleware: production ? [ historyApiFallback() ] : []
})

app.listen();