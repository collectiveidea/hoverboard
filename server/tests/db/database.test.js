/* global describe it expect beforeEach */

import Database from 'db/database'
import { User, Post } from 'models/index'

describe('Database', () => {
  const viewer = Database.getUser('1')
  const db = Database.withViewer(viewer)

  beforeEach(() => {
    Database.reset()
  })

  describe('getUser', () => {
    it('gets the user by ID', () => {
      const user = db.getUser('1')

      expect(user.id).toBe('1')
      expect(user.email).toBe('jon@collectiveidea.com')
    })
  })

  describe('getPost', () => {
    it('gets the post for a viewer and ID', () => {
      const post = db.getPost('1')
      const expectedPost = {
        id: '1',
        userId: db.viewer.id,
        title: 'This is a taco post',
        body: 'Mmmm... tacos.'
      }

      expect(post).toEqual(expectedPost)
    })
  })

  describe('getPosts', () => {
    it('gets a list of posts for a user', () => {
      const expectedPostIds = ['1', '2',]
      const postIds = db.getPosts({}).map(s => s.id)

      expect(postIds).toEqual(expectedPostIds)
    })
  })
})
