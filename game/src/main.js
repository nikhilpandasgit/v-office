import Phaser from 'phaser'
import MainScene from './scenes/MainScene.js'

const config = {
  type: Phaser.AUTO,
  parent: 'game-container',
  width: 600,
  height: 550,
  zoom: 1,
  backgroundColor: '#000000',
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 0 },
      // debug: true
    }
  },
  scene: [MainScene]
}

new Phaser.Game(config)
