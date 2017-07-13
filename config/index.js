const defaults = require('./config.default.json'),
      path = require('path'),
      fs = require('fs')
var env = process.env.NODE_ENV,
    config = {}

if(env && env.endsWith(' '))
  env = env.substr(0, env.length - 1) // Removes blank space at the end of an environment string

if(env && fs.existsSync(path.join(__dirname, `config.${env.toString()}.json`))) {
  config = require(`./config.${env.toString()}.json`)
} else {
  if(env == 'prod' || env == 'production' || !env) {
    if(fs.existsSync(path.join(__dirname, 'config.json'))) {
      config = require('./config.json')
    }  
  }
}

config = require('../utilities').mergeDeep(defaults, config)
config.env = env || 'production'

module.exports = config