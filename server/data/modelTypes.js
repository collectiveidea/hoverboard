import {
  connectionArgs,
  connectionDefinitions,
  connectionFromArray,
  fromGlobalId,
  globalIdField,
  nodeDefinitions
} from 'graphql-relay'

import {
  GraphQLBoolean,
  GraphQLInt,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLString
} from 'graphql'

import Database from './database'

import {
  User,
  Story,
  Headline
} from './models'

/**
 * We get the node interface and field from the Relay library.
 *
 * The first method defines the way we resolve an ID to its object.
 * The second defines the way we resolve an object to its GraphQL type.
 */
const { nodeInterface, nodeField } = nodeDefinitions(
  (globalId, context) => {
    const { type, id } = fromGlobalId(globalId)
    const db = Database.withViewer(context.user)
    if (type === 'User') {
      return db.getUser(id)
    } else if (type === 'Story') {
      return db.getStory(id)
    } else if (type === 'Headline') {
      return db.getHeadline(id)
    }
    return null
  },
  (obj) => {
    if (obj instanceof User) {
      return userType // eslint-disable-line no-use-before-define
    } else if (obj instanceof Story) {
      return storyType // eslint-disable-line no-use-before-define
    } else if (obj instanceof Headline) {
      return headlineType // eslint-disable-line no-use-before-define
    }
    return null
  }
)

// Type Definitions

const storyType = new GraphQLObjectType({
  name: 'Story',
  description: 'A story that is having its headlines voted on.',
  fields: () => ({
    id: globalIdField('Story'),
    headlines: {
      type: headlineConnection, // eslint-disable-line no-use-before-define
      description: 'All the headline options',
      args: connectionArgs,
      resolve: (story, args, context) =>
        connectionFromArray(
          Database.withViewer(context.user).getHeadlines(args, story), args
        )
    },
    url: {
      type: GraphQLString,
      description: 'Url of the story'
    },
    focusKeyword: {
      type: GraphQLString,
      description: 'The SEO focus keyword'
    },
    archived: {
      type: GraphQLBoolean,
      description: 'True of the story is archived, false if it\'s live'
    },
    started: {
      type: GraphQLBoolean,
      description: 'True of the story is started, false if it\'s stopped'
    },
    userId: {
      type: GraphQLString,
      description: 'ID of the story\'s user'
    }
  }),
  interfaces: [nodeInterface]
})

const userType = new GraphQLObjectType({
  name: 'User',
  description: 'A person who uses our app',
  fields: () => ({
    id: globalIdField('User'),
    story: {
      type: storyType,
      description: 'A story of mine.',
      args: {
        id: { type: new GraphQLNonNull(GraphQLString) }
      },
      resolve: (user, args) => {
        const id = fromGlobalId(args.id).id
        return Database.withViewer(user).getStory(id)
      }
    },
    stories: {
      type: storyConnection, // eslint-disable-line no-use-before-define
      description: 'Unarchived stories that I have',
      args: connectionArgs,
      resolve: (user, args) => connectionFromArray(
        Database.withViewer(user).getStories(args, s => !s.archived),
        args
      )
    },
    archivedStories: {
      type: storyConnection, // eslint-disable-line no-use-before-define
      description: 'Archived stories that I have',
      args: connectionArgs,
      resolve: (user, args) => connectionFromArray(
        Database.withViewer(user).getStories(args, s => s.archived),
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

const headlineType = new GraphQLObjectType({
  name: 'Headline',
  description: 'A headline option for a story.',
  fields: () => ({
    id: globalIdField('Headline'),
    text: {
      type: GraphQLString,
      description: 'The headline\'s text.'
    },
    rank: {
      type: GraphQLInt,
      description: 'Current rank of story in voting',
    },
    storyId: {
      type: GraphQLString,
      description: 'The id of the parent story'
    },
    userId: {
      type: GraphQLString,
      description: 'The id of the user who created this headline'
    },
    disabled: {
      type: GraphQLBoolean,
      description: 'Disabled flag.'
    }
  }),
  interfaces: [nodeInterface]
})

/**
 * Define your own connection types here
 */
const { connectionType: storyConnection } = connectionDefinitions({ name: 'Story', nodeType: storyType })
const { connectionType: headlineConnection } = connectionDefinitions({ name: 'Headline', nodeType: headlineType })

export {
  nodeInterface,
  nodeField,
  userType,
  storyType,
  headlineType
}
