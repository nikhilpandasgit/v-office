import { useEffect, useState } from "react"
import apiCall from "../../lib/apiCall"
import { Navigate } from "react-router-dom"

export default function CharacterCheckRoute({ children }){
    const [hasCharacter, setHasCharacter] = useState(null)

    useEffect(() => {
        const checkCharacter = async() => {
            try{
                const response = await apiCall.get('/get-active-player-by-user-id')
                setHasCharacter(response.data.character !== null)
            } catch (error) {
                console.error('error fetching character', error)
                setHasCharacter(false)
            }
        }

        checkCharacter()
    }, [])

    if(hasCharacter === null){
        return (
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                minHeight: '100vh',
                backgroundColor: '#1a1a1a',
                color: '#fff'
            }}>
                <div>Loading...</div>
            </div>
        )
    }

    if(hasCharacter === false){
        return <Navigate to="/create-character" replace/>
    }

    return children
}