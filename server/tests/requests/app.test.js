/* global describe it expect beforeEach */

import request from 'supertest'

import schema from 'config/schema'
import config from 'config/environment'
import App from 'hoverBoard/app'
import Logger from 'hoverBoard/logger'
import { db } from 'db/database'

describe('App', () => {
  const server = (new App(config)).relay.server
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
          expect(res.statusCode).toBe(302)
          done()
        })
    })
  })

  describe('Authenticated access', () => {
    const agent = request.agent(server)

    it('should log in a user', (done) => {
      agent
        .post('/login')
        .send(user)
        .end((err, res) => {
          expect(res.statusCode).toBe(302)
          expect(res.text).toBe('Found. Redirecting to /')
          done()
        })
    })

    it('should persist a user session', (done) => {
      agent
        .get('/graphql')
        .query({ query: query })
        .end((err, res) => {
          const viewer = JSON.parse(res.text).data.viewer

          expect(res.statusCode).toBe(200)
          expect(viewer.id).not.toBe(null)
          expect(viewer.name).toBe(user.name)
          done()
        })
    })
  })
})

