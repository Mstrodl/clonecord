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
  tokenValid(token, id) {
    try {
      let decoded = jwt.verify(token, key)
      let seed = seedrandom(`${id}.${config.env.startsWith('prod') ? 'prd' : 'dev'}.${r1}`, {global: false})
      if((r2 == Math.floor(seed() * 100) + 1) && id == decoded.id) {
        return true
      } else {
        return false
      }
    } catch(err) {
      console.error(err)
      return false
    }
  }
  async getDiscrim(username) {
    let rdm = randomInt(1, 9999)
    let discrim = pad(rdm)
    let users = await User.find({discrim: discrim})
    for(let key in users) {
      if(!users.hasOwnProperty(key)) continue
      let user = users[key]
      if(user.username = username) {
        return await getDiscrim(username)
      }
    }
    return discrim
  }
  newSnowflake() {
    return genSnowflake()
  }
}

module.exports = {
  AuthManager: AuthManager
}