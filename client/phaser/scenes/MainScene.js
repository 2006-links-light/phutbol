import Phaser from 'phaser'

// function addPlayer(self, playerInfo) {
//   self.user = self.physics.add
//     .image(playerInfo.x, playerInfo.y, 'user')
//     .setOrigin(0.5, 0.5)
//     .setDisplaySize(53, 40)
//   if (playerInfo.team === 'blue') {
//     self.user.setTint(0x0000ff)
//   } else {
//     self.user.setTint(0xff0000)
//   }
//   self.user.setDrag(100)
//   self.user.setAngularDrag(100)
//   self.user.setMaxVelocity(200)
// }
// function addOtherPlayers(self, playerInfo) {
//   const otherPlayer = self.add
//     .sprite(playerInfo.x, playerInfo.y, 'otherPlayer')
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

export default class MainScene extends Phaser.Scene {
  constructor() {
    super('MainScene')
  }

  // preload() {
  //   this.load.image('user', 'public/red.png')
  // }

  create() {
    this.scene.launch('BgScene')
    this.scene.launch('FgScene')
    // << LOAD BACKGROUND AND FOREGROUND SCENES IN PARALLEL HERE >>
    // var self = this
    // this.socket = io()
    // this.otherPlayers = this.physics.add.group()
    // this.socket.on('currentPlayers', function (players) {
    //   Object.keys(players).forEach(function (id) {
    //     if (players[id].playerId === self.socket.id) {
    //       addPlayer(self, players[id])
    //     } else {
    //       addOtherPlayers(self, players[id])
    //     }
    //   })
    // })
    // this.socket.on('newPlayer', function (playerInfo) {
    //   addOtherPlayers(self, playerInfo)
    // })
    // this.socket.on('disconnect', function (playerId) {
    //   self.otherPlayers.getChildren().forEach(function (otherPlayer) {
    //     if (playerId === otherPlayer.playerId) {
    //       otherPlayer.destroy()
    //     }
    //   })
    // })
    // this.cursors = this.input.keyboard.createCursorKeys()
  }

  // update() {
  //   if (this.user) {
  //     if (this.cursors.left.isDown) {
  //       this.user.setAngularVelocity(-150)
  //     } else if (this.cursors.right.isDown) {
  //       this.user.setAngularVelocity(150)
  //     } else {
  //       this.user.setAngularVelocity(0)
  //     }

  //     if (this.cursors.up.isDown) {
  //       this.physics.velocityFromRotation(
  //         this.user.rotation + 1.5,
  //         100,
  //         this.user.body.acceleration
  //       )
  //     } else {
  //       this.user.setAcceleration(0)
  //     }

  //     this.physics.world.wrap(this.user, 5)
  //   }
  // }
}
