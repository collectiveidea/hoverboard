/* eslint-disable no-console, no-shadow */
import path from 'path';
import webpack from 'webpack';
import express from 'express';
import graphQLHTTP from 'express-graphql';
import WebpackDevServer from 'webpack-dev-server';
import historyApiFallback from 'connect-history-api-fallback';
import chalk from 'chalk';
import webpackConfig from './../webpack.config';
import config from 'config/environment';
import schema from 'config/schema';
import _ from 'lodash';
import Api from 'models/api'

const production = config.env === 'production'

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