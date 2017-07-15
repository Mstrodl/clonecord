const express = require('express')
const router = express.Router()
const config = require('../../config/')
const bodyparser = require('body-parser')
const {Channel, Guild, Message, User} = require('../../schemas/')
const {Errors, ClonecordError, FieldRequiredError} = require('../errors')

function postReq(fields, callback) {
  return (req, res) => {
    if(!req.body) throw new FieldRequiredError(fields)
    let body = req.body
    let f = []
    for(let key in fields) {
      if(!fields.hasOwnProperty(key)) continue
      let field = fields[key]
      if(!body[field]) f.push(field)
    }
    if(f.length > 0) throw new FieldRequiredError(f)
    callback(req, res)
  }
}

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