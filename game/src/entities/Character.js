export default class Character {
  constructor(scene, x, y, type, id) {
    this.scene = scene
    this.id = id
    this.type = type

    this.sprite = scene.physics.add.sprite(
      x,
      y,
      type.spriteKey,
      type.frame
    )

    // Physics body
    this.sprite.body.setSize(7, 9)
    this.sprite.body.setOffset(3, 4)
    this.sprite.setCollideWorldBounds(true)

    this.lastDir = 'down'
  }

  applyInput(dir, speed){
    const body = this.sprite.body
    body.setVelocity(0)

    if(!dir){
      this.stop()
      return
    }

    body.setVelocity(dir.x * speed, dir.y * speed)
    this.updateDirection(dir)
    this.sprite.anims.play(this.lastDir, true)
  }

  applyServerState(state){
    this.sprite.setPosition(state.x,state.y)

    if(state.dir && state.dir !== this.lastDir){
      this.lastDir = state.dir
      this.sprite.anims.play(this.lastDir, true)
    }
  }

  stop() {
    this.sprite.setVelocity(0)
    this.sprite.anims.stop()
    this.sprite.setFrame(this.type[this.lastDir].start)
  }

  updateDirection(dir){
    if (dir.x < 0) this.lastDir = 'left'
    else if (dir.x > 0) this.lastDir = 'right'
    else if (dir.y < 0) this.lastDir = 'up'
    else if (dir.y > 0) this.lastDir = 'down'
  }

  move(dir, speed) {
    const body = this.sprite.body
    body.setVelocity(0)

    if (!dir) {
      this.stop()
      return
    }

    body.setVelocity(dir.x * speed, dir.y * speed)

    if (dir.x < 0) this.lastDir = 'left'
    else if (dir.x > 0) this.lastDir = 'right'
    else if (dir.y < 0) this.lastDir = 'up'
    else if (dir.y > 0) this.lastDir = 'down'

    this.sprite.anims.play(this.lastDir, true)
  }
}
