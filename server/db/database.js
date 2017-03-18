import Logger from 'hoverBoard/logger'
import User   from 'models/user'
import Post   from 'models/post'

import {
  usersList,
  postsList
} from 'db/seeds'

class Database {
  constructor({ users, posts }) {
    this.usersList = users
    this.postsList = posts

    this.getUser = this.getUser.bind(this)
    this.getPost = this.getPost.bind(this)
    this.getPosts = this.getPosts.bind(this)

    this.viewer = null
    this.withViewer = this.withViewer.bind(this)

    this.reset = this.reset.bind(this)
  }

  reset() {
    this.usersList = usersList()
    this.postsList = postsList()
  }

  // Queries

  getUser(id) {
    const user = this.usersList.find(u => u.id === id)
    Logger.log('Database.getUser', id, user)
    return user
  }

  getUserByCredentials(creds) {
    // TODO: Match password
    const { email } = creds
    const user = this.usersList.find(u => u.email === email)
    Logger.log('getUserByCredentials', creds, user)
    return user
  }

  getPost(id) {
    const post = this.postsList.find(s => s.id === id)
    Logger.log('Database.getPost', id, post)
    return post
  }

  getPosts(args, filterFunction) {
    const userPosts = this.postsList.filter(s => (s.userId === this.viewer.id))
    const posts = this.getFromList(userPosts, args, filterFunction)
    Logger.log('Database.getPosts', args, posts)
    return posts
  }

  // Mutations
  updatePost(postId, newAttrs, rank) {
    return postId
  }

  insertHeadline(postAttrs) {
    return postAttrs
  }

  withViewer(newViewer) {
    this.viewer = newViewer
    return this
  }

  getFromList(list, { first, after, last, before, limit }, filterFunction = () => true) {
    if (first) {
      return list.filter(filterFunction).slice(0, first)
    } else if (last) {
      return list.filter(filterFunction).slice(-last)
    } else if (after) {
      return list.filter(filterFunction).slice(after + 1, list.length)
    } else if (before) {
      return list.filter(filterFunction).slice(0, before)
    }
    return list.filter(filterFunction)
  }
}

// Make a seeded db available for export
const db = new Database({ users: usersList(), posts: postsList() })

export {
  db,
  Database
}