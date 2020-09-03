module.exports = io => {
  let rooms = {}

  io.on('connection', socket => {
    console.log('a user connected')
    socket.emit('no refresh', socket.room)

    socket.on('join room', (roomName, name) => {
      //attach roomName to socket
      socket.room = roomName
      //attach name to socket
      socket.name = name

      // If roomName is not in our room storage, add the roomName
      if (!rooms.hasOwnProperty(roomName)) {
        rooms[roomName] = {
          players: {},
          ball: {}
        }
        //indicate you are the host
        socket.host = true
        socket.emit('you are the host')
      }

      //create a new player and add it to our players object
      rooms[roomName].players[socket.id] = {
        name,
        rotation: 0,
        x: Math.floor(Math.random() * 700) + 50,
        y: Math.floor(Math.random() * 500) + 50,
        playerId: socket.id,
        team: Math.floor(Math.random() * 2) == 0 ? 'red' : 'blue',
        room: roomName
      }

      // send the players object to the new player
      socket.on('getPlayers', () => {
        socket.emit('currentPlayers', rooms[roomName].players, roomName)
        console.log('sending players back!', rooms[roomName].players)
      })
      // update all other players of the new player
      socket.broadcast.emit(
        'newPlayer',
        rooms[roomName].players[socket.id],
        roomName
      )

      //tell others in the room that someone just joined in
      setTimeout(() => {
        console.log(socket.id)
        // io.in(roomName).emit('send id', socket.id, rooms[roomName].user)
        socket.to(roomName).emit('send id', socket.id, rooms[roomName].user)
      }, 500)

      // socket.emit('send id', socket.id, rooms[roomName].user)
      // socket.join(roomName)
      // socket.emit('success', roomName)

      // Socket is now connected to the specific roomName
      socket.join(roomName).emit('success', roomName)

      // when a player moves, update the player data
      socket.on('playerMovement', function(movementData) {
        rooms[roomName].players[socket.id].x = movementData.x
        rooms[roomName].players[socket.id].y = movementData.y
        // emit a message to all players about the player that moved
        socket.broadcast.emit('playerMoved', rooms[roomName].players[socket.id])
      })

      // when the ball moves, update the ball data
      // socket.on('ballMovement', function (newBall) {
      //   rooms[roomName].ball = newBall
      //   console.log('.baaaaalllll', newBall)
      //   // emit a message to all players about the player that moved
      //   socket.broadcast.emit('ballMoved', rooms[roomName].ball)
      // })
      socket.on('ballCollision', newVel => {
        socket.broadcast.emit('velChange', newVel)
      })

      socket.on('getBall', () => {
        socket.emit('ballXY', rooms[roomName].ball)
      })
      socket.on('ballUpdate', newBall => {
        if (!socket.host) {
          return
        }
        rooms[roomName].ball = newBall
        // console.log(rooms[roomName])
        socket.broadcast.emit('setBall', rooms[roomName].ball)
      })

      socket.on('disconnect', () => {
        console.log(`Connection ${socket.id} has left the building`)

        //if socket left after joining a room, meaning refreshed page
        if (rooms[socket.room]) {
          //if socket had a name attached to it
          if (socket.name) {
            // remove this player from our players object
            delete rooms[roomName].players[socket.id]
            // emit a message to all players to remove this player
            io.emit('disconnect', socket.id)

            //tell others in the room to update their list
            io
              .to(socket.room)
              .emit('update', null, null, rooms[socket.room].user)

            if (socket.host) {
              const newHostIdx = Math.floor(
                Math.random() * rooms[socket.room].user.length
              )
              console.log(socket.room, 'refresh', rooms[socket.room].user)
              console.log(
                'refresh',
                'new host',
                rooms[socket.room].user[newHostIdx]
              )
              io.to(socket.room).emit('new host', newHostIdx)
            }

            console.log('user disconnected')

            if (rooms[socket.room].players === {}) {
              delete rooms[socket.room]
            }
          }
        }
      })
    })
  })
}
