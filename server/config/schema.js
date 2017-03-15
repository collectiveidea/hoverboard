import { GraphQLSchema } from 'graphql'
import queryType from 'server/types/queries/queryType'

export default new GraphQLSchema({
  query: queryType
})
