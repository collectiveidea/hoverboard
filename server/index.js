/* eslint-disable no-console, no-shadow */
import config from 'config/environment'
import schema from 'config/schema'
import _ from 'lodash'
import App from 'hoverBoard/app'

const app = new App(_.extend(config, { schema }))

app.listen()