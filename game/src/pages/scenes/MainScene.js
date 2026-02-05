import Phaser from 'phaser'
import Character from '../../lib/Character'
import { PLAYER_TYPES } from '../../utils/CharacterTypes'

export default class MainScene extends Phaser.Scene {
  constructor() {
    super('MainScene')
    this.characters = new Map() // all characters in game
    this.currentPlayer = null // current player
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
    // Map render
    const map = this.make.tilemap({ key: 'map' })
    const tileset = map.addTilesetImage('spritesheet', 'spritesheet')

    map.createLayer('ground', tileset)
    map.createLayer('ladders and paths', tileset)
    map.createLayer('plants-and-buildings-and-trees', tileset)

    this.physics.world.setBounds(0, 0, map.widthInPixels, map.heightInPixels)

    // Boundaries and collisions
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

    // Camera setup
    this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels)
    this.cameras.main.setZoom(2)

    // Keyboard input
    this.cursors = this.input.keyboard.createCursorKeys()

    // Setup socket listeners after assets are loaded
    this.setupSocketListeners()
  }

  setupSocketListeners() {
    this.game.events.removeAllListeners('socket-init');
    this.game.events.removeAllListeners('socket-state');
    this.game.events.removeAllListeners('socket-player-joined');
    this.game.events.removeAllListeners('socket-player-left');

    // Create animations for all character types
    this.game.events.on('allCharacters', (allCharacters) => {
      allCharacters.forEach(character => {
        this.createCharacterAnimations(
          character.sprite_key,
          character.character_animation
        );
      });
    });

    this.game.events.on('socket-init', (data) => {
      if (this.currentPlayer) return;
      this.currentPlayer = data.playerId

      Object.entries(data.players).forEach(([id, state]) => {
        this.createCharacter(id, state)
      })
    })

    this.game.events.on('socket-state', (players) => {
      Object.entries(players).forEach(([id, state]) => {
        this.updateCharacter(id, state)
      })

      // Remove characters that are no longer in the game
      this.characters.forEach((char, id) => {
        if (!players[id]) {
          this.removeCharacter(id)
        }
      })
    })

    this.game.events.on('socket-player-joined', (data) => {
      if (this.characters.has(data.playerId)) {
        return
      }
      this.createCharacter(data.playerId, data.state)
    })

    this.game.events.on('socket-player-left', (data) => {
      this.removeCharacter(data.playerId)
    })
  }

  createCharacter(id, state) {
    if (this.characters.has(id)) {
      return
    }

    // Determine player type based on player ID
    const playerNumber = parseInt(id.split('-')[1])
    const typeName = playerNumber === 1 ? 'type1' : 'type2'
    const type = PLAYER_TYPES[typeName]
    const char = new Character(
      this,
      state.x,
      state.y,
      type,
      typeName,
      id
    )
    
    this.characters.set(id, char)
    this.physics.add.collider(char.sprite, this.boundaries)
    
    // Follow local character with camera
    if (id === this.currentPlayer) {
      this.cameras.main.startFollow(char.sprite, true, 0.1, 0.1)
    }
  }

  updateCharacter(id, state) {
    let char = this.characters.get(id)
    
    if (!char) {
      this.createCharacter(id, state)
      return
    }
    
    // Update other players except local player
    if (id !== this.currentPlayer) {
      char.updateFromServer(state)
    }
  }

  removeCharacter(id) {
    const char = this.characters.get(id)
    if (char) {
      char.sprite.destroy()
      this.characters.delete(id)
    }
  }

  update() {
    const localChar = this.characters.get(this.currentPlayer)
    if (!localChar) return

    const speed = 50
    let dir = null
    
    if (this.cursors.left.isDown) dir = { x: -1, y: 0 }
    else if (this.cursors.right.isDown) dir = { x: 1, y: 0 }
    else if (this.cursors.up.isDown) dir = { x: 0, y: -1 }
    else if (this.cursors.down.isDown) dir = { x: 0, y: 1 }
    
    localChar.move(dir, speed)
    
    // Emit input to server with movement state
    // this.game.events.emit('player-input', {
    //   state: {
    //     x: localChar.sprite.x,
    //     y: localChar.sprite.y,
    //     dir: localChar.lastDir,
    //     moving: dir !== null
    //   }
    // })
  }

  createCharacterAnimations(typeName, animations) {
    animations.forEach(anim => {
      const animKey = `${typeName}-${anim.direction}`;

      if (this.anims.exists(animKey)) return;

      this.anims.create({
        key: animKey,
        frames: anim.frames.map(frame => ({
          key: 'sprite',
          frame
        })),
        frameRate: 8,
        repeat: -1
      });
    });
  }

  createPlayerAnimations(typeName, type) {
    const anims = this.anims;
    ['left', 'right', 'up', 'down'].forEach(dir => {
      // Create unique animation key for each character type
      const animKey = `${typeName}-${dir}`
      
      if (!anims.exists(animKey)) {
        anims.create({
          key: animKey,
          frames: anims.generateFrameNumbers(type.spriteKey, type[dir]),
          frameRate: 8,
          repeat: -1
        })
      }
    })
  }
}