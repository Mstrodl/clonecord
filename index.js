const mongoose = require('mongoose')
const config = require('./config/')
const winston = require('winston')
require('./log') // Setup winston loggers

/* Managers */
const { VoiceRegion, VoiceManager } = require('./structures/Voice')
const { AuthManager } = require('./structures/Auth')

/* Global Objects (probably not good) */
// TODO: Don't use global objects
global.vmgr = new VoiceManager()
global.auth = new AuthManager()

/* Module Configuration */
mongoose.Promise = global.Promise

const log = winston.loggers.get('main')

async function initialize() {
  try {
    let dbConfig = config.database
    let uri = `mongodb://${dbConfig.username}:${dbConfig.password}@${dbConfig.host}:${dbConfig.port}/${dbConfig.database}?authSource=admin`
    try {
      await mongoose.connect(uri)
      winston.loggers.get('database').info('Connected with MongoDB')
    } catch (err) {
      winston.loggers.get('database').error('Failed to connect to MongoDB', err)
      process.exit(1)
    }
    if (config.services.api.enabled) {
      require('./api/index')
    }

    if (config.services.websocket.enabled) {
      require('./websocket/index')
    }
  } catch (err) {
    log.error('Failed to initialize', err)
  }
}
initialize()

