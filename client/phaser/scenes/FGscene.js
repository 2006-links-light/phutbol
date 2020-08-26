import Phaser from 'phaser'
import Player from '../entity/player.js'
import Ball from '../entity/ball.js'
import socket from '../../sockets'

function addPlayer(self, playerInfo) {
  self.user = self.physics.add
    .image(playerInfo.x, playerInfo.y, 'user')
    .setOrigin(0.5, 0.5)
    .setDisplaySize(40, 40)

  //self.usercollider(this.player, this.ball)

  // if (playerInfo.team === 'blue') {
  //   self.user.setTint(0x0000ff)
  // } else {
  //   self.user.setTint(0xff0000)
  // }

  // self.user.setDrag(100)
  // self.user.setAngularDrag(100)
  // self.user.setMaxVelocity(200)
}

function addOtherPlayers(self, playerInfo) {
  const otherPlayer = self.add
    .sprite(playerInfo.x, playerInfo.y, 'opponent')
    .setOrigin(0.5, 0.5)
    .setDisplaySize(40, 40)

  otherPlayer.playerId = playerInfo.playerId
  self.otherPlayers.add(otherPlayer)
}

export default class FgScene extends Phaser.Scene {
  constructor() {
    super('FgScene')

    // this.addPlayer = this.addPlayer.bind(this)
    // this.addOtherPlayers = this.addOtherPlayers.bind(this)
  }

  initializeSockets() {
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
  }
  // addPlayer(self, playerInfo) {
  //   self.user = self.physics.add
  //     .image(playerInfo.x, playerInfo.y, 'user')
  //     .setOrigin(0.5, 0.5)
  //     .setDisplaySize(53, 40)

  //   //self.usercollider(this.player, this.ball)

  //   if (playerInfo.team === 'blue') {
  //     self.user.setTint(0x0000ff)
  //   } else {
  //     self.user.setTint(0xff0000)
  //   }

  //   // self.user.setDrag(100)
  //   // self.user.setAngularDrag(100)
  //   // self.user.setMaxVelocity(200)
  // }

  // addOtherPlayers(self, playerInfo) {
  //   const otherPlayer = self.add
  //     .sprite(playerInfo.x, playerInfo.y, 'opponent')
  //     .setOrigin(0.5, 0.5)
  //     .setDisplaySize(53, 40)

  //   if (playerInfo.team === 'blue') {
  //     otherPlayer.setTint(0x0000ff)
  //   } else {
  //     otherPlayer.setTint(0xff0000)
  //   }

  //   otherPlayer.playerId = playerInfo.playerId
  //   self.otherPlayers.add(otherPlayer)
  // }

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

    // Preload Sounds
    // << LOAD SOUNDS HERE >>
  }

  createGround(x, y) {
    this.groundGroup.create(x, y, 'ground')
  }

  create() {
    this.otherPlayers = this.physics.add.group()
    // Create game entities
    this.initializeSockets()
    this.createPlayers()
    // << CREATE GAME ENTITIES HERE >>
    // this.player = new Player(this, 50, 325, 'user').setScale(0.25)
    this.ball = new Ball(this, 400, 325, 'ball').setScale(0.25)
    // this.player2 = new Player2(this, 750, 325, 'jeff').setScale(0.25)

    //this.physics.add.collider(this.player, this.ball)
    // this.physics.add.collider(this.player2, this.ball)
    // this.physics.add.collider(this.player, this.player2)

    // this.cursors = this.input.keyboard.createCursorKeys()
    // this.createAnimations()
    // this.ball.setBounce(0.6)
    // this.ball.setCollideWorldBounds(true)
    // this.player.setCollideWorldBounds(true)
    // this.player2.setCollideWorldBounds(true)

    // Create sounds
    // << CREATE SOUNDS HERE >>

    // Create collisions for all entities
    // << CREATE COLLISIONS HERE >>

    // var self = this
    // this.otherPlayers = this.physics.add.group()

    this.cursors = this.input.keyboard.createCursorKeys()
  }

  createPlayers() {
    socket.emit('getPlayers')
  }

  // createAnimations() {
  //   this.anims.create({
  //     key: 'run',
  //     frames: this.anims.generateFrameNumbers('user', {start: 17, end: 20}),
  //     frameRate: 10,
  //     repeat: -1
  //   })
  //   this.anims.create({
  //     key: 'jump',
  //     frames: [{key: 'user', frame: 17}],
  //     frameRate: 20
  //   })
  //   this.anims.create({
  //     key: 'idleUnarmed',
  //     frames: [{key: 'user', frame: 11}],
  //     frameRate: 10
  //   })
  //   this.anims.create({
  //     key: 'idleArmed',
  //     frames: [{key: 'user', frame: 6}],
  //     frameRate: 10
  //   })
  // }

  // time: total time elapsed (ms)
  // delta: time elapsed (ms) since last update() call. 16.666 ms @ 60fps
  update(time, delta) {
    // this.createPlayers()
    // << DO UPDATE LOGIC HERE >>
    //this.player.update(this.cursors)
    // console.log("x axis " + this.player.x);
    // console.log("y axis " + this.player.y);
    // if (this.user) {
    //   if (this.cursors.left.isDown) {
    //     this.user.setAngularVelocity(-150)
    //   } else if (this.cursors.right.isDown) {
    //     this.user.setAngularVelocity(150)
    //   } else {
    //     this.user.setAngularVelocity(0)
    //   }
    //   if (this.cursors.up.isDown) {
    //     this.physics.velocityFromRotation(
    //       this.user.rotation + 1.5,
    //       100,
    //       this.user.body.acceleration
    //     )
    //   } else {
    //     this.user.setAcceleration(0)
    //   }
    //   this.physics.world.wrap(this.user, 5)
    // }
    // if (this.user) {
    //   // emit player movement
    //   let x = this.user.x
    //   let y = this.user.y
    //   if (
    //     this.user.oldPosition &&
    //     (x !== this.user.oldPosition.x ||
    //       y !== this.user.oldPosition.y ||
    //       r !== this.user.oldPosition.rotation)
    //   ) {
    //     this.socket.emit('playerMovement', {x: this.user.x, y: this.user.y})
    //   }
    //   // save old position data
    //   this.user.oldPosition = {
    //     x: this.user.x,
    //     y: this.user.y
    //   }
    //   if (this.cursors.left.isDown) {
    //     this.user.setAngularVelocity(-150)
    //   } else if (this.cursors.right.isDown) {
    //     this.user.setAngularVelocity(150)
    //   } else {
    //     this.user.setAngularVelocity(0)
    //   }
    //   //this.physics.world.wrap(this.ship, 5);
    // }
  }
}
