import { useEffect, useRef } from 'react'
import Phaser from 'phaser'
import MainScene from '../scenes/MainScene'

const PhaserGame = () => {
    const gameContainer = useRef(null)
    const game = useRef(null)

    useEffect(() => {
        if (game.current) return

        const config = {
            type: Phaser.AUTO,
            parent: gameContainer.current,
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

        game.current = new Phaser.Game(config)

        return () => {
            if (game.current) {
                game.current.destroy(true)
                game.current = null
            }
        }
    }, [])

    return (
        <div ref={gameContainer} id="game-container" />
    )
}

export default PhaserGame
