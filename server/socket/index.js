module.exports = io => {
  var players = {}
  var ball = {
    x: Math.floor(Math.random() * 700) + 50,
    y: Math.floor(Math.random() * 500) + 50
  }
  var scores = {
    blue: 0,
    red: 0
  }

  io.on('connection', socket => {
    console.log('a user connected')

    // create a new player and add it to our players object
    players[socket.id] = {
      rotation: 0,
      x: Math.floor(Math.random() * 700) + 50,
      y: Math.floor(Math.random() * 500) + 50,
      playerId: socket.id,
      team: Math.floor(Math.random() * 2) == 0 ? 'red' : 'blue'
    }

    // send the players object to the new player
    socket.on('getPlayers', () => {
      socket.emit('currentPlayers', players)
      // send the ball object to the new player
      socket.emit('ballLocation', ball)
      // send the current scores
      socket.emit('scoreUpdate', scores)
      console.log('sending players back!', players)
    })
    // update all other players of the new player
    socket.broadcast.emit('newPlayer', players[socket.id])

    socket.on('disconnect', function() {
      console.log('user disconnected')

      // remove this player from our players object
      delete players[socket.id]
      // emit a message to all players to remove this player
      io.emit('disconnect', socket.id)
    })

    // when a player moves, update the player data
    socket.on('playerMovement', function(movementData) {
      players[socket.id].x = movementData.x
      players[socket.id].y = movementData.y
      // emit a message to all players about the player that moved
      socket.broadcast.emit('playerMoved', players[socket.id])
    })

    socket.on('goalScored', function() {
      if (players[socket.id].team === 'red') {
        scores.red += 1
      } else {
        scores.blue += 1
      }
      ball.x = Math.floor(Math.random() * 700) + 50
      ball.y = Math.floor(Math.random() * 500) + 50
      io.emit('starLocation', star)
      io.emit('scoreUpdate', scores)
    })
  })
}
