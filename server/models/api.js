import express from 'express'
import session from 'express-session'
import graphQLHTTP from 'express-graphql'
import bodyParser from 'body-parser'
import uuid from 'node-uuid'
import passport from 'passport'
import { Strategy } from 'passport-local'
import path from 'path'

import Logger from 'lib/logger'
import schema from 'config/schema'
import { db } from 'db/database'

export default class Api {
  constructor({ secret, relay, graphQL }) {
    this.secret = secret
    this.relay = relay
    this.graphQL = graphQl

    this.passport()
    this.middleware()
    this.routing()
  }

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
    const { server, middleware } = this.relay

    // Load environment-specific middleware
    middleware.forEach((el) => server.use(el))

    // Load shared middleware
    server.use(bodyParser.json()) // for parsing application/json
    server.use(bodyParser.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded
    server.use(session({
      genid: (req) => uuid.v4(),
      secret: this.secret
    }))
  }

  routing() {
    const { relay, graphQL } = this

    graphQL.server.use(graphQL.endpoint, graphQLHTTP((req) => {
      const context = { user: req.user, session: req.session }

      return _.extend(graphQL.requestOptions, { schema, context})
    }))

    relay.server.use('/', express.static(path.join(__dirname, '../build')));
  }

  listen() {
    const { relay, graphQL } = this

    relay.server.listen(relay.port, () =>
      console.log(chalk.green(`Relay is listening on port ${relay.port}`))
    );

    // If the graphql server is on a separate port, make it listen on that port.
    if (graphQL.port && (graphQL.port != relay.port)) {
      graqhQL.server.listen(graphQL.port, () =>
        console.log(chalk.green(`GraphQL is listening on port ${graphQL.port}`))
      );
    }
  }
}
