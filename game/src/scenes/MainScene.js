import Phaser from 'phaser'

const PLAYER_TYPES = {
  type1: {
    spriteKey: 'sprite',
    frame: 936,
    left: { start: 1053, end: 1056 },
    right: { start: 975, end: 978 },
    up: { start: 1014, end: 1017 },
    down: { start: 936, end: 939 }
  }
}

export default class MainScene extends Phaser.Scene {
  constructor() {
    super('MainScene')
  }

  preload() {
    this.load.tilemapTiledJSON('map', '/assets/map.json')
    this.load.image('spritesheet', '/assets/spritesheet.png')
    this.load.spritesheet('sprite', '/assets/spritesheet.png', {
      frameWidth: 16,
      frameHeight: 16
    })
  }

  create() {
    /* ---------------- MAP ---------------- */
    const map = this.make.tilemap({ key: 'map' })
    const tileset = map.addTilesetImage('spritesheet', 'spritesheet')

    map.createLayer('ground', tileset, 0, 0)
    map.createLayer('ladders and paths', tileset, 0, 0)
    map.createLayer('plants-and-buildings-and-trees', tileset, 0, 0)

    this.physics.world.setBounds(
      0,
      0,
      map.widthInPixels,
      map.heightInPixels
    )
    /* ---------------- SPAWNPOINT ---------------- */
    const spawnLayer = map.getObjectLayer('spawnpoints')
    if (!spawnLayer || spawnLayer.objects.length === 0) {
      throw new Error('No spawnpoints found (object layer)')
    }

    const spawn = Phaser.Utils.Array.GetRandom(spawnLayer.objects)

    /* ---------------- PLAYER ---------------- */
    const type = PLAYER_TYPES.type1

    this.player = this.physics.add.sprite(
      spawn.x,
      spawn.y,
      type.spriteKey,
      type.frame
    )

    this.player.body.setSize(7, 9)
    this.player.body.setOffset(3, 4)
    this.player.setCollideWorldBounds(true)

    this.createPlayerAnimations(type)

    /* ---------------- BOUNDARIES (OBJECT LAYER COLLISION) ---------------- */
    const boundaryLayer = map.getObjectLayer('boundaries')

    if (!boundaryLayer) {
      throw new Error('Object layer "boundaries" not found')
    }

    this.boundaries = this.physics.add.staticGroup()

    boundaryLayer.objects.forEach(obj => {
      const rect = this.add.rectangle(
        obj.x + obj.width / 2,
        obj.y + obj.height / 2,
        obj.width,
        obj.height
      )

      this.physics.add.existing(rect, true)
      this.boundaries.add(rect)
    })

    this.physics.add.collider(this.player, this.boundaries, (player, boundary) => {
      console.log('Colliding with boundary:', boundary)
    })


    /* ---------------- CAMERA ---------------- */
    this.cameras.main.setBounds(
      0,
      0,
      map.widthInPixels,
      map.heightInPixels
    )

    this.cameras.main.startFollow(this.player, true, 0.1, 0.1)
    this.cameras.main.setZoom(2)

    /* ---------------- INPUT ---------------- */
    this.cursors = this.input.keyboard.createCursorKeys()
    this.lastDir = 'down'
  }

  createPlayerAnimations(type) {
    const anims = this.anims

    anims.create({
      key: 'left',
      frames: anims.generateFrameNumbers(type.spriteKey, type.left),
      frameRate: 8,
      repeat: -1
    })

    anims.create({
      key: 'right',
      frames: anims.generateFrameNumbers(type.spriteKey, type.right),
      frameRate: 8,
      repeat: -1
    })

    anims.create({
      key: 'up',
      frames: anims.generateFrameNumbers(type.spriteKey, type.up),
      frameRate: 8,
      repeat: -1
    })

    anims.create({
      key: 'down',
      frames: anims.generateFrameNumbers(type.spriteKey, type.down),
      frameRate: 8,
      repeat: -1
    })
  }

  update() {
    const speed = 50
    this.player.setVelocity(0)

    if (this.cursors.left.isDown) {
      this.player.setVelocityX(-speed)
      this.player.anims.play('left', true)
      this.lastDir = 'left'
    } else if (this.cursors.right.isDown) {
      this.player.setVelocityX(speed)
      this.player.anims.play('right', true)
      this.lastDir = 'right'
    } else if (this.cursors.up.isDown) {
      this.player.setVelocityY(-speed)
      this.player.anims.play('up', true)
      this.lastDir = 'up'
    } else if (this.cursors.down.isDown) {
      this.player.setVelocityY(speed)
      this.player.anims.play('down', true)
      this.lastDir = 'down'
    } else {
      this.player.anims.stop()
      this.player.setFrame(PLAYER_TYPES.type1[this.lastDir].start)
    }
  }
}
