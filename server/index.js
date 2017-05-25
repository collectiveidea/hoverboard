/* eslint-disable no-console, no-shadow */

const config = require.main.require('../server/config/environment/index')
const schema = require.main.require('../server/config/schema')
let App = require.main.require('../hoverBoard/app')
const _ = require('lodash')

const app = new App(_.extend(config, { schema }))

app.listen()