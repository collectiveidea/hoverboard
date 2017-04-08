import express from 'express'
import flash from 'connect-flash'
import session from 'express-session'
import graphQLHTTP from 'express-graphql'
import bodyParser from 'body-parser'
import uuid from 'node-uuid'
import passport from 'passport'
import { Strategy } from 'passport-local'
import path from 'path'
import chalk from 'chalk'
import _ from 'lodash'

import Logger from 'hoverBoard/logger'
import schema from 'config/schema'
import { db } from 'db/database'

export default class App {
  constructor({ secret, relay, graphQL }) {
    this.secret = secret
    this.relay = relay
    this.graphQL = graphQL

    this.passport()
    this.middleware()
    this.routing()

    this.listen = this.listen.bind(this)
  }

  passport() {
    this.relay.server.use(flash())

    passport.use(new Strategy(
      { passReqToCallback : true },
      (req, username, password, done) => done(null, db.getUser('1'))
    ))

    passport.serializeUser(function(user, done) {
      done(null, user.id)
    })

    passport.deserializeUser(function(id, done) {
      done(null, db.getUser(id))
    })
  }

  middleware() {
    const { server, middleware } = this.relay

    // Load environment-specific middleware
    middleware.forEach((el) => server.use(el))

    // Load shared middleware
    server.use(bodyParser.json()) // for parsing application/json
    server.use(bodyParser.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded
    server.use(session({
      resave: true,
      saveUninitialized: true,
      genid: (req) => uuid.v4(),
      secret: this.secret
    }))
  }

  routing() {
    const { relay, graphQL } = this

    // Set up graphql endpoint
    graphQL.server.use(graphQL.endpoint, graphQLHTTP((req) => {
      const context = { user: req.user, session: req.session }

      return _.extend(graphQL.requestOptions, { schema, context})
    }))

    // Set up the other endpoints
    relay.server.use('/', express.static(path.join(__dirname, '../build')))

    relay.server.use('/login', passport.authenticate('local', {
      successRedirect: '/',
      failureRedirect: '/login',
      failureFlash: true
    }) )
  }

  listen() {
    const { relay, graphQL } = this

    // If the graphql server is on a separate port, make it listen on that port.
    if (graphQL.port && (graphQL.port != relay.port)) {
      graphQL.server.listen(graphQL.port, () =>
        console.log(chalk.green(`GraphQL is listening on port ${graphQL.port}`))
      );
    }

    return relay.server.listen(relay.port, () =>
      console.log(chalk.green(`Relay is listening on port ${relay.port}`))
    );

  }
}
