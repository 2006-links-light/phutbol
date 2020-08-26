import 'phaser'
import react from '../config/jsx-dom-shim'
import start from '../jsx/start.jsx'

export default class StartScene extends Phaser.Scene {
  constructor() {
    super('StartScene')
  }

  create() {
    this.scene.launch('BgScene')
    var element = this.add.dom(400, 300, start)
    element.addListener('click').on('click', event => {
      //  event.preventDefault()
      if (event.target.name === 'playButton') {
        var displayName = element.getChildByName('nameField')
        var roomCode = element.getChildByName('roomField')
        this.scene.start('LobbyScene', {
          room: roomCode.value,
          name: displayName.value
        })
      }
    })
  }
  update() {}
}
