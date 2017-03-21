/* global describe it expect beforeEach */

import schema from 'config/schema'
import config from 'config/environment'
import App from 'hoverBoard/app'
import request from 'supertest'

describe('App', () => {
  let server

  beforeEach(() => {
    const app = new App(config)
    server = app.listen()
  })

  afterEach((done) => {
    server.close(done)
  })

  describe('Routes', () => {
    it('responds to /', (done) => {
      request(server)
        .get('/')
        .expect(200, done)
    })

    it('responds to /graphql', (done) => {
      request(server)
        .get('/')
        .expect(200, done)
    })

    it('responds to /login', (done) => {
      request(server)
        .post('/foo/bar/baz')
        .expect(200, done)
    })

    it('404 everything else', (done) => {
      request(server)
        .get('/foo/bar')
        .expect(200)
        .expect(404, done)
    })
  })
})

