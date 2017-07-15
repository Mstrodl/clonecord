
const config        = require('../config/')
const merge         = require('../utilities').mergeDeep
const randomstring  = require('randomstring')
// Log
const winston       = require('winston')
const log           = winston.loggers.get('websocket')

let gateways = {}
const defaults = {
  op: 0,
  d: {},
  s: null,
  t: null
}
function randomNumber(min, max) {
  return Math.floor(Math.random() * (max - min + 1)+min)
}
function generateGateway(srvname = 'gateway') {
  let rdm = randomNumber(1, 99)
  let rdm2 = randomNumber(1, 99)
  let gw = `clonecord-${srvname || 'gateway'}-${config.env.startsWith('prod') ? 'prd' : 'dev'}-${rdm}-${rdm2}`
  if(gateways[gw]) return generateGateway()
  return gw
}
function generateSession() {
  return randomstring.generate({
    charset: 'hex',
    length: 32
  })
}
function createPayload(op, data, ws) {
  let d = merge(defaults, {
    op: op,
    d: data,
    s: ws.sequence || null
  })
  log.debug('Created payload', d)
  return JSON.stringify(d)
}
function createEvent(event, data, ws) {
  if(ws.authed) ws.sequence = ws.sequence + 1 | 1
  let pack = {
    op: 0,
    t: event.toUpperCase(),
    d: data,
    s: ws.sequence || null
  }
  let d = merge(defaults, pack)
  log.debug('Created event', d)
  return JSON.stringify(d)
}
module.exports.hello = function(ws) { // OP 10 hello
  ws.trace = [generateGateway()]
  ws.send(createPayload(10, {
    heartbeat_interval: 41250,
    _trace: ws.trace
  }, ws))
}
module.exports.ready = function(ws, user) {
  ws.trace.push(generateGateway('sessions'))
  ws.authed = true
  ws.user = user
  ws.userid = user.id
  let readyPacket = {
    v: 6,
    user: JSON.parse(JSON.stringify(user)),
    private_channels: user.private_channels,
    guilds: user.guilds,

    relationships: user.relationships,

    user_settings: user.settings,
    user_guild_settings: user.guild_settings,
    connected_accounts: user.connected_accounts,
    notes: user.notes,

    friend_suggestion_count: 0,
    presences: [],
    read_state: [],
    analytics_token: `${generateGateway('analytics-test')}`,
    experiments: [],
    guild_experiments: [],
    required_action: 3,
    session_id: generateSession(),
    _trace: ws.trace
  }
  ws.send(createEvent('READY', readyPacket, ws))
}

module.exports.heartbeatack = function(ws) {
  ws.send(JSON.stringify({op: 11}))
}