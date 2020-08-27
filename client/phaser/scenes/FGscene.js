import Phaser from 'phaser'
import Player from '../entity/player.js'
import Ball from '../entity/ball.js'
import socket from '../../sockets'

function addPlayer(self, playerInfo) {
  self.user = new Player(self, 50, 325, 'user').setScale(0.25)

  self.user.playerId = playerInfo.playerId
}

function addOtherPlayers(self, playerInfo) {
  // const otherPlayer = self.add
  //   .sprite(playerInfo.x, playerInfo.y, 'opponent')
  //   .setOrigin(0.5, 0.5)
  //   .setDisplaySize(40, 40)

  const otherPlayer = new Player(self, 50, 325, 'opponent').setScale(0.25)

  otherPlayer.playerId = playerInfo.playerId
  self.otherPlayers.add(otherPlayer)
}
export default class FgScene extends Phaser.Scene {
  constructor() {
    super('FgScene')
  }

  initializeSockets() {
    console.log('CHANGED')
    let self = this
    console.log(this)
    this.otherPlayers = this.physics.add.group()

    socket.on('currentPlayers', function(players) {
      console.log('Getting current players', players)
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
    // Create game entities
    this.ball = new Ball(this, 400, 325, 'ball').setScale(0.25)
    this.initializeSockets()
    this.createPlayers()
    // << CREATE GAME ENTITIES HERE >>
    // this.player = new Player(this, 50, 325, 'user').setScale(0.25)
    // this.player2 = new Player2(this, 750, 325, 'jeff').setScale(0.25)

    // this.physics.add.collider(this.user, this.ball)
    // this.physics.add.collider(this.otherPlayers, this.ball)
    // this.physics.add.collider(this.user, this.otherPlayers)

    this.cursors = this.input.keyboard.createCursorKeys()
    //this.createAnimations()
    this.ball.setBounce(0.6)
    this.ball.setCollideWorldBounds(true)
    //this.user.setCollideWorldBounds(true)
    //this.otherPlayers.setCollideWorldBounds(true)

    // Create sounds
    // << CREATE SOUNDS HERE >>

    // Create collisions for all entities
    // << CREATE COLLISIONS HERE >>

    // var self = this
    // this.otherPlayers = this.physics.add.group()
  }

  createPlayers() {
    socket.emit('getPlayers')
  }

  // createAnimations() {
  //   this.anims.create({
  //     key: 'run',
  //     frames: this.anims.generateFrameNumbers('user', { start: 17, end: 20 }),
  //     frameRate: 10,
  //     repeat: -1
  //   })
  //   this.anims.create({
  //     key: 'jump',
  //     frames: [{ key: 'user', frame: 17 }],
  //     frameRate: 20
  //   })
  //   this.anims.create({
  //     key: 'idleUnarmed',
  //     frames: [{ key: 'user', frame: 11 }],
  //     frameRate: 10
  //   })
  //   this.anims.create({
  //     key: 'idleArmed',
  //     frames: [{ key: 'user', frame: 6 }],
  //     frameRate: 10
  //   })
  // }

  // time: total time elapsed (ms)
  // delta: time elapsed (ms) since last update() call. 16.666 ms @ 60fps
  update(time, delta) {
    // << DO UPDATE LOGIC HERE >>
    this.user.update(this.cursors)

    if (this.user) {
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
