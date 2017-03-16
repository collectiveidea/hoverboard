import { GraphQLSchema } from 'graphql'
import queryType from 'types/queries/queryType'

export default new GraphQLSchema({
  query: queryType
})
