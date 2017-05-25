/* eslint-disable global-require */

const GraphQLSchema = require('graphql').GraphQLSchema
const queryType = require.main.require('../server/types/queries/queryType')

module.exports = new GraphQLSchema({
  query: queryType
})
