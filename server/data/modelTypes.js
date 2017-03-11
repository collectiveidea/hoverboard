import {
  connectionArgs,
  connectionDefinitions,
  connectionFromArray,
  fromGlobalId,
  globalIdField,
  nodeDefinitions
} from 'graphql-relay'

import {
  GraphQLBoolean,
  GraphQLInt,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLString
} from 'graphql'

import Database from './database'

import {
  User,
  Post,
} from './models'

/**
 * We get the node interface and field from the Relay library.
 *
 * The first method defines the way we resolve an ID to its object.
 * The second defines the way we resolve an object to its GraphQL type.
 */
const { nodeInterface, nodeField } = nodeDefinitions(
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

// Type Definitions

const postType = new GraphQLObjectType({
  name: 'Post',
  description: 'A post.',
  fields: () => ({
    id: globalIdField('Post'),
    title: {
      type: GraphQLString,
      description: 'Title of the post'
    },
    body: {
      type: GraphQLString,
      description: 'Body of the post'
    },
    userId: {
      type: GraphQLString,
      description: 'ID of the post\'s user'
    }
  }),
  interfaces: [nodeInterface]
})

const userType = new GraphQLObjectType({
  name: 'User',
  description: 'A person who uses our app',
  fields: () => ({
    id: globalIdField('User'),
    post: {
      type: postType,
      description: 'A post of mine.',
      args: {
        id: { type: new GraphQLNonNull(GraphQLString) }
      },
      resolve: (user, args) => {
        const id = fromGlobalId(args.id).id
        return Database.withViewer(user).getPost(id)
      }
    },
    posts: {
      type: postConnection, // eslint-disable-line no-use-before-define
      description: 'Unarchived posts that I have',
      args: connectionArgs,
      resolve: (user, args) => connectionFromArray(
        Database.withViewer(user).getStories(args, s => !s.archived),
        args
      )
    },
    email: {
      type: GraphQLString,
      description: 'Users\'s email'
    },
    name: {
      type: GraphQLString,
      description: 'Users\'s name'
    },
    role: {
      type: GraphQLString,
      description: 'Users\'s role'
    },
    website: {
      type: GraphQLString,
      description: 'User\'s website'
    }
  }),
  interfaces: [nodeInterface]
})

/**
 * Define your own connection types here
 */
const { connectionType: postConnection } = connectionDefinitions({ name: 'Post', nodeType: postType })

export {
  nodeInterface,
  nodeField,
  userType,
  postType
}
