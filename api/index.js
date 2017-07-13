const express = require('express'),
      config = require('../config/')

const app = express()



app.use((err, req, res, next) => {
  console.error(err)
  res.send('Oops error')
})
app.disable('x-powered-by')
app.listen(config.services.api.port, console.log(`Listening on ${config.services.api.route || config.services.api.route}:${config.services.api.port}`))