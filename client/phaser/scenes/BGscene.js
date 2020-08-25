import Phaser from 'phaser'

export default class BgScene extends Phaser.Scene {
  constructor() {
    super('BgScene')
  }

  preload() {
    // Preload Sprites
    this.load.image('pitch', '/football-pitch.png')
    this.load.image('user', 'public/red.png')
    // << LOAD SPRITE HERE >>
  }

  create() {
    // Create Sprites
    this.add
      .image(0, 0, 'pitch')
      .setOrigin(0)
      .setScale(0.8)
    // << CREATE SPRITE HERE >>
  }
}
