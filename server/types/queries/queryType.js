/* eslint-disable no-unused-vars, no-use-before-define */
const GraphQLObjectType = require('graphql').GraphQLObjectType
const Logger = require.main.require('../hoverBoard/logger.js')
const userType = require.main.require('../server/types/index').userType
const nodeField = require.main.require('../server/types/index').nodeField

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

module.exports = queryType