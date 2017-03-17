import chalk from 'chalk'
import express from 'express'
import graphQLHTTP from 'express-graphql'
import cookieSession from 'cookie-session'
import Logger from './lib/logger'
import schema from './schema'
import { authenticateUser } from './lib/authentication'
import bodyParser from 'body-parser'

export default function createGraphQlServer(config) {
  // Expose a GraphQL endpoint
  const graphql = express()

  graphql.use(cookieSession({
    name: 'maxclicky_session',
    keys: ['id', 'token']
  }))

  graphql.use(bodyParser.json()) // for parsing application/json
  graphql.use(bodyParser.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded

  graphql.use('/', authenticateUser, graphQLHTTP((req) => {
    const { user, session, body, method, originalUrl } = req
    Logger.print(`graphQLHTTP ${method} ${originalUrl}`, body.query, user)
    return {
      graphiql: true,
      pretty: true,
      schema,
      context: { user, session }
    }
  }
  ))

  return graphql.listen(
    config.graphql.port,
    () => console.log(chalk.green(`GraphQL is listening on port ${config.graphql.port}`)) // eslint-disable-line no-console
  )
}
