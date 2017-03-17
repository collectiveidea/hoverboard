import config from 'config/environment'
import Logger from 'utils/logger'
import { db } from 'db/database'


// Users
const ANONYMOUS_TOKEN_DATA = {
  id: 'anonymous',
  role: config.roles.anonymous,
}

export function createAnonymousUser() {
  // For now, because Chrome sucks, just use jstokes:
  return Database.getUser('1')
  // return new User(
  //   ANONYMOUS_TOKEN_DATA.id,
  //   '',
  //   '',
  //   '',
  //   '',
  //   ANONYMOUS_TOKEN_DATA.role
  // )
}

export function decodeToken(token) {
  return jwt.verify(token, config.secret)
}

function findUserFromTokenData(tokenData) {
  return new Promise((resolve) => {
    let user

    if (tokenData.id === 'anonymous') {
      user = createAnonymousUser()
    } else {
      user = Database.getUser(tokenData.id)
    }
    Logger.print('findUserFromTokenData', tokenData, user)
    resolve(user)
  })
}

function loadSessionData(req) {
  let sessionData
  if (req.session && req.session.token) {
    sessionData = new Promise((resolve) => {
      let tokenData = null
      try {
        tokenData = decodeToken(req.session.token)
      } catch (err) {
        Logger.print(err)
      }
      Logger.print('loadSessionData', req.session, tokenData)
      resolve(tokenData)
    })
  } else {
    sessionData = new Promise((resolve) => {
      Logger.print('loadSessionData', req.session)
      resolve(null)
    })
  }
  return sessionData
}

export function hasAuthorization(actualRole, expectedRole, next) {
  if (actualRole === expectedRole) {
    return next()
  } else { // eslint-disable-line no-else-return
    return () => null
  }
}

// Tokens
export function createToken(userData) {
  let token

  if (userData && userData.id) {
    const { id, role } = userData
    token = jwt.sign({ id, role }, config.secret)
  } else {
    token = jwt.sign(ANONYMOUS_TOKEN_DATA, config.secret)
  }
  Logger.print('createToken', userData, token)
  return token
}

export function createAnonymousToken() {
  return createToken()
}

export function authenticateUser(req, res, next) {
  Logger.print('authenticateUser', req.session)
  loadSessionData(req).then(tokenData => {
    if (!tokenData) {
      req.user = createAnonymousUser() // eslint-disable-line no-param-reassign
      req.session.token = createAnonymousToken() // eslint-disable-line no-param-reassign
      next()
    } else {
      findUserFromTokenData(tokenData).then(user => {
        if (!user) {
          res.sendStatus(404)
        } else {
          req.user = user // eslint-disable-line no-param-reassign
        }
        next()
      })
    }
  }).catch((err) => {
    Logger.print('authenticateUser Error', req.session, err)
    res.sendStatus(400)
  })
}
