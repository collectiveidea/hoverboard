/**
 * We get the node interface and field from the Relay library.
 *
 * The first method defines the way we resolve an ID to its object.
 * The second defines the way we resolve an object to its GraphQL type.
 */
import { fromGlobalId, nodeDefinitions } from 'graphql-relay'
import { db } from 'db/database'

export const { nodeInterface, nodeField } = nodeDefinitions(
  (globalId, context) => {
    const { type, id } = fromGlobalId(globalId)
    if (type === 'User') {
      return db.withViewer(context.user).getUser(id)
    } else if (type === 'Post') {
      return db.withViewer(context.user).getPost(id)
    }
    return null
  },
  (obj) => {
    if (obj instanceof User) {
      return userType // eslint-disable-line no-use-before-define
    } else if (obj instanceof Post) {
      return postType // eslint-disable-line no-use-before-define
    }
    return null
  }
)
