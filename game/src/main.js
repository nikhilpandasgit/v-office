import Phaser from 'phaser'
import MainScene from './scenes/MainScene.js'

const config = {
  type: Phaser.AUTO,

  parent: 'game-container',

  width: 800,
  height: 600,

  backgroundColor: '#000000',

  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 0 },
      debug: false
    }
  },

  scene: [MainScene]
}

new Phaser.Game(config)
