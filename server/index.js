/* eslint-disable no-console, no-shadow */
import config from 'config/environment'
import createGraphQlServer from 'config/graphQlServer'
//import createRelayServer from 'config/relayServer'

if (config.env === 'development') {
  createGraphQlServer(config)
  //createRelayServer(config)
} else if (config.env === 'production') {
  createRelayServer(config)
}
