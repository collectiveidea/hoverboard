/* global describe it expect */

import { graphql } from 'graphql'
import { toGlobalId } from 'graphql-relay'
import schema from 'config/schema'
import { db } from 'db/database'

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
    const user = db.getUser('1')

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
    expect(data.viewer.posts.edges.length).toBe(2)
  })
})
