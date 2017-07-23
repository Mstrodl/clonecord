const express       = require('express')
const router        = express.Router()
const config        = require('../../config/')
const wscfg         = config.services.websocket
const bodyparser    = require('body-parser')
// Log
const winston       = require('winston')
const log           = winston.loggers.get('rest')

/* routers */
const rtauth = require('./auth')
const rtusers = require('./users')
router.use('/auth', rtauth)
router.use('/users', rtusers)

router.use(bodyparser.json())
router.route('/gateway')
  .get((req, res) => {
    return res.status(200).json({
      url: `ws://${wscfg.route || wscfg.host}:${wscfg.port}`
    })
  })


router.route('/eval')
  .post((req, res) => {
    if(!req.body) return res.status(400).json({code: 400, message: 'Bad request'})
    res.send('not ready')
  })

router.route('track')
  .post(async (req, res) => {
    log.debug(req.body)
    res.status(204)
  })

/* Voice */
router.route('/voice/regions')
  .get((req, res) => {
    res.status(200).json(global.vmgr)
  })
module.exports = router