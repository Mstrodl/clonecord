const express   = require('express')
const config    = require('../config/')
const path      = require('path')
const sr        = require('common-tags').stripIndents
const errors    = require('./errors')
const app       = express()

// Log
const winston   = require('winston')
const log       = winston.loggers.get('rest')

// Routers
const api       = require('./routes/api')
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
  if(err.realError) {
    return res.status(500).json(err.realError)
  }
  log.error('Uncaught error', err)
  return res.status(500).json({
    code: 0,
    message: `The server had an error processing your request`,
    errorMessage: err.message || 'None'
  })
})

app.disable('x-powered-by') // Harder to detect what the webserver is running under
app.listen(config.services.api.port, log.info(`Listening on ${config.services.api.host || config.services.api.route}:${config.services.api.port}`))