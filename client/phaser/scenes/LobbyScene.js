import 'phaser'
import React from '../config/jsx-dom-shim'
import socket from '../../sockets'

export default class LobbyScene extends Phaser.Scene {
  constructor() {
    super('LobbyScene')
    this.names = ['Bobby', 'Jake']
    this.name = ''
  }

  init(data) {
    // this.names.push(data.name)
    this.name = data.name
    this.room = data.room
  }

  initializeSockets() {
    let self = this
    // this.otherPlayers = this.physics.add.group()
    console.log(this.names)
    socket.on('currentPlayers', function(players, roomName) {
      Object.keys(players).forEach(function(id) {
        console.log(id)
        console.log('rooooomName: ', roomName)
        console.log('these are the players in the lobby: ', players)
        if (players[id].name) {
          self.names.push(players[id].name)
        }
        console.log('THIS IS THIS DOT NAMES', self.names)
        //   if (
        //     players[id].playerId === self.socket.id &&
        //     players[id].room === roomName
        //   ) {
        //     addPlayer(self, players[id])
        //   }
        //   if (
        //     players[id].playerId !== self.socket.id &&
        //     players[id].room === roomName
        //   ) {
        //     addOtherPlayers(self, players[id])
        //   }
      })
    })

    socket.on('newPlayer', function(playerInfo, roomName) {
      if (playerInfo.room === roomName) {
        // addOtherPlayers(self, playerInfo)
      }
    })

    // socket.on('disconnect', function(playerId) {
    //   self.otherPlayers.getChildren().forEach(function(otherPlayer) {
    //     if (playerId === otherPlayer.playerId) {
    //       otherPlayer.destroy()
    //     }
    //   })
    // })

    // socket.on('playerMoved', function(playerInfo) {
    //   self.otherPlayers.getChildren().forEach(function(otherPlayer) {
    //     if (playerInfo.playerId === otherPlayer.playerId) {
    //       otherPlayer.setPosition(playerInfo.x, playerInfo.y)
    //       otherPlayer.name.x = playerInfo.x-30
    //       otherPlayer.name.y = playerInfo.y-10
    //     }
    //   })
    // })

    // socket.on('ballMoved', function(ballInfo) {
    //   self.ball.setPosition(ballInfo.x, ballInfo.y)
    // })
  }

  create() {
    this.initializeSockets()
    console.log('THESEARE THE ANEMS!!!!', this.names)

    this.scene.launch('BgScene')
    this.add.text(300, 50, 'Room Code ' + this.room, {
      font: '25px Arial',
      fill: 'white'
    })
    var element = this.add.dom(
      400,
      300,
      <div>
        <div>Players:</div>
        <ul>
          {this.names.map(name => {
            return <li key={this.names.indexOf(name)}>{name}</li>
          })}
        </ul>
        <input
          type="button"
          name="startButton"
          value="Start Game"
          style="font-size: 32px"
        />
      </div>
    )
    element.addListener('click').on('click', event => {
      //  event.preventDefault()
      if (event.target.name === 'startButton') {
        socket.emit('join room', this.room, this.name)
        this.scene.start('MainScene', {
          room: this.room,
          names: this.names
        })
      }
    })
  }

  update() {
    // console.log('THESEA RE THE PLAYERS' + this.players)
  }
}
