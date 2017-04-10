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
import request from 'supertest'

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

const user = { username: 'jon', password: 'foobarbaz', id: '1' }
const app = express()

app.use(express.static('build'))
app.use(bodyParser.json()) // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded
app.use(session({
  secret: 'foobarbaz'
}))
app.use(passport.initialize())
app.use(passport.session())

app.use('/login',
  passport.authenticate('local', { successRedirect: '/',
                                   failureRedirect: '/login'})
)

passport.use(new Strategy(
  function(username, password, done) {
    return done(null, user)
  }
))

passport.serializeUser((user, done) => {
  return done(null, user.id)
})

passport.deserializeUser((id, done) => {
  return done(null, db.getUser(id))
})

app.get('/', function (req, res) {
  res.send({ user: req.user, session: req.session })
})

describe('App', () => {
  describe('Authenticated access', () => {
    const agent = request.agent(app)

    it ('should persist a user in the session', (done) => {
      agent
        .post('/login')
        .send(user)
        .end((err, res) => { Logger.log('Login response', res) })

      agent
        .get('/')
        .end((err, res) => {
          expect(res.statusCode).toBe(200)
          expect(JSON.parse(res.text).session).not.toBe(null)
          expect(JSON.parse(res.text).user).toBe(undefined)
          done()
        })
    })
  })

  describe('Authentication and logging in', () => {
    it('should login existing User', (done) => {
      request(app)
        .post('/login')
        .send(user)
        .end((err, res) => {
          expect(res.statusCode).toBe(302)
          expect(res.text).toBe('Found. Redirecting to /')
          done()
        })
    })
  })
})









