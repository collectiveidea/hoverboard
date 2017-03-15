/* global describe it expect */

import { graphql } from 'graphql'
import schema from 'config/schema'
import Database from 'db/database'
import { toGlobalId } from 'graphql-relay'

describe('GraphQL', () => {
  describe('UserType', () => {
    it('should be null when user is not logged in', async () => {
      const query = `
        query {
          viewer {
            id
            name
          }
        }
      `

      const rootValue = {}
      const context = {}

      const result = await graphql(schema, query, rootValue, context)
      const { data } = result

      expect(data.viewer).toBe(null)
    })

    it('should return the current user when user is logged in', async () => {
      const user = Database.getUser('1')

      const query = `
        query {
          viewer {
            id
            name
            email
            role
            website
            posts {
              edges {
                node {
                  title
                }
              }
            }
          }
        }
      `

      const rootValue = {}
      const context = { user }

      const result = await graphql(schema, query, rootValue, context)
      const { data } = result

      expect(data.viewer.name).toBe(user.name)
      expect(data.viewer.email).toBe(user.email)
      expect(data.viewer.role).toBe(user.role)
      expect(data.viewer.website).toBe(user.website)
      expect(data.viewer.posts.edges.length).toBe(4)
    })
  })

  describe('PostType', () => {
    const user = Database.getUser('1')

    it('returns the correct post associated with a user ', async () => {
      const postId = toGlobalId('Post', '1')

      const variables = { postId }
      const query = `
        query($postId: String!) {
          viewer {
            post(id: $postId) {
              id
            }
          }
        }
      `

      const rootValue = {}
      const context = { user }

      const result = await graphql(schema, query, rootValue, context, variables)
      const { data } = result

      expect(data.viewer.post.id).toBe(postId)
    })
  })
})
