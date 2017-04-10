import express from 'express'
import flash from 'connect-flash'
import session from 'express-session'
import morgan from 'morgan'
import graphQLHTTP from 'express-graphql'
import bodyParser from 'body-parser'
import uuid from 'node-uuid'
import passport from 'passport'
import { Strategy } from 'passport-local'
import path from 'path'
import chalk from 'chalk'
import _ from 'lodash'
import fs from 'fs'

import Logger from 'hoverBoard/logger'
import schema from 'config/schema'
import { db } from 'db/database'

class App {
  constructor({ secret, relay, graphQL }) {
    this.secret = secret
    this.relay = relay
    this.graphQL = graphQL

    // middleware
    // passport
    // routing

    this.listen = this.listen.bind(this)
  }
}

const app = express()

app.configure(function() {
  app.use(express.static('build'));
  app.use(express.bodyParser());
  app.use(express.session({ secret: 'keyboard cat' }));
  app.use(passport.initialize());
  app.use(passport.session());
  app.use(app.router);

  // Set up graphql
  app.use('/graphql', graphQLHTTP((req) => {
    const context = { user: req.user, session: req.session }

    return { schema, context }
  }))

});

passport.use(new LocalStrategy(
  function(username, password, done) {
    return done(null, { username, password, id: '1' });
  }
));

passport.serializeUser((user, done) => {
  Logger.log('SerializeUser', user)
  return done(null, user.id)
})

passport.deserializeUser((id, done) => {
  Logger.log('DeserializeUser', id)
  return done(null, db.getUser(id))
})

app.post('/login',
  passport.authenticate('local', { successRedirect: '/',
                                   failureRedirect: '/login'})
);

describe('App', () => {
  const server = app
  const user = db.getUser('1')
  const query = `
    query {
      viewer {
        id
        name
      }
    }
  `

  describe('Routes', () => {
    it('responds to /login', (done) => {
      request(server)
        .get('/login')
        .end((err, res) => {
          expect(res.statusCode).toBe(200)
          done()
        })
    })
  })

  describe('Authentication and logging in', () => {
    it('should login existing User', (done) => {
      request(server)
        .post('/login')
        .send(user)
        .end((err, res) => {
          expect(res.statusCode).toBe(302)
          expect(res.text).toBe('Found. Redirecting to /')
          done()
        })
    })
  })

  describe('Authenticated access', () => {
    const agent = request.agent(server)

    it.only('should login existing User', (done) => {
      agent
        .post('/login')
        .send(user)
        .end((err, res) => { Logger.log('Login response', res) })

      agent
        .get('/graphql')
        .query({ query: query })
        .end((err, res) => {
          expect(res.statusCode).toBe(200)
          expect(JSON.parse(res.text).data.viewer).toBe(null)
          done()
        })
    })
  })
})









