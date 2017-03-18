/* eslint-disable no-unused-vars, no-use-before-define */
import { GraphQLObjectType } from 'graphql'
import { userType, nodeField } from 'types/index'
import Logger from 'hoverBoard/logger'

/**
 * This is the type that will be the root of our query,
 * and the entry point into our schema.
 */
const queryType = new GraphQLObjectType({
  name: 'Query',
  fields: () => ({
    node: nodeField,
    viewer: {
      type: userType,
      resolve: (parentNode, args, context) => {
        Logger.print('queryType.viewer.resolve', { args, context })
        return context.user
      }
    }
  })
})

export default queryType