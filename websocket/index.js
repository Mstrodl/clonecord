const config    = require('../config/')
const WebSocket = require('ws')
const server    = require('./serverops')

// Log
const winston   = require('winston')
const log       = winston.loggers.get('websocket')

const wss = new WebSocket.Server({
  port: config.services.websocket.port
})

let token = 'A_wild_token_appeared_clonecord_test'
wss.on('connection', (ws) => {
  try {
    server.hello(ws)
    ws.on('message', (data) => {
      if (!data) {
        log.debug('No data received from client')
        return ws.close(4000)
      }
      data = JSON.parse(data)
      if(!data) {
        log.debug(`Couldn't parse data from client`)
        return ws.close(4002)
      }
      if (!data.op) {
        log.debug('No op code received from client')
        return ws.close(4001)
      }
      if (data.op != 1 && !data.d) {
        log.debug('No d object received from client')
        return ws.close(4002)
      }
      let d = data.d
      let op = data.op
      switch (op) {
        case 1: // OP 1 Heartbeat
          server.heartbeatack(ws)
          break
        case 2: // OP 2 Identify
          if(!d.token) return ws.close(4004)
          if(!d.properties) return ws.close(4002)
          if(d.token == token) {
            server.ready(ws)
          } else {
            return ws.close(4004)
          }
          break
        default:
          log.warn('Unknown OP code received', data)
          //return ws.close(4001)
          break
      }
    })
  } catch (err) {
    log.error('Failure in websocket logic', err)
    return ws.close(4000)
  }
})

log.info(`Listening on ${config.services.websocket.host || config.services.websocket.route}:${config.services.websocket.port}`)