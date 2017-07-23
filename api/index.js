const express   = require('express')
const config    = require('../config/')
const path      = require('path')
const sr        = require('common-tags').stripIndents
const errors    = require('./errors')
const app       = express()
const fs        = require('fs')
// Log
const winston   = require('winston')
const log       = winston.loggers.get('rest')

// Routers
const api       = require('./routes/api')
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Credentials', 'true')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Track, X-Super-Properties, X-Context-Properties, X-Failed-Requests, X-Fingerprint, X-RPC-Proxy')
  res.setHeader('Access-Control-Allow-Methods', 'POST, GET, PUT, PATCH, DELETE')
  res.setHeader('Access-Control-Allow-Origin', '*')
  return next()
})
app.use(express.static(path.join(__dirname, 'public')))
app.use('/api', api)
app.use('/api/v6', api)
app.use((req, res, next) => {
  return res.status(404).json({
    code: 0,
    message: '404: Not Found'
  })
})

/* Error Handler */
app.use((err, req, res, next) => {
  try {
    if(err.realError) {
      return res.status(500).json(err.realError)
    }
    log.error('Uncaught error', err)
    return res.status(500).json({
      code: 0,
      message: `The server had an error processing your request`,
      errorMessage: err.message || 'None'
    })
  } catch(err) {
    console.error(err)
    log.error('Error in the error handler', err) // this shouldn't happen...
    return res.status(500).json({
      code: 0,
      message: `The server had an error processing your request`,
      errorMessage: err.message || 'None'
    })
  }
  
})
let sslOptions = {
  key: fs.readFileSync('key.key'),
  cert: fs.readFileSync('cert.cert')
}
let https = require('https')
https.createServer(sslOptions, app).listen(config.services.api.port)
app.disable('x-powered-by') // Harder to detect what the webserver is running under
app.listen(config.services.api.port + 1, log.info(`Listening on ${config.services.api.host || config.services.api.route}:${config.services.api.port}`))