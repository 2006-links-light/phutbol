import Phaser from 'phaser'

export default {
  type: Phaser.AUTO, // Specify the underlying browser rendering engine (AUTO, CANVAS, WEBGL)
  // AUTO will attempt to use WEBGL, but if not available it'll default to CANVAS
  width: 800, // Game width in pixels
  height: 640, // Game height in pixels
  render: {
    pixelArt: true
  },
  parent: 'phutbol',
  dom: {
    createContainer: true
  },
  physics: {
    default: 'arcade',
    arcade: {
      gravity: {y: 0, x: 0}, // Game objects will be pulled down along the y-axis
      // The number 1500 is arbitrary. The higher, the stronger the pull.
      // A negative value will pull game objects up along the y-axis
      debug: false // Whether physics engine should run in debug mode
    },
    scene: {
      preload: preload,
      create: create,
      update: update
    }
  }
}

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
function preload() {
  // this.load.image('user', 'public/red.png')
  this.game.load.bitmapFont(
    'pixelFont',
    '../../public/font/font.png',
    '../../public/font/font.fnt'
  )
}

function create() {
  // var self = this
  // this.socket = io()
  // this.socket.on('currentPlayers', function (players) {
  //   Object.keys(players).forEach(function (id) {
  //     if (players[id].playerId === self.socket.id) {
  //       addPlayer(self, players[id])
  //     }
  //   })
  // })
}

function update() {}
