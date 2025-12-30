import { supabase } from "../lib/supabase";
import { useNavigate } from "react-router-dom";

export default function Header({ user }) {
    const navigate = useNavigate();

    const handleSignOut = async () => {
        await supabase.auth.signOut()
        navigate('/')
    }

    return (
        <header
            style={{
                padding: '1rem 2rem',
                borderBottom: '1px solid #333',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
            }}
        >
            <h1 style={{ margin: 0, fontSize: '1.5rem', color: '#646cff' }}>
                V-Office
            </h1>

            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                <span style={{ color: '#aaa' }}>{user?.email}</span>

                <button
                    onClick={handleSignOut}
                    style={{
                        padding: '0.5rem 1rem',
                        backgroundColor: '#333',
                        border: 'none',
                        borderRadius: '4px',
                        color: '#fff',
                        cursor: 'pointer',
                    }}
                >
                    Sign Out
                </button>
            </div>
        </header>
    )
}
