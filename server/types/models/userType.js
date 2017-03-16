import {
  globalIdField,
  connectionArgs,
  connectionDefinitions
} from 'graphql-relay'

import {
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLString
} from 'graphql'

import postType from 'types/models/postType'
import { nodeInterface } from 'types/node/nodeDefinitions'

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

const { connectionType: postConnection } = connectionDefinitions({ name: 'Post', nodeType: postType })

export default userType