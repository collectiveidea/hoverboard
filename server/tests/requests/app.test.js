/* global describe it expect beforeEach */

import schema from 'config/schema'
import config from 'config/environment'
import App from 'hoverBoard/app'
import request from 'supertest'

describe('App', () => {
  let server

  beforeEach(() => {
    const app = new App(config)
    server = app.relay.server
  })

  describe('GraphQL Server', () => {
    it('responds to /', (done) => {
      request(server)
        .get('/')
        .expect(200, done);
    })

    it('responds to /graphql', (done) => {
      request(server)
        .get('/')
        .expect(200, done);
    })

    it('404 everything else', (done) => {
      request(server)
        .get('/foo/bar')
        .expect(404, done);
    })
  })
})

