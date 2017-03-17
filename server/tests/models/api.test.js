/* global describe it expect beforeEach */

import { Api } from 'models'

describe('Api', () => {
  describe('constructor', () => {
    it('accepts the correct args', () => {
      const post = new Post({
        id: '1',
        title: 'Title',
        body: 'Body',
        userId: '2'
      })

      expect(post.id).toBe('1')
      expect(post.title).toBe('Title')
      expect(post.body).toBe('Body')
      expect(post.userId).toBe('2')
    })
  })
})
