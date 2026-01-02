import { Routes, Route, Navigate, Outlet } from 'react-router-dom'
import Overview from '../../scenes/pages/Overview'
import Auth from '../../scenes/pages/Auth'
import Lobby from '../../scenes/pages/Lobby'
import CreateCharacter from '../../scenes/pages/CreateCharacter'
import PhaserGame from '../PhaserGame'
import CharacterCheckRoute from './CharacterCheckRoute'

function ProtectedLayout({session}){
    if(!session){
        return <Navigate to="/auth" replace/>
    }
    return <Outlet/>
}

export default function AppRoutes({session}) {
    return (
        <Routes>
            {/* Unprotected routes */}
            <Route path="/" element={!session ? <Auth /> : <Navigate to="/overview" />} />
            <Route path="/auth" element={!session ? <Auth /> : <Navigate to="/overview" />} />
            
            <Route element={<ProtectedLayout session={session}/>}>
                <Route path="/overview" element={
                    <CharacterCheckRoute>
                        <Overview session={session}/>
                    </CharacterCheckRoute>
                    }/>
                <Route path="/lobby" element={<Lobby />} />
                <Route path="/game" element={<PhaserGame />} />
                <Route path="/create-character" element={<CreateCharacter session={session}/>} />
            </Route>

        </Routes>
    )
}   