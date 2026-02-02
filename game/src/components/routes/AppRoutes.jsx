import { Routes, Route, Navigate, Outlet } from 'react-router-dom'
import Overview from '../../pages/Overview'
import Auth from '../Auth'
import Lobby from '../../pages/Lobby'
import CreateCharacter from '../../pages/CreateCharacter'
import PhaserGame from '../../pages/PhaserGame'
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