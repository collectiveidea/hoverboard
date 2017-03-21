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
      request(server)
        .get('/graphql?query={}')
        .end((err, res) => {
          Logger.log('Request', res)
          expect(res.statusCode).toBe(200)
          done()
        })
    })
  })
})

