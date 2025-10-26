import React from 'react';
import VoteForm from './components/VoteForm';

function App() {
  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f5f5f5', padding: '20px' }}>
      <header style={{ textAlign: 'center', marginBottom: '30px' }}>
        <h1>Gen-Z Vote System</h1>
      </header>
      <VoteForm />
    </div>
  );
}

export default App;
