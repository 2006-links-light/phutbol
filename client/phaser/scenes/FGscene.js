import Phaser from 'phaser'
import Player from '../entity/player.js'
import Ball from '../entity/ball.js'
import socket from '../../sockets'

function addPlayer(self, playerInfo) {
  self.user = new Player(self, 50, 325, 'user').setScale(0.25)

  self.user.playerId = playerInfo.playerId
}

function addOtherPlayers(self, playerInfo) {
  const otherPlayer = new Player(self, 50, 325, 'opponent').setScale(0.25)

  otherPlayer.playerId = playerInfo.playerId
  self.otherPlayers.add(otherPlayer)
}
export default class FgScene extends Phaser.Scene {
  constructor() {
    super('FgScene')
  }

  initializeSockets() {
    let self = this
    this.otherPlayers = this.physics.add.group()

    socket.on('currentPlayers', function(players) {
      Object.keys(players).forEach(function(id) {
        if (players[id].playerId === self.socket.id) {
          addPlayer(self, players[id])
        } else {
          addOtherPlayers(self, players[id])
        }
      })
    })

    socket.on('newPlayer', function(playerInfo) {
      addOtherPlayers(self, playerInfo)
    })

    socket.on('disconnect', function(playerId) {
      self.otherPlayers.getChildren().forEach(function(otherPlayer) {
        if (playerId === otherPlayer.playerId) {
          otherPlayer.destroy()
        }
      })
    })

    socket.on('playerMoved', function(playerInfo) {
      self.otherPlayers.getChildren().forEach(function(otherPlayer) {
        if (playerInfo.playerId === otherPlayer.playerId) {
          otherPlayer.setPosition(playerInfo.x, playerInfo.y)
        }
      })
    })
  }

  preload() {
    this.socket = socket
    // Preload Sprites
    // << LOAD SPRITES HERE >>
    // this.load.image("ground", "./assets/ground.png");
    this.load.image('ball', '/SoccerBall.png')

    this.load.image('user', '/red.png', {
      frameWidth: 340,
      frameHeight: 460
    })
    this.load.image('opponent', '/blue.png', {
      frameWidth: 340,
      frameHeight: 460
    })
  }

  createGround(x, y) {
    this.groundGroup.create(x, y, 'ground')
  }

  create() {
    this.otherPlayers = this.physics.add.group()
    this.ball = new Ball(this, 400, 325, 'ball').setScale(0.25)
    this.initializeSockets()
    this.createPlayers()

    // this.physics.add.collider(this.user, this.ball)
    // this.physics.add.collider(this.otherPlayers, this.ball)
    // this.physics.add.collider(this.user, this.otherPlayers)

    this.cursors = this.input.keyboard.createCursorKeys()
    //this.createAnimations()
    this.ball.setBounce(0.6)
    this.ball.setCollideWorldBounds(true)
    //this.user.setCollideWorldBounds(true)
    //this.otherPlayers.setCollideWorldBounds(true)
  }

  createPlayers() {
    socket.emit('getPlayers')
  }

  // time: total time elapsed (ms)
  // delta: time elapsed (ms) since last update() call. 16.666 ms @ 60fps
  update(time, delta) {
    if (this.user) {
      this.user.update(this.cursors)

      // emit player movement
      let x = this.user.x
      let y = this.user.y

      if (
        this.user.oldPosition &&
        (x !== this.user.oldPosition.x || y !== this.user.oldPosition.y)
      ) {
        this.socket.emit('playerMovement', {x: this.user.x, y: this.user.y})
      }
      // save old position data
      this.user.oldPosition = {
        x: this.user.x,
        y: this.user.y
      }

      if (this.cursors.left.isDown) {
        this.user.setAngularVelocity(-150)
      } else if (this.cursors.right.isDown) {
        this.user.setAngularVelocity(150)
      } else {
        this.user.setAngularVelocity(0)
      }
    }
  }
}
