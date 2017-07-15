const config        = require('../config/')
const WebSocket     = require('ws')
const server        = require('./serverops')
const nodeCleanup   = require('node-cleanup')

// Log
const winston       = require('winston')
const log           = winston.loggers.get('websocket')

const wss = new WebSocket.Server({
  port: config.services.websocket.port
})

const {Channel, Guild, Message, User} = require('../schemas/')


wss.on('connection', (ws) => {
  try {
    server.hello(ws)
    ws.on('message', async (data) => {
      if (!data) {
        log.debug('No data received from client')
        return ws.close(4000, 'Unknown error')
      }
      data = JSON.parse(data)
      if(!data) {
        log.debug(`Couldn't parse data from client`)
        return ws.close(4002, 'Decode error')
      }
      if (!data.op) {
        log.debug('No op code received from client')
        return ws.close(4001, 'Unknown opcode')
      }
      if (data.op != 1 && !data.d) {
        log.debug('No d object received from client')
        return ws.close(4002, 'Decode error')
      }
      let d = data.d
      let op = data.op
      switch (op) {
        case 1: // OP 1 Heartbeat
          server.heartbeatack(ws)
          break
        case 2: // OP 2 Identify
          if(!d.token) return ws.close(4004, 'Authentication failed')
          if(!d.properties) return ws.close(4002, 'Decode error')
          let token = d.token
          if(auth.tokenLegit(token)) {
            let uid = auth.getTokenUserID(token)
            let user = await User.findOne({id: uid})
            if(!user) {
              log.error('A VALID token generated with an invalid user ID was used. Shutting down Clonecord.')
              ws.close(4004, 'Authentication failed')
              return process.exit(1)
            }
            server.ready(ws, user)
          } else {
            return ws.close(4004, 'Authentication failed')
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

nodeCleanup((sig, err) => {
  wss.clients.forEach((client) => {
    if (client.readyState == WebSocket.OPEN) {
      client.close(4000, 'Shutting down server.')
    }
  })
})

log.info(`Listening on ${config.services.websocket.host || config.services.websocket.route}:${config.services.websocket.port}`)