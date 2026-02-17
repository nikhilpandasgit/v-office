import { useEffect, useRef, useState } from 'react'
import Phaser from 'phaser'
import MainScene from './scenes/MainScene'
import { socket } from '../lib/socket'
import apiCall from '../lib/apiCall'

const PhaserGame = () => {
    const gameContainer = useRef(null)
    const game = useRef(null)
    const initialised = useRef(false);
    const [playerCharacter, setPlayerCharacter] = useState(null);
    const [allCharacters, setAllCharacters] = useState(null);

    // Get character details and all characters from server
    useEffect(() => {
        async function fetchCharacter() {
            const [data, getAllCharacters] = await Promise.all([
                apiCall.get('/get-character-sprite-details'),
                apiCall.get('/get-all-characters/', {
                    params: {
                        'get_sprites' : true 
                    }
                })
            ]);
            console.log(data);
            setPlayerCharacter(data);
            setAllCharacters(getAllCharacters);
        }
        fetchCharacter();
    }, [])

    // Set fetched character details in game registry
    useEffect(() => {
        if(!playerCharacter || !game.current) return;

        game.current.registry.set('currentPlayerCharacter', playerCharacter);
        game.current.registry.set('allCharacters', allCharacters);
        game.current.events.emit('allCharacters', allCharacters.data);

    }, [playerCharacter, allCharacters])
    
    // Setup socket event handlers
    useEffect(() => {
        if (game.current) return

        // Socket event handlers
        const handleInit = (data) => {
            if (game.current) {
                game.current.registry.set('clientId', data.playerId)
                game.current.registry.set('initialPlayers', data.players)
                game.current.events.emit('socket-init', data)
            }
        }

        const handleState = (players) => {
            if (game.current) {
                game.current.events.emit('socket-state', players)
            }
        }

        const handlePlayerJoined = (data) => {
            if (game.current) {
                game.current.events.emit('socket-player-joined', data)
            }
        }

        const handlePlayerLeft = (data) => {
            if (game.current) {
                game.current.events.emit('socket-player-left', data)
            }
        }

        // Register socket listeners
        socket.on('init', handleInit)
        socket.on('state', handleState)
        socket.on('player-joined', handlePlayerJoined)
        socket.on('player-left', handlePlayerLeft)

        if (!socket.connected) {
            socket.connect()
        }

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

        // Listen for input events from the scene
        const handleInput = (data) => {
            socket.emit('input', data)
        }

        game.current.events.on('player-input', handleInput)

        // Cleanup
        return () => {
            socket.off('init', handleInit)
            socket.off('state', handleState)
            socket.off('player-joined', handlePlayerJoined)
            socket.off('player-left', handlePlayerLeft)

            if (game.current) {
                game.current.events.off('player-input', handleInput)
                game.current?.destroy(true)
                game.current = null
            }
            socket.disconnect()
        }
    }, [])

    return (
        <div ref={gameContainer} id="game-container" />
    )
}

export default PhaserGame