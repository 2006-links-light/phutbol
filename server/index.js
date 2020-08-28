let express = require('express')
let path = require('path')
let app = express()
let server = require('http').createServer(app)
let io = require('socket.io')(server)
require('./socket')(io)

app.use(express.static(path.join(__dirname, '../public')))

app.get('/', function(req, res) {
  res.sendFile(path.join(__dirname, '../public/index.html'))
})

server.listen(process.env.PORT || 8081, function() {
  console.log(`Listening on ${server.address().port}`)
})
