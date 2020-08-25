module.exports = io => {
  var players = {}

  io.on('connection', socket => {
    console.log(
      `USER ${socket.id} CONNECTED: connection to the server has been made`
    )
    // create a new player and add it to our players object
    players[socket.id] = {
      rotation: 0,
      x: Math.floor(Math.random() * 700) + 50,
      y: Math.floor(Math.random() * 500) + 50,
      playerId: socket.id,
      team: Math.floor(Math.random() * 2) == 0 ? 'red' : 'blue'
    }
    // send the players object to the new player
    socket.emit('currentPlayers', players)
    // update all other players of the new player
    socket.broadcast.emit('newPlayer', players[socket.id])

    socket.on('disconnect', () => {
      console.log(
        `A USER DISCONNECTED: Connection ${socket.id} has left the building`
      )
      // remove this player from our players object
      delete players[socket.id]
      // emit a message to all players to remove this player
      io.emit('disconnect', socket.id)
    })
  })
}
