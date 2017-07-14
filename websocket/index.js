const WebSocket = require('ws'),
  config = require('../config/')
const wss = new WebSocket.Server({
  port: config.services.websocket.port
})
const server = require('./serverops')
wss.broadcast = (data, not = undefined) => {
  wss.clients.forEach((client) => {
    if ((not && client != not) && client.readyState == WebSocket.OPEN) {
      client.send(data)
    }
  })
}

let token = 'A_wild_token_appeared_clonecord_test'
wss.on('connection', (ws) => {
  try {
    server.hello(ws)
    ws.on('message', (data) => {
      if (!data) return ws.close(4000)
      data = JSON.parse(data)
      if(!data) {console.log('no data 4002'); return ws.close(4002)}
      if (!data.op) return ws.close(4001)
      if (data.op != 1 && !data.d) {console.log('d 4002'); return ws.close(4002)}
      let d = data.d
      let op = data.op
      switch (op) {
        case 1: // OP 1 Heartbeat
          console.log('received heartbeat')
          server.heartbeatack(ws)
          break
        case 2: // OP 2 Identify
          console.log('received identify')
          if(!d.token) return ws.close(4004)
          if(!d.properties) return ws.close(4002)
          if(d.token == token) {
            server.ready(ws)
          } else {
            return ws.close(4004)
          }
          break
        default:
          console.dir(data)
          //return ws.close(4001)
          break
      }
    })
  } catch (err) {
    console.error(err)
    return ws.close(4000)
  }

})

console.log(`[ws] Listening on ${config.services.websocket.host || config.services.websocket.route}:${config.services.websocket.port}`)