import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import { useNavigate } from 'react-router-dom'
import apiCall from '../../lib/apiCall'
import Header from '../../components/header'

export default function Overview({session}) {
  const navigate = useNavigate()
  const user = session.user;

  const peopleInHQ = [
    { 'name': 'new-tiny' },
    { 'name': 'new-player-2' }
  ]

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      minHeight: '100%',
      backgroundColor: '#1a1a1a',
      color: '#fff',
    }}>
      <Header user={session.user}></Header>
      <main style={{
          flex: 1,
          overflowY: 'auto',
        padding: '3rem 2rem',
          maxWidth: '1200px',
          margin: '0 auto',
          width: '100%'
      }}>
        <h2 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>Welcome to Your Virtual HQ</h2>
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
            onClick={async () => {
              const response = await apiCall.get('/get-character-sprite-details')
              console.log(response.data)
            }}
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

        {/* Live player updates */}
        <div style={{ marginTop: '3rem', gap: '1rem' }}>
          <h2 style={{ marginBottom: '1rem' }}>People in HQ</h2>
          <hr style={{ border: '1px solid #333', marginBottom: '1rem' }} />
          <ul>
            {
              peopleInHQ.map((player, index) => {
                return <li key={`${index}-${player.name}`} style={{ padding: '0.5rem' }}>
                  {player.name}
                </li>
              })
            }
          </ul>
        </div>
      </main>
    </div>
  )
}
