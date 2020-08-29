import Phaser from 'phaser'
import Player from '../entity/player.js'
import Ball from '../entity/ball.js'
import socket from '../../sockets'

function addPlayer(self, playerInfo) {
  self.user = new Player(self, 50, 325, 'user').setScale(0.25)
  self.user.setDrag(100)
  self.user.setAngularDrag(100)
  self.user.setCollideWorldBounds(true)
  self.user.setDepth(0)

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
  createPlayers() {
    socket.emit('getPlayers')
  }

  preload() {
    this.socket = socket
    this.data.values.redScore = 0
    this.data.values.blueScore = 0
    var redScoreText
    var blueScoreText
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

    // JOYSTICK
    var url

    url =
      'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexvirtualjoystickplugin.min.js'
    this.load.plugin('rexvirtualjoystickplugin', url, true)
  }

  createGround(x, y) {
    this.groundGroup.create(x, y, 'ground')
  }

  create() {
    this.initializeSockets()
    console.log('thisthisthisthisthis', this)
    console.log('USER', this.user)
    this.scene.physics.world.enable(this)
    this.otherPlayers = this.physics.add.group()
    this.ball = new Ball(this, 400, 325, 'ball').setScale(0.25)
    this.ball.setBounce(0.6)
    this.ball.setDepth(0)
    this.ball.setCollideWorldBounds(true)
    this.player = this.createPlayers()

    this.physics.add.collider(this.physics.user, this.ball)
    // this.physics.add.collider(this.otherPlayers, this.ball)
    // this.physics.add.collider(this.user, this.otherPlayers)
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

    //SCORE BOARD?
    this.redScoreText = this.add.text(
      200,
      4,
      `Red: ${this.data.values.redScore}`,
      {
        fontSize: '32px',
        fill: '#f90202'
      }
    )
    this.blueScoreText = this.add.text(
      400,
      4,
      `Blue: ${this.data.values.blueScore}`,
      {
        fontSize: '32px',
        fill: '#2f02f9'
      }
    )
  }

  //scoreGoal function
  // scoreGoal(ball, goal) {
  //   ball.disableBody(true, true)

  //   score += 1
  // if player.team === blue
  //   blueScoreText.setText('Blue: ' + score)

  // if player.team === red
  //   redScoretext.setText('Blue: ' + score)
  // }

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

  // time: total time elapsed (ms)
  // delta: time elapsed (ms) since last update() call. 16.666 ms @ 60fps
  update() {
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
  }
}
