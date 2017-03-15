/**
 * We get the node interface and field from the Relay library.
 *
 * The first method defines the way we resolve an ID to its object.
 * The second defines the way we resolve an object to its GraphQL type.
 */
import { fromGlobalId, nodeDefinitions } from 'graphql-relay'
import Database from 'db/database'

export const { nodeInterface, nodeField } = nodeDefinitions(
  (globalId, context) => {
    const { type, id } = fromGlobalId(globalId)
    const db = Database.withViewer(context.user)
    if (type === 'User') {
      return db.getUser(id)
    } else if (type === 'Post') {
      return db.getPost(id)
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
