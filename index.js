const config = require('./config/')
const {VoiceRegion, VoiceManager} = require('./structures/Voice')
const {AuthManager} = require('./structures/Auth')
/* GLOBAL SHIT M8 GGEZ */
global.vmgr = new VoiceManager()
global.auth = new AuthManager()

let mongoose = require('mongoose')
mongoose.Promise = global.Promise

const winston = require('winston')
winston.loggers.add('rest', {
  console: {
    level: 'info',
    colorize: true,
    label: 'REST'
  }
})
winston.loggers.add('websocket', {
  console: {
    level: 'info',
    colorize: true,
    label: 'WS'.green
  }
})

async function initialize() {
  let dbConfig = config.database
  let uri = `mongodb://${dbConfig.username}:${dbConfig.password}@${dbConfig.host}:${dbConfig.port}/${dbConfig.database}?authSource=admin`
  try {
    await mongoose.connect(uri)
    console.log('[db] Mongo connected')
  } catch (err) {
    console.error(err)
  }
  if(config.services.api.enabled) {
    winston.loggers.get('rest').info('test rest')
    require('./api/index')
  }

  if(config.services.websocket.enabled) {
    winston.loggers.get('websocket').info('websocket test')
    require('./websocket/index')
  }
  console.log('start')
}
initialize()

