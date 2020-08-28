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

  init(data) {
    this.names = data.names
    this.room = data.room
    console.log(this.names, this.room)
  }

  create() {
    this.scene.launch('BgScene')
    this.scene.launch('FgScene')
    // << LOAD BACKGROUND AND FOREGROUND SCENES IN PARALLEL HERE >>
  }
}
