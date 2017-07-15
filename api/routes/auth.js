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


router.use(bodyparser.json())
router.route('/login')
  .post(postReq(['email', 'password'], (req, res) => {
    let body = req.body
    let chan = new Channel({
    oof: true,
    benis: "69696",
    id: blah
})
chan.save()
    res.json(body)
  }))

module.exports = router