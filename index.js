const config = require('./config/')
const {VoiceRegion, VoiceManager} = require('./structures/Voice')
const {AuthManager} = require('./structures/Auth')
/* GLOBAL SHIT M8 GGEZ */
global.vmgr = new VoiceManager()
global.auth = new AuthManager()

let mongoose = require('mongoose')
mongoose.Promise = global.Promise

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
    require('./api/index')
  }

  if(config.services.websocket.enabled) {
    require('./websocket/index')
  }
  console.log('start')
}
initialize()

