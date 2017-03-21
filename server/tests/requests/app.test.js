/* global describe it expect beforeEach */

import schema from 'config/schema'
import config from 'config/environment'
import App from 'hoverBoard/app'
import request from 'supertest'

describe('App', () => {
  let relayServer
  let graphQLServer

  beforeEach(() => {
    const app = new App(config)
    graphQLServer = app.graphQL.server
    relayServer = app.relay.server.app
  })

  describe('GraphQL Server', () => {
    it('responds to /', (done) => {
      request(graphQLServer)
        .get('/')
        .expect(200, done);
    })

    it('404 everything else', (done) => {
      request(graphQLServer)
        .get('/foo/bar')
        .expect(404, done);
    })
  })

  describe('Relay Server', () => {
    it('responds to /', (done) => {
      request(relayServer)
        .get('/')
        .expect(200, done);
    })

    it('404 everything else', (done) => {
      request(relayServer)
        .get('/foo/bar')
        .expect(404, done);
    })
  })
})

