import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import VoteForm from './components/VoteForm';
import AdminDashboard from './components/AdminDashboard';

function App() {
  return (
    <Router>
      <div style={{ minHeight: '100vh', backgroundColor: '#f5f5f5', padding: '20px' }}>
        <header style={{ textAlign: 'center', marginBottom: '30px' }}>
          <h1>Gen-Z Vote System</h1>
          <nav style={{ marginTop: '20px' }}>
            <Link to="/" style={{ marginRight: '20px' }}>Vote Form</Link>
            <Link to="/dashboard">Admin Dashboard</Link>
          </nav>
        </header>
        <Routes>
          <Route path="/" element={<VoteForm />} />
          <Route path="/dashboard" element={<AdminDashboard />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
