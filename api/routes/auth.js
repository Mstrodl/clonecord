const express     = require('express')
const router      = express.Router()
const config      = require('../../config/')
const bodyparser  = require('body-parser')
const {postReq}   = require('../reqs')
const bcrypt      = require('bcryptjs')
// Log
const winston     = require('winston')
const log         = winston.loggers.get('rest')
// Schemas
const {Channel, Guild, Message, User} = require('../../schemas/')

const {DoesntExistError, FieldError} = require('../errors')

router.use(bodyparser.json())
router.route('/login')
  .post(postReq(['email', 'password'], async (req, res) => {
    let email = req.body.email
    let password = req.body.password

    let user = await User.findOne({ email })
    if(!user) throw new DoesntExistError(['email'])
    let userhash = user.password.hash
    let usersalt = user.password.salt
    let match = await bcrypt.compare(password, userhash)
    if(match) {
      res.status(200).json({
        token: auth.genToken(user.id)
      })
    } else {
      throw new FieldError('password', 'does not match')
    }
  }))

router.route('/register')
  .post(postReq(['email', 'password', 'username'], async(req, res) => {
    let email = req.body.email
    let password = req.body.password
    let username = req.body.username
    let exists = await User.findOne({email: email})
    if(exists) throw new FieldError('email', 'is already registered')
    let salt = await bcrypt.genSalt()
    let hash = await bcrypt.hash(password, salt)
    let snowflake = auth.newSnowflake()
    let discrim = await auth.getDiscrim(username)
    let newuser = new User({
      id: snowflake,
      discriminator: discrim,
      username: username,
      password: {
        hash: hash,
        salt: salt
      },
      email: email,
      verified: true,
      bot: false
    })
    newuser.save()
    res.status(201).json({
      token: auth.genToken(snowflake)
    })
  }))

module.exports = router