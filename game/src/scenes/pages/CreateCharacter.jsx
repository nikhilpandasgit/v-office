import { useEffect } from "react";
import Header from "../../components/header";

export default function CreateCharacter({ session }) {
  const user = session.user;

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      minHeight: '100%',
      backgroundColor: '#1a1a1a',
      color: '#fff',
    }}>
      <Header user={session.user}></Header>
      <div style={{ color: '#fff', padding: '2rem' }}>
        <h1>Create Your Character</h1>
        <p>Pick your sprite, name, vibe, destiny, etc.</p>
      </div>
    </div>
  )
}
