import {
  globalIdField,
  fromGlobalId,
  connectionArgs,
  connectionDefinitions,
  connectionFromArray,
} from 'graphql-relay'

import {
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLString
} from 'graphql'

import { db } from 'db/database'
import { nodeInterface } from 'types/node/nodeDefinitions'
import postType from 'types/models/postType'
import Logger from 'lib/logger'

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
        return db.withViewer(user).getPost(id)
      }
    },
    posts: {
      type: postConnection, // eslint-disable-line no-use-before-define
      description: 'Posts that I have',
      args: connectionArgs,
      resolve: (user, args) => connectionFromArray(
        db.withViewer(user).getPosts(args),
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

const { connectionType: postConnection } = connectionDefinitions({ name: 'Post', nodeType: postType })

export default userType