/* global describe it expect beforeEach afterEach */

import { Database } from 'db/database'
import { User, Post } from 'models/index'

describe('Database', () => {
  let db
  let user = new User({
    id: '1',
    name: 'Alice',
    email: 'alice@example.com',
    website: 'http://example.com',
    password: 'password',
    role: 'admin'
  })

  let post = new Post({
    id: '1',
    title: 'Title',
    body: 'Body',
    userId: user.id
  })

  beforeEach(() => {
    db = new Database({ users: [user], posts: [post] })
    db.viewer = user
  })

  describe('getUser', () => {
    it('gets the user by ID', () => {
      expect(db.getUser('1')).toEqual(user)
    })
  })

  describe('getPost', () => {
    it('gets the post for a viewer and ID', () => {
      expect(db.getPost('1')).toEqual(post)
    })
  })

  describe('getPosts', () => {
    it('gets a list of posts for a user', () => {
      const expectedPostIds = ['1']
      const postIds = db.getPosts({}).map(s => s.id)

      expect(postIds).toEqual(expectedPostIds)
    })
  })
})
