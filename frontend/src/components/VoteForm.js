import React, { useState } from 'react';

function VoteForm() {
  const [voterId, setVoterId] = useState('');
  const [candidate, setCandidate] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/vote', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ voterId, candidate }),
      });
      const data = await response.json();
      if (response.ok) {
        setMessage(`Success: ${data.message}`);
        setVoterId('');
        setCandidate('');
      } else {
        setMessage(`Error: ${data.error}`);
      }
    } catch (error) {
      setMessage(`Error: ${error.message}`);
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '0 auto', padding: '20px' }}>
      <h2>Vote Now</h2>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <div>
          <label htmlFor="voterId" style={{ display: 'block', marginBottom: '5px' }}>
            Voter ID:
          </label>
          <input
            id="voterId"
            type="text"
            value={voterId}
            onChange={(e) => setVoterId(e.target.value)}
            required
            style={{ width: '100%', padding: '8px', fontSize: '14px' }}
          />
        </div>
        <div>
          <label htmlFor="candidate" style={{ display: 'block', marginBottom: '5px' }}>
            Candidate:
          </label>
          <input
            id="candidate"
            type="text"
            value={candidate}
            onChange={(e) => setCandidate(e.target.value)}
            required
            style={{ width: '100%', padding: '8px', fontSize: '14px' }}
          />
        </div>
        <button
          type="submit"
          style={{
            padding: '10px',
            fontSize: '16px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        >
          Submit Vote
        </button>
      </form>
      {message && (
        <div
          style={{
            marginTop: '15px',
            padding: '10px',
            backgroundColor: message.startsWith('Success') ? '#d4edda' : '#f8d7da',
            color: message.startsWith('Success') ? '#155724' : '#721c24',
            borderRadius: '4px',
          }}
        >
          {message}
        </div>
      )}
    </div>
  );
}

export default VoteForm;
