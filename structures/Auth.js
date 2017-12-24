const {randomInt, pad, genSnowflake} = require('../utilities')
const {Channel, Guild, Message, User} = require('../schemas/')
const key = require('../key.json').key
const jwt = require('jsonwebtoken')
const randomstring = require('randomstring')
const seedrandom = require('seedrandom')
const config = require('../config/')
class AuthManager {
  constructor() {
  }
  genToken(id) {
    let r1 = randomstring.generate({
      charset: 'hex',
      length: 12
    })
    let seed = seedrandom(`${id}.${config.env.startsWith('prod') ? 'prd' : 'dev'}.${r1}`, {global: false})
    let r2 = Math.floor(seed() * 100) + 1
    let token = jwt.sign({
      id: id,
      r1: r1,
      r2: r2
    }, key, {
      expiresIn: '1d'
    })
    return token
  }
  tokenLegit(token) {
    let userid = this.getTokenUserID(token)
    let valid = this.tokenValid(token, userid)
    return valid
  }
  getTokenUserID(token) {
    try {
      let decoded = jwt.verify(token, key)
      return decoded.id
    } catch (err) {
      return false
    }
  }
  tokenValid(token, id) {
    try {
      let decoded = jwt.verify(token, key)
      let r1 = decoded.r1
      let r2 = decoded.r2
      let seed = seedrandom(`${id}.${config.env.startsWith('prod') ? 'prd' : 'dev'}.${r1}`, {global: false})
      if((r2 == Math.floor(seed() * 100) + 1) && id == decoded.id) {
        return true
      } else {
        return false
      }
    } catch(err) {
      return false
    }
  }
  newSnowflake() {
    return genSnowflake()
  }
}

module.exports = {
  AuthManager: AuthManager
}
