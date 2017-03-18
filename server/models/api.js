import express from 'express'
import session from 'express-session'
import graphQLHTTP from 'express-graphql'
import bodyParser from 'body-parser'
import uuid from 'node-uuid'
import passport from 'passport'
import { Strategy } from 'passport-local'

import historyApiFallback from 'connect-history-api-fallback'
import path from 'path'
import webpack from 'webpack'
import WebpackDevServer from 'webpack-dev-server'

import webpackConfig from './../webpack.config'
import Logger from 'lib/logger'
import schema from 'config/schema'
import { db } from 'db/database'

export default class Api {
  constructor({relayServer, relayPort, middleware, graphQLServer, graphQLPort, graphQLEndpoint}) {
    this.relayServer = relayServer
    this.relayPort = relayPort
    this.middlewareList = middleware || []

    this.graphQLServer = graphQLServer
    this.graphQLPort = graphQLPort
    this.graphQLEndpoint = graphQLEndpoint

    this.middleware()
    this.routing()
  }

  // Configure passport
  passport() {
    passport.use(new Strategy(
      (username, password, done) => done(null, db.getUser('1'))
    ))

    passport.serializeUser(function(user, done) {
      done(null, user.id)
    })

    passport.deserializeUser(function(id, done) {
      done(null, db.getUser(id))
    })
  }

  middleware() {
    this.middlewareList.forEach((el) =>
      this.relayServer.use(el)
    )

    this.relayServer.use(bodyParser.json()) // for parsing application/json
    this.relayServer.use(bodyParser.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded
    this.relayServer.use(session({
      genid: (req) => uuid.v4(),
      secret: this.secret
    }))
  }

  routing() {
    this.graphQLServer.use(this.graphQLEndpoint, graphQLHTTP((req) => {
      const context = {
        user: req.user,
        session: req.session
      }
      return _.extend({ schema, context}, config.graphql)
    }))

    this.relayServer.use('/', express.static(path.join(__dirname, '../build')));
  }

  listen() {
    this.relayServer.listen(this.relayPort, () =>
      console.log(chalk.green(`Relay is listening on port ${this.relayPort}`))
    );

    // If the graphql server is on a separate port, make it listen on that port.
    if (this.graphQLPort && (this.graphQLPort != this.relayPort)) {
      this.graphQLServer.listen(this.graphQLPort, () =>
        console.log(chalk.green(`GraphQL is listening on port ${this.graphQLPort}`))
      );
    }
  }
}
