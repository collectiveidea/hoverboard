import express from 'express'
import session from 'express-session'
import bodyParser from 'body-parser'
import passport from 'passport'
import { Strategy } from 'passport-local'
import request from 'supertest'

const user = { username: 'jon', password: 'foobarbaz', id: '1' }
const app = express()

app.use(express.static('build'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(session({
  secret: 'foobarbaz'
}))
app.use(passport.initialize())
app.use(passport.session())

app.use('/login',
  passport.authenticate('local', { successRedirect: '/',
                                   failureRedirect: '/login'})
)

passport.use(new Strategy(
  function(username, password, done) {
    // Just pass through the default user every time
    return done(null, user)
  }
))

passport.serializeUser((user, done) => {
  return done(null, user.id)
})

passport.deserializeUser((id, done) => {
  // Just pass through the default user every time
  return done(null, user)
})

app.get('/', function (req, res) {
  // Emit the user and session as a JSON response
  res.send({ user: req.user, session: req.session })
})

describe('App', () => {
  describe('Authenticated access', () => {
    const agent = request.agent(app)

    it('should log in a user', (done) => {
      request(app)
        .post('/login')
        .send(user)
        .end((err, res) => {
          expect(res.statusCode).toBe(302)
          expect(res.text).toBe('Found. Redirecting to /')
          done()
        })
    })

    it ('should persist a logged in user in the session', (done) => {
      agent
        .post('/login')
        .send(user)
        .end((err, res) => { console.log(JSON.stringify(res)) })

      agent
        .get('/')
        .end((err, res) => {
          expect(res.statusCode).toBe(200)
          expect(JSON.parse(res.text).session).not.toBe(null)
          expect(JSON.parse(res.text).user).not.toBe(undefined)
          done()
        })
    })
  })
})









