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

export default function createGraphQlServer(config) {
  // Set up passport
  passport.use(new Strategy(
    (username, password, done) => done(null, db.getUser('1'))
  ))

  passport.serializeUser(function(user, done) {
    done(null, user.id)
  })

  passport.deserializeUser(function(id, done) {
    done(null, db.getUser(id))
  })

  // Expose a GraphQL endpoint
  const app = express()

  app.use(bodyParser.json()) // for parsing application/json
  app.use(bodyParser.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded

  app.post('/login', passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: true
  }) );

  app.use(session({
   genid: (req) => uuid.v4(),
   secret: config.secret
  }))

  app.use('/', graphQLHTTP((req) => {
    // const { user, session, body, method, originalUrl } = req
    const { session, body, method, originalUrl } = req
    const user = db.getUser('1')

    Logger.print(`graphQLHTTP ${method} ${originalUrl}`, body.query, user)
    
    return {
      graphiql: true,
      pretty: true,
      schema,
      context: { user, session }
    }
  }))

  return app
}
