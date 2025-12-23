export default class Character {
  constructor(scene, x, y, type, typeName, id) {
    this.scene = scene
    this.id = id
    this.type = type
    this.typeName = typeName

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
    this.isMoving = false
  }

  // For local player movement
  move(dir, speed) {
    const body = this.sprite.body
    body.setVelocity(0)

    if (!dir) {
      this.stop()
      this.isMoving = false
      return
    }

    this.isMoving = true
    body.setVelocity(dir.x * speed, dir.y * speed)

    if (dir.x < 0) this.lastDir = 'left'
    else if (dir.x > 0) this.lastDir = 'right'
    else if (dir.y < 0) this.lastDir = 'up'
    else if (dir.y > 0) this.lastDir = 'down'

    // Use unique animation key
    const animKey = `${this.typeName}-${this.lastDir}`
    this.sprite.anims.play(animKey, true)
  }

  // For remote player updates from server
  updateFromServer(state) {
    this.sprite.setPosition(state.x, state.y)
    
    if (state.dir) {
      this.lastDir = state.dir
    }
    
    // Check if the player is moving
    if (state.moving) {
      const animKey = `${this.typeName}-${this.lastDir}`
      this.sprite.anims.play(animKey, true)
      this.isMoving = true
    } else {
      // Player stopped moving
      this.stop()
      this.isMoving = false
    }
  }

  stop() {
    this.sprite.setVelocity(0)
    this.sprite.anims.stop()
    this.sprite.setFrame(this.type[this.lastDir].start)
  }
}