
const config        = require('../config/')
const merge         = require('../utilities').mergeDeep
const randomstring  = require('randomstring')
const zlib          = require('zlib')
const erlpack       = require('erlpack')

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
function pack(data, ws) {
  return (ws.encoding == 'etf' ? erlpack.pack(data) : JSON.stringify(data)) //zlib.deflateSync(Buffer.from(data))
}
function unpack(data, ws) {
  let unpacked = ws.encoding == 'etf' ? erlpack.unpack(data) : JSON.parse(data) //zlib.inflateSync(Buffer.from(data))
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
function createPayload(op, data, ws, leaveit = false) {
  let d = {
    op: op || 0,
    d: data || {},
    s: ws.sequence || null
  }
  log.debug('Created payload', d)
  if(leaveit) {
    return d
  } else {
    return pack(d, ws)
  }
}
function createEvent(event, data, ws, leaveit = false) {
  if(ws.authed) ws.sequence = ws.sequence + 1 | 1
  let d = {
    op: 0,
    t: event.toUpperCase(),
    d: data,
    s: ws.sequence || null
  }
  log.debug('Created event', d)
  if(leaveit) {
    return d
  } else {
    return pack(d, ws)
  }
}

module.exports.pack = pack
module.exports.unpack = unpack


module.exports.hello = function(ws, data) { // OP 10 hello
  ws.trace = [generateGateway()]
  ws.send(createPayload(10, {
    heartbeat_interval: 41250,
    _trace: ws.trace
  }, ws))
}
let fuck = {
      locale: 'en-US',
      status: 'online',
      showCurrentGame: true,
      sync: true,
      inlineAttachmentMedia: true,
      inlineEmbedMedia: true,
      renderEmbeds: true,
      renderReations: true,
      theme: 'dark',
      enableTTSCommand: true,
      messageDisaplyCompact: false,
      convertEmoticons: true,
      restrictedGuilds: [],
      defaultGuildsRestricted: false,
      explicitContentFilter: 0,
      friendSourceFlags: {all: true},
      developerMode: true,
      guildPositions: [],
      detectPlatformAccounts: false,
      afkTimeout: 600
    }
module.exports.ready = function(ws, user, data) {
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

    user_settings: fuck,
    user_guild_settings: user.guild_settings || [],
    connected_accounts: user.connected_accounts || [],
    notes: user.notes || [],

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
  if(data.d.compress == true || data.d.compressed == true) {
    return ws.send(
      zlib.deflateSync(
        Buffer.from(
          createEvent('READY', readyPacket, ws)
        )
      )
    )
  }
  ws.send(createEvent('READY', readyPacket, ws))
}

module.exports.heartbeatack = function(ws) {
  ws.send(JSON.stringify({op: 11}))
}