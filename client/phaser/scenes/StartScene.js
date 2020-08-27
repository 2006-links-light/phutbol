import 'phaser'
import React from '../config/jsx-dom-shim'
import start from '../jsx/start.jsx'

export default class StartScene extends Phaser.Scene {
  constructor() {
    super('StartScene')
  }

  create() {
    this.scene.launch('BgScene')
    var element = this.add.dom(
      400,
      300,
      <div>
        <input
          type="text"
          name="nameField"
          placeholder="Display Name"
          style="font-size: 32px"
        />
        <input
          type="text"
          name="roomField"
          placeholder="Room Code"
          style="font-size: 32px"
        />
        <input
          type="button"
          name="playButton"
          value="Let's Play"
          style="font-size: 32px"
        />
      </div>
    )
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
