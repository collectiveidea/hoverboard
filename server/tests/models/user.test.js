/* global describe it expect beforeEach */

import { User } from 'models/index'

describe('User', () => {
  describe('constructor', () => {
    it('accepts the correct args', () => {
      const user = new User({
        id: '1',
        name: 'Alice',
        email: 'alice@example.com',
        website: 'http://foo.com/',
        password: 'password',
        role: 'admin'
      })

      expect(user.id).toBe('1')
      expect(user.name).toBe('Alice')
      expect(user.email).toBe('alice@example.com')
      expect(user.website).toBe('http://foo.com/')
      expect(user.password).toBe('password')
      expect(user.role).toBe('admin')
    })
  })
})
