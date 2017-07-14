const express = require('express')
const router = express.Router()
const config = require('../../config/')
const wscfg = config.services.websocket

router.route('/gateway')
  .get((req, res) => {
    return res.status(200).json({
      url: `ws://${wscfg.route || wscfg.host}:${wscfg.port}`
    })
  })
module.exports = router