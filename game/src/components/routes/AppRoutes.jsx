import { Routes, Route, Navigate } from 'react-router-dom'
import Overview from '../../scenes/pages/Overview'
import Auth from '../../scenes/pages/Auth'
import Lobby from '../../scenes/pages/Lobby'
import PhaserGame from '../PhaserGame'
import ProtectedRoute from './ProtectedRoute'

export default function AppRoutes({session}) {
    return (
        <Routes>
            <Route path="/" element={!session ? <Auth /> : <Navigate to="/overview" />} />
            <Route path="/auth" element={!session ? <Auth /> : <Navigate to="/overview" />} />
            <Route
                path="/overview"
                element={
                    <ProtectedRoute session={session}>
                        <Overview />
                    </ProtectedRoute>
                }
            />
            <Route path="/lobby"
                element={
                    <ProtectedRoute session={session}>
                        <Lobby />
                    </ProtectedRoute>
                }
            />
            <Route path="/game"
                element={
                    <ProtectedRoute session={session}>
                        <PhaserGame />
                    </ProtectedRoute>
                }
            />
        </Routes>
    )
}   