import Phaser from 'phaser'

export default class Ball extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, spriteKey) {
    super(scene, x, y, spriteKey)
    this.scene = scene
    this.scene.physics.world.enable(this)
    this.scene.add.existing(this)
  }

  setBounce(x, y) {
    this.body.bounce.set(0.6)
    return this
  }
}
