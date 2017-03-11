/* eslint-disable no-unused-vars, no-use-before-define */
import {
  GraphQLBoolean,
  GraphQLFloat,
  GraphQLID,
  GraphQLInt,
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLString
} from 'graphql'

import Database from './database'

import {
  userType,
  postType,
  nodeField
} from './modelTypes'

import {
  fromGlobalId
} from 'graphql-relay'

import {
  updateHeadlineMutation,
  updateHeadlinesMutation,
  insertHeadlineMutation,
  loginMutation,
  logoutMutation
} from './mutations'

import Logger from '../utils/logger'

/**
 * This is the type that will be the root of our query,
 * and the entry point into our schema.
 */
const queryType = new GraphQLObjectType({
  name: 'Query',
  fields: () => ({
    node: nodeField,
    // Add your own root fields here
    viewer: {
      type: userType,
      resolve: (parentNode, args, context) => {
        Logger.print('queryType.viewer.resolve', { args, context })
        return context.user
      }
    }
  })
})

/**
 * This is the type that will be the root of our mutations,
 * and the entry point into performing writes in our schema.
 */
const mutationType = new GraphQLObjectType({
  name: 'Mutation',
  fields: () => ({
    updateHeadlines: updateHeadlinesMutation,
    insertHeadline: insertHeadlineMutation,
    login: loginMutation,
    logout: logoutMutation
  }),
})

/**
 * Finally, we construct our schema (whose starting query type is the query
 * type we defined above) and export it.
 */
export default new GraphQLSchema({
  query: queryType,
  mutation: mutationType
})
