const express     = require('express')
const router      = express.Router()
const config      = require('../../config/')
const bodyparser  = require('body-parser')
const {postReq}   = require('../reqs')

// Log
const winston     = require('winston')
const log         = winston.loggers.get('rest')
// Schemas
const {Channel, Guild, Message, User} = require('../../schemas/')

const {DoesntExistError} = require('../errors')

router.use(bodyparser.json())
router.route('/login')
  .post(postReq(['email', 'password'], async (req, res) => {
    let email = req.body.email
    let password = req.body.password

    let user = await User.findOne({ email })
    if(!user) throw new DoesntExistError(['email'])
    res.json(email)
  }))

module.exports = router