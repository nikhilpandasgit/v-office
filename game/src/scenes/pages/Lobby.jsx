import { useNavigate } from 'react-router-dom'

export default function Lobby() {
  const navigate = useNavigate()

  const maps = [
    { id: 1, name: 'Default Office', description: 'The classic v-office layout.' },
    // more maps can be added here
  ]

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100vh',
      backgroundColor: '#1a1a1a',
      color: '#fff',
    }}>
      <h1>Lobby</h1>
      <p style={{ marginBottom: '2rem', color: '#aaa' }}>Select a map to enter</p>

      <div style={{ display: 'flex', gap: '2rem' }}>
        {maps.map((map) => (
          <div key={map.id} style={{
            padding: '2rem',
            border: '1px solid #444',
            borderRadius: '8px',
            backgroundColor: '#2a2a2a',
            width: '200px',
            textAlign: 'center',
            cursor: 'pointer',
            transition: 'transform 0.2s',
          }}
          onClick={() => navigate('/game')}
          onMouseEnter={(e) => e.currentTarget.style.borderColor = '#646cff'}
          onMouseLeave={(e) => e.currentTarget.style.borderColor = '#444'}
          >
            <div style={{
              width: '100%',
              height: '100px',
              backgroundColor: '#333',
              marginBottom: '1rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#666'
            }}>
              [Map Preview]
            </div>
            <h3 style={{ margin: '0 0 0.5rem 0' }}>{map.name}</h3>
            <p style={{ fontSize: '0.8rem', color: '#888' }}>{map.description}</p>
          </div>
        ))}
      </div>
      
      <button 
        onClick={() => navigate('/overview')}
        style={{
          marginTop: '3rem',
          padding: '0.5rem 1rem',
          background: 'none',
          border: '1px solid #666',
          color: '#aaa',
          borderRadius: '4px',
          cursor: 'pointer'
        }}
      >
        Back to Overview
      </button>
    </div>
  )
}
