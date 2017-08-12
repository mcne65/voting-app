const bodyParser = require('body-parser')
const express = require('express')
const favicon = require('serve-favicon')
const logger = require('morgan')
const path = require('path')

// routes
const index = require('./routes/index')

// custom env variables
require('./config/config')

// environment variables
const app = express()
const port = process.env.port

// database connect 
const db = require('./models/index')

db.sequelize.authenticate()
  .then(() => console.log('connected successfully'))
  .catch(err => console.log('connection failed:', err))

// middleware
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')))
app.use(logger('dev'))
app.use(bodyParser.json()) // TODO: not used yet. remove if not needed
app.use(bodyParser.urlencoded({extended: false})) // TODO: not used yet. remove if not needed

app.use('/', index)

// catch all (404) route handler
app.use((req, res) => {
  res.status(404).send('404 page not found')
})

app.listen(port, () => console.log(`server listening on http://localhost:${port}`))
