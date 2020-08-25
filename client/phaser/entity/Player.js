import Phaser from 'phaser'

export default class Player extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, spriteKey) {
    super(scene, x, y, spriteKey)
    this.scene = scene
    this.scene.add.existing(this)
    this.scene.physics.world.enable(this)
    this.facingLeft = false

    // << INITIALIZE PLAYER ATTRIBUTES HERE >>
  }

  updateMovement(cursors) {
    if (cursors.left.isDown) {
      this.setVelocityX(-360)
      //make firebase call here to update player position
    } else if (cursors.right.isDown) {
      this.setVelocityX(360)
    } else if (cursors.up.isDown) {
      this.setVelocityY(-360)
    } else if (cursors.down.isDown) {
      this.setVelocityY(360)
    } else if (cursors.left.isDown && cursors.up.isDown) {
      this.setVelocityY(-360)
      this.setVelocityX(360)
    } else {
      this.setVelocityX(0)
      this.setVelocityY(0)
      this.play('idleUnarmed')
    }
  }

  // updateJump(cursors) {
  //   if (cursors.up.isDown ) {
  //     this.setVelocityY(-360);
  //   } else {
  //     this.setVelocityX(0);
  //     this.play('idleUnarmed');

  //   }
  // }

  // updateDown(cursors) {
  //   if (cursors.down.isDown ) {
  //     this.setVelocityY(360);
  //   } else {
  //     this.setVelocityX(0);
  //     this.play('idleUnarmed');

  //   }
  // }

  // updateInAir() {
  //   if (!this.body.touching.down) {
  //     this.play('jump');
  //   }
  // }

  // Check which controller button is being pushed and execute movement & animation
  update(cursors) {
    // << INSERT CODE HERE >>
    this.updateMovement(cursors)
    // console.log("x axis " + this.player.x);
    // console.log("y axis " + this.player.y);
    // this.updateJump(cursors)
    // this.updateInAir();
    // this.updateDown(cursors)
  }
}
