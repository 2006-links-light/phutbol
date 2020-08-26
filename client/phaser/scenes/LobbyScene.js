import 'phaser'

export default class LobbyScene extends Phaser.Scene {
  constructor() {
    super('LobbyScene')
    this.names = ['Bobby', 'Jake']
  }
  init(data) {
    this.names.push(data.name)
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
            return <li>{name}</li>
          })}
        </ul>
      </div>
    )
  }
}
