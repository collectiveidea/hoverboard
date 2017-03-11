import {
  GraphQLBoolean,
  GraphQLInt,
  GraphQLList,
  GraphQLNonNull,
  GraphQLString,
  GraphQLInputObjectType
} from 'graphql'

import {
  fromGlobalId,
  mutationWithClientMutationId
} from 'graphql-relay'

import Database from './database'
import { headlineType, storyType, userType } from './modelTypes'
import {
  createToken,
  createAnonymousToken,
  createAnonymousUser
} from '../authentication'

import Logger from '../utils/logger'

const { updateHeadlines, insertHeadline } = Database

const HeadlineInputType = new GraphQLInputObjectType({
  name: 'HeadlineInput',
  fields: {
    id: { type: new GraphQLNonNull(GraphQLString) },
    text: { type: GraphQLString },
    rank: { type: GraphQLInt },
    storyId: { type: GraphQLString },
    userId: { type: GraphQLString },
    disabled: { type: GraphQLBoolean }
  }
})

const insertHeadlineMutation = mutationWithClientMutationId({
  name: 'InsertHeadline',
  inputFields: {
    storyId: { type: new GraphQLNonNull(GraphQLString) },
    headline: { type: new GraphQLNonNull(HeadlineInputType) }
  },
  outputFields: {
    headline: {
      type: headlineType,
      resolve: (headline) => headline,
    }
  },
  mutateAndGetPayload: (args, context) => {
    const attrs = Object.assign({}, args, { storyId: fromGlobalId(args.storyId).id })

    insertHeadline(attrs)
    return Database.getHeadline(attrs.storyId, context.viewer)
  },
})

const updateHeadlinesMutation = mutationWithClientMutationId({
  name: 'UpdateHeadlines',
  inputFields: {
    storyId: { type: new GraphQLNonNull(GraphQLString) },
    headlines: { type: new GraphQLNonNull(new GraphQLList(HeadlineInputType)) }
  },
  outputFields: {
    story: {
      type: storyType,
      resolve: (story) => story,
    }
  },
  mutateAndGetPayload: (args, context) => {
    const attrs = Object.assign({}, args, { storyId: fromGlobalId(args.storyId).id })

    attrs.headlines = args.headlines.map(
      h => Object.assign({}, h, { id: fromGlobalId(h.id).id })
    )
    updateHeadlines(attrs.headlines, context.user)
    Logger.print('updateHeadlinesMutation.mutateAndGetPayload', args)
    return Database.getStory(attrs.storyId, context.viewer)
  },
})

const loginMutation = mutationWithClientMutationId({
  name: 'Login',
  inputFields: {
    email: {
      type: new GraphQLNonNull(GraphQLString)
    },
    password: {
      type: new GraphQLNonNull(GraphQLString)
    }
  },
  outputFields: {
    viewer: {
      type: userType,
      resolve: (payload) => payload
    }
  },
  mutateAndGetPayload: (args, context) => {
    const user = Database.getUserByCredentials(args)
    if (user) {
      context.session.token = createToken(user) // eslint-disable-line no-param-reassign
      context.user = user // eslint-disable-line no-param-reassign
    }
    Logger.print('loginMutation.mutateAndGetPayload', args, context)
    return user
  }
})

const logoutMutation = mutationWithClientMutationId({
  name: 'Logout',
  inputFields: {
    id: {
      type: new GraphQLNonNull(GraphQLString)
    }
  },
  outputFields: {
    viewer: {
      type: userType,
      resolve: (payload) => payload
    }
  },
  mutateAndGetPayload: (args, context) => {
    const user = createAnonymousUser()
    context.session.token = createAnonymousToken() // eslint-disable-line no-param-reassign
    context.user = user // eslint-disable-line no-param-reassign
    Logger.print('logoutMutation.mutateAndGetPayload', args, context)
    return user
  }
})

export {
  insertHeadlineMutation,
  updateHeadlinesMutation,
  loginMutation,
  logoutMutation
}
