import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Auth from './components/Auth';
import Chat from './components/Chat';

function App() {
  // Check if token exists in storage
  const isAuth = !!localStorage.getItem('token');

  return (
    <Router>
      <Routes>
        {/* If logged in, go to chat. If not, show the Auth (Signup/Login) page */}
        <Route path="/" element={isAuth ? <Navigate to="/chat" /> : <Auth />} />
        
        {/* Explicit Login Route */}
        <Route path="/login" element={isAuth ? <Navigate to="/chat" /> : <Auth />} />
        
        {/* Protected Chat Route */}
        <Route path="/chat" element={isAuth ? <Chat /> : <Navigate to="/login" />} />
        
        {/* Catch-all: redirect to home */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;