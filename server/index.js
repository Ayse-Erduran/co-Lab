const path = require('path')
const express = require('express')
const app = express()
const morgan = require('morgan')

const PORT = process.env.PORT || 1337

const socketio = require('socket.io')
module.exports = app

//logging mw
app.use(morgan('dev'))

//static file-serving mw
app.use(express.static(path.join(__dirname, '..', '/public')))

// sends index.html
app.use('*', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public/index.html'))
})


const server = app.listen(PORT, () => {
  console.log(`listening on: http://localhost:${PORT}`)
})

const io = socketio(server)
require('./socket')(io)

