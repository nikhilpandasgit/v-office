import Phaser from 'phaser'
// import { getEntityLocation } from '../utils/coordinates'
import { socket } from '../lib/socket'
import Character from '../entities/Character'
import { PLAYER_TYPES } from '../utils/CharacterTypes'

export default class MainScene extends Phaser.Scene {
  constructor() {
    super('MainScene')
    this.characters = new Map()
    this.clientId = null
    this.seq = 0
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

    map.createLayer('ground', tileset)
    map.createLayer('ladders and paths', tileset)
    map.createLayer('plants-and-buildings-and-trees', tileset)

    this.physics.world.setBounds(0, 0, map.widthInPixels, map.heightInPixels)

    // /* ---------------- SPAWNPOINT ---------------- */
    // const spawnLayer = map.getObjectLayer('spawnpoints')
    // if (!spawnLayer || spawnLayer.objects.length === 0) {
    //   throw new Error('No spawnpoints found')
    // }
    // console.log(spawnLayer);
    // const spawn = Phaser.Utils.Array.GetRandom(spawnLayer.objects)

    /* ---------------- ANIMATIONS (ONCE) ---------------- */
    Object.values(PLAYER_TYPES).forEach((playerType) => {
      this.createPlayerAnimations(playerType)
    })

    // /* ---------------- CHARACTERS ---------------- */
    // const playerChar = new Character(
    //   this,
    //   spawn.x,
    //   spawn.y,
    //   PLAYER_TYPES.type1,
    //   'player-1'
    // )

    // const player2Char = new Character(
    //   this,
    //   spawn.x + 20,
    //   spawn.y + 20,
    //   PLAYER_TYPES.type2,
    //   'player-2'
    // )
    // this.characters.set(playerChar.id, playerChar)
    // this.characters.set(player2Char.id, player2Char)

    // if(!localStorage.getItem('gameState')){
    //   localStorage.setItem(
    //     'gameState',
    //     JSON.stringify({ characters : this.characters})
    //   )
    // }
    /* ---------------- BOUNDARIES ---------------- */
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

    this.characters.forEach(char => {
      this.physics.add.collider(char.sprite, this.boundaries)
    })

    /* ---------------- CAMERA ---------------- */
    this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels)
    this.cameras.main.startFollow(localChar.sprite, true, 0.1, 0.1)
    this.cameras.main.setZoom(2)

    /* ---------------- INPUT ---------------- */
    this.cursors = this.input.keyboard.createCursorKeys()

    /* ---------- NETWORK ---------- */
    socket.on('init', ({ playerId, players }) => {
      const char = new Character(
        this,
        state.x,
        state.y,
        PLAYER_TYPES.type1,
        id
      )
      this.characters.set(id, char)
    })

    const localChar = this.characters.get(this.clientId)

  }

  update() {
    const raw = localStorage.getItem('gameState')
    const state = raw ? JSON.parse(raw) : {characters : {}}

    this.characters.forEach(char => {
      if (char.id === this.clientId){
        const speed = 50
        let dir = null

        if (this.cursors.left.isDown) dir = { x: -1, y: 0 }
        else if (this.cursors.right.isDown) dir = { x: 1, y: 0 }
        else if (this.cursors.up.isDown) dir = { x: 0, y: -1 }
        else if (this.cursors.down.isDown) dir = { x: 0, y: 1 }

        char.move(dir, speed)

        state.characters[char.id] = {
          x: char.sprite.x,
          y: char.sprite.y,
          dir: char.lastDir
        }
      } else {
        const data = state.characters[char.id];
        if(!data) return

        char.sprite.setPosition(data.x, data.y)
        char.sprite.anims.play(data.dir, true)
      }
    })
    // localStorage.setItem('gameState', JSON.stringify(state));
  }

  createPlayerAnimations(type) {
    const anims = this.anims;
    ['left', 'right', 'up', 'down'].forEach(dir => {
      anims.create({
        key: dir,
        frames: anims.generateFrameNumbers(type.spriteKey, type[dir]),
        frameRate: 8,
        repeat: -1
      })
    })
  }
}
