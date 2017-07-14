const config = require('./config/')
const {VoiceRegion, VoiceManager} = require('./structures/Voice')
/* GLOBAL SHIT M8 GGEZ */
global.vmgr = new VoiceManager()

if(config.services.api.enabled) {
  require('./api/index')
}

if(config.services.websocket.enabled) {
  require('./websocket/index')
}

console.log('start')