const config = require('./config/')
if(config.services.api.enabled) {
  require('./api/index')
}

if(config.services.websocket.enabled) {
  require('./websocket/index')
}

console.log('start')