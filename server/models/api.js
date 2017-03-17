import express from 'express'
import session from 'express-session'
import graphQLHTTP from 'express-graphql'
import Logger from 'lib/logger'
import schema from 'config/schema'
import bodyParser from 'body-parser'
import uuid from 'node-uuid'
import passport from 'passport'
import { Strategy } from 'passport-local'
import { db } from 'db/database'

export default class Api {
  // create the express instance, attach app-level middleware, attach routers
  constructor({ env, secret }) {
    this.env = env
    this.secret = secret
    this.express = express()
    this.passport()
    this.middleware()
    this.routes()
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
    this.express.use(bodyParser.json()) // for parsing application/json
    this.express.use(bodyParser.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded

    this.express.use(session({
      genid: (req) => uuid.v4(),
      secret: this.secret
    }))
  }

  // connect resource routers
  routes() {
    // Login endpoint
    this.express.post('/login', passport.authenticate('local', {
      successRedirect: '/',
      failureRedirect: '/login',
      failureFlash: true
    }) )

    // Graphql endpoint
    this.express.use('/', graphQLHTTP((req) => {
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
  }
}
