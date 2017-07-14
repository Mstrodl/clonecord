const defaults = {
  op: 0,
  d: {},
  s: null,
  t: null
}
const config = require('../config/')
const merge = require('../utilities').mergeDeep
const randomstring = require('randomstring')
let gateways = {}
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
  if(ws.authed) ++ws.sequence
  console.log(d)
  return JSON.stringify(d)
}
function createEvent(event, data, ws) {
  let pack = {
    op: 0,
    t: event.toUpperCase(),
    d: data,
    s: ws.sequence || null
  }
  if(ws.authed) ++ws.sequence
  let d = merge(defaults, pack)
  console.log(d)
  return JSON.stringify(d)
}
module.exports.hello = function(ws) { // OP 10 hello
  ws.trace = [generateGateway()]
  ws.send(createPayload(10, {
    heartbeat_interval: 41250,
    _trace: ws.trace
  }, ws))
}
let defaultUserSettings = {
  locale: 'en_US',
  status: 1,
  showCurrentGame: true,
  sync: true,
  inlineAttachmentMedia: true,
  inlineEmbedMedia: true,
  renderEmbeds: true,
  renderReations: true,
  theme: 0,
  enableTTSCommand: true,
  messageDisaplyCompact: false,
  convertEmoticons: true,
  restrictedGuilds: [],
  defaultGuildsRestricted: false,
  explicitContentFilter: 0,
  friendSourceFlags: {all: true},
  developerMode: false,
  guildPositions: [],
  detectPlatformAccounts: false,
  afkTimeout: 600
}
module.exports.ready = function(ws) {
  ws.trace.push(generateGateway('sessions'))
  ws.authed = true
  ws.send(createEvent('READY', {
    v: 6,
    user: {
      avatar: null,
      bot: false,
      discriminator: '80085',
      email: 'cancer@google.com',
      id: '335207939134586880',
      mfa_enabled: false,
      username: 'boobs',
      verified: true
    },
    private_channels: [],
    guilds: [],
    relationships: [],
    user_settings: defaultUserSettings,
    user_guild_settings: [],

    connected_accounts: [],
    notes: [],
    friend_suggestion_count: 0,
    presences: [],
    read_state: [],
    analytics_token: `${generateSession('analytics-test')}`,
    experiments: [],
    guild_experiments: [],
    required_action: 3,
    session_id: generateSession(),
    _trace: ws.trace
  }, ws))
}

module.exports.heartbeatack = function(ws) {
  ws.send(JSON.stringify({op: 11}))
}