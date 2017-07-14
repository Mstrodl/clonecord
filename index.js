const config = require('./config/')
const {VoiceRegion, VoiceManager} = require('./structures/Voice')
const {AuthManager} = require('./structures/Auth')
/* GLOBAL SHIT M8 GGEZ */
global.vmgr = new VoiceManager()
global.auth = new AuthManager()
if(config.services.api.enabled) {
  require('./api/index')
}

if(config.services.websocket.enabled) {
  require('./websocket/index')
}

console.log('start')