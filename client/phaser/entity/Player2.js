import Phaser from 'phaser'

export default class Player2 extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, spriteKey) {
    super(scene, x, y, spriteKey)
    this.scene = scene
    this.scene.add.existing(this)
    this.scene.physics.world.enable(this)
    this.facingLeft = false

    // << INITIALIZE PLAYER ATTRIBUTES HERE >>
  }

  updateMovement(pointer) {}

  // Check which controller button is being pushed and execute movement & animation
  update(pointer) {
    // << INSERT CODE HERE >>
    this.updateMovement(pointer)
    // this.updateJump(cursors)
    // this.updateInAir();
    // this.updateDown(cursors)
  }
}
