/* global describe it expect */

import { graphql } from 'graphql'
import { toGlobalId } from 'graphql-relay'
import schema from 'config/schema'
import { db } from 'db/database'

describe('PostType', () => {
  const user = db.getUser('1')

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

