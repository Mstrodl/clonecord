const express = require('express')
const router = express.Router()
const config = require('../../config/')
const bodyparser = require('body-parser')

router.use(bodyparser.json())
router.route('/login')
  .post((req, res) => {
    i
  })

module.exports = router