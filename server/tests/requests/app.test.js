/* global describe it expect beforeEach */

import request from 'supertest'

import schema from 'config/schema'
import config from 'config/environment'
import App from 'hoverBoard/app'
import Logger from 'hoverBoard/logger'

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
        .expect(200)
        .end((err, res) => {
          expect(res.statusCode).toBe(500)
          expect(JSON.parse(res.text).data.viewer).toBe(null)
          done()
        })
    })
  })
})

