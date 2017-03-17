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
  // create the express instance, attach app-level middleware, attach routers
  constructor({ env, secret, graphqlConfig }) {
    this.env = env
    this.secret = secret
    this.graphQlPort = graphql.port

    this.server = express()
    this.passport()
    this.middleware()
    this.routes()

    // Set up a separate relay server using webpack, and proxy `graphql` requests
    // to the server
    if (env == 'development') {
    }
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

  // Register middleware
  middleware() {
    this.server.use(bodyParser.json()) // for parsing application/json
    this.server.use(bodyParser.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded
    this.server.use(session({
      genid: (req) => uuid.v4(),
      secret: this.secret
    }))

    if (env == 'production') {
      this.server.use(historyApiFallback())
    }
  }

  // connect resource routers
  routes() {
    // Login endpoint
    this.server.post('/login', passport.authenticate('local', {
      successRedirect: '/',
      failureRedirect: '/login',
      failureFlash: true
    }) )

    if (env == 'production') {
      this.server.use('/', express.static(path.join(__dirname, '../build')))
      this.server.use('/graphql', graphQLHTTP((req) => {
        const { user, session } = req

        return {
          schema,
          context: { user, session }
        }
      }))
    } else {
      this.server.use('/', graphQLHTTP((req) => {
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
      this.webpackDevServer.use('/', express.static(path.join(__dirname, '../build')))
    }
  }
}
