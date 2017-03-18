/* eslint-disable no-console, no-shadow */
import config from 'config/environment'
import schema from 'config/schema'
import _ from 'lodash'
import Api from 'models/api'

const api = new Api(_.extend(config, { schema }))

api.listen()