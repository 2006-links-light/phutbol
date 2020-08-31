import 'phaser'
import React from '../config/jsx-dom-shim'
import socket from '../../sockets'

export default class LobbyScene extends Phaser.Scene {
  constructor() {
    super('LobbyScene')
    this.names = ['Bobby', 'Jake']
    this.name = ''
  }

  init(data) {
    this.names.push(data.name)
    this.name = data.name
    this.room = data.room
  }

  create() {
    // console.log(data)
    this.scene.launch('BgScene')
    this.add.text(300, 50, 'Room Code ' + this.room, {
      font: '25px Arial',
      fill: 'white'
    })
    var element = this.add.dom(
      400,
      300,
      <div>
        <div>Players:</div>
        <ul>
          {this.names.map(name => {
            return <li key={this.names.indexOf(name)}>{name}</li>
          })}
        </ul>
        <input
          type="button"
          name="startButton"
          value="Start Game"
          style="font-size: 32px"
        />
      </div>
    )
    element.addListener('click').on('click', event => {
      //  event.preventDefault()
      if (event.target.name === 'startButton') {
        socket.emit('join room', this.room, this.name)
        this.scene.start('MainScene', {
          room: this.room,
          names: this.names
        })
      }
    })
  }
}
