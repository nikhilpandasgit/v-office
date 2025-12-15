import Phaser from 'phaser'

export default class MainScene extends Phaser.Scene {
  constructor() {
    super('MainScene')
  }

  preload() {
    // tileset image (used by external TSX)
    this.load.image('spritesheet', '/assets/spritesheet.png')

    // tiled map
    this.load.tilemapTiledJSON('map', '/assets/map.json')

    // player
    this.load.image('player', '/assets/player.png')
  }

  create() {
    /* --- MAP --- */
    const map = this.make.tilemap({ key: 'map' })

    const tileset = map.addTilesetImage(
      'spritesheet', // tileset NAME inside spritesheet.tsx
      'spritesheet'  // image key loaded above
    )

    // Order matters (bottom → top)
    const ground = map.createLayer('ground', tileset, 0, 0)
    const paths = map.createLayer('paths', tileset, 0, 0)
    const decor = map.createLayer(
      'plants-and-buildings-and-trees',
      tileset,
      0,
      0
    )
    const ladders = map.createLayer('ladders', tileset, 0, 0)
    const boundaries = map.createLayer('boundaries', tileset, 0, 0)

    boundaries.setCollisionByProperty({ collides: true })

    /* --- SPAWN POINT --- */
    const spawnLayer = map.getObjectLayer('spawnpoints')
    const spawn = spawnLayer.objects[0]

    this.player = this.physics.add.sprite(
      spawn.x,
      spawn.y,
      'player'
    )

    this.player.setCollideWorldBounds(true)
    this.physics.add.collider(this.player, boundaries)

    /* --- CAMERA --- */
    this.cameras.main.setBounds(
      0,
      0,
      map.widthInPixels,
      map.heightInPixels
    )

    this.cameras.main.startFollow(this.player, true, 0.1, 0.1)
    this.cameras.main.setZoom(1.25)

    /* --- INPUT --- */
    this.cursors = this.input.keyboard.createCursorKeys()
  }

  update() {
    const speed = 180
    this.player.setVelocity(0)

    if (this.cursors.left.isDown) this.player.setVelocityX(-speed)
    else if (this.cursors.right.isDown) this.player.setVelocityX(speed)

    if (this.cursors.up.isDown) this.player.setVelocityY(-speed)
    else if (this.cursors.down.isDown) this.player.setVelocityY(speed)
  }
}
