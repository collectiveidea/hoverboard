import { globalIdField } from 'graphql-relay'
import { GraphQLObjectType, GraphQLString } from 'graphql'
import { nodeInterface } from 'types/node/nodeDefinitions'

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

export default postType
