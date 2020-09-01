import Phaser from 'phaser'
import Player from '../entity/Player.js'
import Ball from '../entity/Ball.js'
import Goal from '../entity/Goal.js'
import socket from '../../sockets'

function addPlayer(self, playerInfo) {
  self.user = new Player(self, 50, 325, 'user').setScale(0.25)
  self.user.setDrag(100)
  self.user.setAngularDrag(100)
  self.user.setCollideWorldBounds(true)
  self.physics.add.collider(self.user, self.ball)
  self.physics.add.collider(self.user, self.otherPlayers)
  self.user.playerId = playerInfo.playerId
}

function addOtherPlayers(self, playerInfo) {
  const otherPlayer = new Player(self, 50, 325, 'opponent').setScale(0.25)

  otherPlayer.playerId = playerInfo.playerId
  self.otherPlayers.add(otherPlayer)
  // self.physics.add.collider(self.otherPlayers, self.user)
  // self.physics.add.collider(self.user, self.otherPlayers)
  // self.otherPlayers.setCollideWorldBounds(true)
}

export default class FgScene extends Phaser.Scene {
  constructor() {
    super('FgScene')
  }

  initializeSockets() {
    let self = this
    this.otherPlayers = this.physics.add.group()

    socket.on('currentPlayers', function(players, roomName) {
      Object.keys(players).forEach(function(id) {
        console.log('rooooomName: ', roomName)
        console.log('these are the players: ', players)
        if (
          players[id].playerId === self.socket.id &&
          players[id].room === roomName
        ) {
          addPlayer(self, players[id])
        }
        if (
          players[id].playerId !== self.socket.id &&
          players[id].room === roomName
        ) {
          addOtherPlayers(self, players[id])
        }
      })
    })

    socket.on('newPlayer', function(playerInfo, roomName) {
      if (playerInfo.room === roomName) {
        addOtherPlayers(self, playerInfo)
      }
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

    socket.on('ballMoved', function(ballInfo) {
      self.ball.setPosition(ballInfo.x, ballInfo.y)
    })
  }

  createPlayers() {
    socket.emit('getPlayers')
    this.ball = new Ball(this, 400, 325, 'ball').setScale(0.25)
    this.ball.setBounce(0.6)
    this.ball.setCollideWorldBounds(true)
  }

  preload() {
    this.socket = socket
    this.data.values.redScore = 0
    this.data.values.blueScore = 0

    // Preload Sprites
    // << LOAD SPRITES HERE >>
    // this.load.image("ground", "./assets/ground.png");
    this.load.image('ball', '/SoccerBall.png')
    this.load.image('goal', '/soccer-goal.png')

    this.load.image('user', '/red.png', {
      frameWidth: 340,
      frameHeight: 460
    })
    this.load.image('opponent', '/blue.png', {
      frameWidth: 340,
      frameHeight: 460
    })

    // JOYSTICK
    var url

    url =
      'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexvirtualjoystickplugin.min.js'
    this.load.plugin('rexvirtualjoystickplugin', url, true)
  }

  create() {
    this.initializeSockets()
    // this.ball = new Ball(this, 400, 325, 'ball').setScale(0.25)
    this.goalRight = new Goal(this, 780, 325, 'goal').setScale(0.8)
    this.goal2 = new Goal(this, 20, 325, 'goal').setScale(0.5)
    this.otherPlayers = this.physics.add.group()
    this.player = this.createPlayers()
    // this.physics.add.collider(this.otherPlayers, this.ball)
    this.physics.add.overlap(this.ball, this.goalRight, function(
      ball,
      goalRight
    ) {
      ball.destroy()
    })

    this.cursors = this.input.keyboard.createCursorKeys()
    //this.createAnimations()

    //JOYSTICK CREATE
    this.joyStick = this.plugins
      .get('rexvirtualjoystickplugin')
      .add(this, {
        x: 700,
        y: 500,
        radius: 50,
        base: this.add.circle(0, 0, 50, 0x888888),
        thumb: this.add.circle(0, 0, 25, 0xcccccc),
        dir: '8dir', // 'up&down'|0|'left&right'|1|'4dir'|2|'8dir'|3
        forceMin: 2,
        enable: true
      })
      .on('update', this.dumpJoyStickState, this)

    this.text = this.add.text(0, 0)
    this.dumpJoyStickState()
    // this.otherPlayers.setCollideWorldBounds(true)

    //SCORE BOARD?
    this.add.text(200, 4, `Red: ${this.data.values.redScore}`, {
      fontSize: '32px',
      fill: '#f90202'
    })
    this.add.text(400, 4, `Blue: ${this.data.values.blueScore}`, {
      fontSize: '32px',
      fill: '#2f02f9'
    })
  }

  resetBallFunc(ball, goalRight) {}

  dumpJoyStickState() {
    var cursorKeys = this.joyStick.createCursorKeys()
    var s = 'Key down: '
    for (var name in cursorKeys) {
      if (cursorKeys[name].isDown) {
        s += name + ' '
      }
    }
    s += '\n'
    s += 'Force: ' + Math.floor(this.joyStick.force * 100) / 100 + '\n'
    s += 'Angle: ' + Math.floor(this.joyStick.angle * 100) / 100 + '\n'
    // this.text.setText(s)
  }

  updateJoystick() {
    if (
      this.joyStick.touchCursor.cursorKeys.left.isDown ||
      this.cursors.left.isDown
    ) {
      this.user.setVelocityX(-160)
      // this.player.anims.play("left", true);
    } else if (
      this.joyStick.touchCursor.cursorKeys.right.isDown ||
      this.cursors.right.isDown
    ) {
      this.user.setVelocityX(160)
      // this.user.anims.play("right", true);
    } else if (
      this.joyStick.touchCursor.cursorKeys.up.isDown ||
      this.cursors.up.isDown
    ) {
      this.user.setVelocityY(-160)
      // this.user.anims.play("right", true);
    } else if (
      this.joyStick.touchCursor.cursorKeys.down.isDown ||
      this.cursors.down.isDown
    ) {
      this.user.setVelocityY(160)
      // this.user.anims.play("left", true);
    } else if (!this.joyStick.touchCursor.cursorKeys.isDown) {
      // this.user.setVelocityX(0)
      // this.user.anims.play("turn");
    }
  }

  // time: total time elapsed (ms)
  // delta: time elapsed (ms) since last update() call. 16.666 ms @ 60fps
  update() {
    this.updateJoystick()

    if (this.user) {
      this.user.update(this.cursors)

      // emit user movement
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
    }

    if (this.ball) {
      let x = this.ball.x
      let y = this.ball.y

      if (
        this.ball.oldPosition &&
        (x !== this.ball.oldPosition.x || y !== this.ball.oldPosition.y)
      ) {
        this.socket.emit('ballMovement', {x: this.ball.x, y: this.ball.y})
      }

      this.ball.oldPosition = {
        x: this.ball.x,
        y: this.ball.y
      }
    }
  }
}
