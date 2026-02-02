import { Navigate, Outlet } from "react-router-dom"
import { useQuery } from "@tanstack/react-query"
import apiCall from "../../lib/apiCall"

export default function CharacterCheckRoute({ children }){

    const { data, isLoading, isError } = useQuery({
        queryKey: ["hasCharacter"],
        queryFn: async () => {
            const res = await apiCall.get("/get-active-player-by-user-id")
            return res.data.character !== null
        },
        staleTime: Infinity,
        gcTime: Infinity,
        retry: 1,
    })

    if (isLoading) {
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

    if ( isError || !data ) return <Navigate to="/create-character" replace />

    return children
}