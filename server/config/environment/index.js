/* eslint-disable global-require */
import _ from 'lodash'

const config = {
  env: process.env.NODE_ENV || 'development',
  port: process.env.PORT || 3000,
  graphQLPort: 8000,
  graphQLEndpoint: '/graphql',
  graphql: {
    graphiql: true,
    pretty: true
  }
  secret: 'server_secret',
  roles: {
    anonymous: 'anonymous',
    reader: 'user',
    publisher: 'publisher',
    admin: 'admin'
  },
  errors: {
    EmailAlreadyTaken: 'User with email already exists',
    WrongEmailOrPassword: 'Wrong email or password'
  }
}

export default _.extend(config, require(`./${config.env}`).default) // eslint-disable-line

