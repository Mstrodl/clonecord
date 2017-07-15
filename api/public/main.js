function onopen(event) {
  console.log('[wss] OPEN!')
}
function onclose(event) {
  console.log('[wss] CLOSED!')
  console.error('[wss]', event.code, event.reason)
}
function onerror(error) {
  console.error('[wss]', error)
}
function onmessage(event) {
  console.group('[wss] message')
  console.dir(event)
  console.log('data', event.data)
  console.groupEnd()
}
let lastSeq = null
let token = ''
function heartbeat(ws) {
  ws.send(JSON.stringify({
    op: 1,
    d: lastSeq || null
  }))
}
//const wss = createWS('wss://gateway.discord.gg/?encoding=json&v=6', true)
function identify(ws) {
  let packet = {
    op: 2,
    d: {
      token: token,
      properties: {
        '$os': 'Windows',
        '$browser': 'TestBot Raw',
        '$device': 'TestBot Raw',
        '$referring_domain': '',
        '$referrer': ''
      },
      compress: false,
      large_threshold: 250,
      version: 6
    }
  }
  ws.send(JSON.stringify(packet))
}

function onmessagediscord(event) {
  let data = JSON.parse(event.data)
  let op = opcode = data.op
  let ws = event.currentTarget
  if(data.d && data.d.s) lastSeq = data.d.s
  switch(op) {
    case 10: { // OP 10 Hello
      setTimeout(heartbeat, data.d.heartbeat_interval, ws) // OP 1 response
      identify(ws) // OP 1
      break
    }
  }
  console.group(`[wss] OP ${op}`)
  console.dir(event)
  console.log(data)
  console.groupEnd()
}
function send(data) {
  wss.send(data)
}

function createWS(url, _token) {
  let wss = new WebSocket(url)
  wss.onopen = onopen
  wss.onclose = onclose
  wss.onerror = onerror
  wss.onmessage = onmessagediscord
  token = _token
  return wss
}
