const config        = require('../config/')
const WebSocket     = require('ws')
const server        = require('./serverops')
const nodeCleanup   = require('node-cleanup')
const querystring   = require('querystring')
// Log
const winston       = require('winston')
const log           = winston.loggers.get('websocket')
// const wss = createWS('ws://127.0.0.1:6900/?encoding=json&v=6', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYyOTIxMDM2MzM1NzYxMzI2MDgiLCJyMSI6ImQzYjU0OTA0ZWMzOCIsInIyIjo3MiwiaWF0IjoxNTAwMjQzNzk5LCJleHAiOjE1MDAzMzAxOTl9.rsHM6BaS1i32B_UTwuyeBDB9XvqPY5ii-cMLsITQFXw')
const wss = new WebSocket.Server({
  port: config.services.websocket.port
})

const {Channel, Guild, Message, User} = require('../schemas/')


function getParams(req) {
  let str = req.url
  if(!str) return {
    encoding: 'json',
    v: '6'
  }
  if(str.startsWith('/')) {
    str = str.substr(1)
  }
  if(str.startsWith('?')) {
    str = str.substr(1)
  }
  let unpacked = querystring.parse(str)
  console.log(unpacked)
  return unpacked ? unpacked : {
    encoding: 'json',
    v: '6'
  }
}
wss.on('connection', (ws, req) => {
  try {
    // get encoding and define
    let params = getParams(req)
    ws.encoding = params.encoding || 'json'
    ws.gwv = params.v || '6'
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
      //console.log(d)
      switch (op) {
        case 1: // OP 1 Heartbeat
          server.heartbeatack(ws, data)
          break
        case 2: // OP 2 Identify
          if(!d.token) return ws.close(4004, 'Authentication failed')
          if(!d.properties) return ws.close(4002, 'Decode error')
          if(ws.authed) return ws.close(4005, 'Already authenticated')
          let token = d.token
          if(auth.tokenLegit(token)) {
            let uid = auth.getTokenUserID(token)
            let user = await User.findOne({id: uid})
            if(!user) {
              log.error('A VALID token generated with an invalid user ID was used. Shutting down Clonecord.')
              ws.close(4004, 'Authentication failed')
              return process.exit(1)
            }
            server.ready(ws, user, data)
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
    return ws.close(4000, err.message)
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