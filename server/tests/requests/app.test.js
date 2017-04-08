/* global describe it expect beforeEach */

import request from 'supertest'

import schema from 'config/schema'
import config from 'config/environment'
import App from 'hoverBoard/app'
import Logger from 'hoverBoard/logger'
import { db } from 'db/database'

describe('App', () => {
  const app = new App(config)
  const server = app.relay.server
  const query = `
    query {
      viewer {
        id
        name
      }
    }
  `

  describe('Routes', () => {
    it('responds to /graphql', (done) => {

      request(server)
        .get('/graphql')
        .query({ query: query })
        .end((err, res) => {
          expect(res.statusCode).toBe(200)
          expect(JSON.parse(res.text).data.viewer).toBe(null)
          done()
        })
    })

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
    let user = db.getUser('1')

    it('should login existing User', () => {
      let token = null
      return request(server)
        .post('/login')
        .send({
          email: user.email,
          password: 'FOOBARBAZ'
        })
        .then((res) => {
          expect(res.statusCode).toBe(302)
          expect(res.text).toBe('Found. Redirecting to /')
        })
    })
  })
})

