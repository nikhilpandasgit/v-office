import { useEffect, useState } from 'react'
import { supabase } from '../../utils/supabase'
import { useNavigate } from 'react-router-dom'

export default function Overview() {
  const navigate = useNavigate()
  const [user, setUser] = useState(null)

  useEffect(() => {
    // Check active session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
          setUser(session.user)
      } else {
          // If no session, potentially redirect to auth or just show guest state
          // For now, let's just stay here.
      }
    })
  }, [])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    navigate('/')
  }

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      minHeight: '100%',
      backgroundColor: '#1a1a1a',
      color: '#fff',
    }}>
      {/* Header */}
      <header style={{
        padding: '1rem 2rem',
        borderBottom: '1px solid #333',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <h1 style={{ margin: 0, fontSize: '1.5rem', color: '#646cff' }}>V-Office</h1>
        <div>
           {user ? (
               <div style={{display: 'flex', gap: '1rem', alignItems: 'center'}}>
                   <span style={{color: '#aaa'}}>{user.email}</span>
                   <button onClick={handleSignOut} style={{
                       padding: '0.5rem 1rem',
                       backgroundColor: '#333',
                       border: 'none',
                       borderRadius: '4px',
                       color: '#fff',
                       cursor: 'pointer'
                   }}>Sign Out</button>
               </div>
           ) : (
             <button onClick={() => navigate('/auth')} style={{
                padding: '0.5rem 1rem',
                backgroundColor: '#646cff',
                border: 'none',
                borderRadius: '4px',
                color: '#fff',
                cursor: 'pointer'
             }}>Sign In</button>
           )}
        </div>
      </header>
      
      {/* Main Content */}
      <main style={{
          flex: 1,
          overflowY: 'auto',
          padding: '4rem 2rem',
          maxWidth: '1200px',
          margin: '0 auto',
          width: '100%'
      }}>
          <h2 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>Welcome to Your Virtual HQ</h2>
          <p style={{ fontSize: '1.2rem', color: '#aaa', maxWidth: '600px', lineHeight: '1.6' }}>
              Connect with your team in a 2D immersive space. Walk up to colleagues to talk, collaborate on whiteboards, and customize your workspace.
          </p>

          <div style={{ marginTop: '3rem', display: 'flex', gap: '1rem' }}>
              <button 
                onClick={() => navigate('/lobby')}
                style={{
                  padding: '1rem 2rem',
                  fontSize: '1.1rem',
                  backgroundColor: '#646cff',
                  border: 'none',
                  borderRadius: '6px',
                  color: '#fff',
                  cursor: 'pointer',
                  fontWeight: 'bold',
                  boxShadow: '0 4px 14px 0 rgba(100, 108, 255, 0.39)'
                }}
              >
                  Enter Office
              </button>
              
              <button 
                 style={{
                  padding: '1rem 2rem',
                  fontSize: '1.1rem',
                  backgroundColor: 'transparent',
                  border: '1px solid #444',
                  borderRadius: '6px',
                  color: '#fff',
                  cursor: 'pointer'
                }}
              >
                  Customize Character
              </button>
          </div>
          
          {/* Feature Grid */}
          <div style={{ marginTop: '5rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem'}}>
             <div style={{ padding: '1.5rem', backgroundColor: '#252525', borderRadius: '8px' }}>
                 <h3 style={{marginTop: 0}}>Spatial Audio</h3>
                 <p style={{color: '#aaa'}}>Hear people get louder as you walk closer to them.</p>
             </div>
             <div style={{ padding: '1.5rem', backgroundColor: '#252525', borderRadius: '8px' }}>
                 <h3 style={{marginTop: 0}}>Custom Maps</h3>
                 <p style={{color: '#aaa'}}>Design your perfect office layout with Tiled.</p>
             </div>
             <div style={{ padding: '1.5rem', backgroundColor: '#252525', borderRadius: '8px' }}>
                 <h3 style={{marginTop: 0}}>Interactive Objects</h3>
                 <p style={{color: '#aaa'}}>Embed whiteboards, videos, and documents.</p>
             </div>
          </div>

      </main>
    </div>
  )
}
