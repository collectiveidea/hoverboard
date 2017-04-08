/* global describe it expect beforeEach */

import request from 'supertest'

import schema from 'config/schema'
import config from 'config/environment'
import App from 'hoverBoard/app'
import Logger from 'hoverBoard/logger'
import { db } from 'db/database'

describe('App', () => {
  const query = `
    query {
      viewer {
        id
        name
      }
    }
  `
  let server

  describe('Unauthenticated Routes', () => {
    beforeEach(() => {
      server = request(new App(config).relay.server)
    })

    it('responds to /graphql', (done) => {
      server
        .get('/graphql')
        .query({ query: query })
        .end((err, res) => {
          expect(res.statusCode).toBe(200)
          expect(JSON.parse(res.text).data.viewer).toBe(null)
          done()
        })
    })

    it('responds to /login', (done) => {
      server
        .get('/login')
        .end((err, res) => {
          expect(res.statusCode).toBe(200)
          done()
        })
    })
  })

  describe('Authentication and logging in', () => {
    let user = db.getUser('1')

    beforeEach(() => {
      server = request(new App(config).relay.server)
    })

    it('should login existing User', () => {
      return server
        .post('/login')
        .send({
          email: user.email,
          password: user.password
        })
        .then((res) => {
          Logger.log('Response:', res)
          expect(res.statusCode).toBe(302)
          expect(res.text).toBe('Found. Redirecting to /')
        })
    })
  })

  describe('Autenticated Routes', () => {
    let user = db.getUser('1')

    beforeEach(() => {
      server = request(new App(config).relay.server)
      server
        .post('/login')
        .send({
          email: user.email,
          password: user.password
        })
    })

    it('responds to /graphql', (done) => {
      server
        .get('/graphql')
        .query({ query: query })
        .end((err, res) => {
          expect(res.statusCode).toBe(200)
          expect(JSON.parse(res.text).data.viewer).not.toBe(null)
          done()
        })
    })
  })
})

