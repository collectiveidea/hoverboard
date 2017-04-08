/* global describe it expect beforeEach */

import request from 'supertest'

import schema from 'config/schema'
import config from 'config/environment'
import App from 'hoverBoard/app'
import Logger from 'hoverBoard/logger'
import { db } from 'db/database'

describe('App', () => {
  let server

  beforeEach(() => {
    const app = new App(config)
    server = app.relay.server
  })

  describe('Routes', () => {
    it('responds to /graphql', (done) => {
      const query = `
        query {
          viewer {
            id
            name
          }
        }
      `

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
          password: user.password
        })
        .expect(200)
        .then((data) => {
          expect(data.body.token).toBe('foobar')
        })
    })

  })
})

