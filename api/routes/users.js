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
router.route('/@me')
  .get(async (req, res) => {
    let author = req.header('Authorization')
    if(!author ) return res.status(401).json({code: 0, message: '401s: Unauthorized'})
    let id = auth.getTokenUserID(author)
    let user = await User.findOne({id: id})
    if(!user) return res.status(401).json({code: 0, message: '401: Unauthorized'})
    return res.status(200).json(user)
  })

module.exports = router