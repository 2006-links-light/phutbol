module.exports = io => {
  var players = {}

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
      players[socket.id].rotation = movementData.rotation
      // emit a message to all players about the player that moved
      socket.broadcast.emit('playerMoved', players[socket.id])
    })
  })
}
