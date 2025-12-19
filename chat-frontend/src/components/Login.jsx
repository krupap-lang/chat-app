import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { socket } from '../socket';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleAuth = async (endpoint) => {
    try {
      const { data } = await axios.post(`http://localhost:3000/auth/${endpoint}`, { email, password });
      if (data.access_token) {
        localStorage.setItem('token', data.access_token);
        localStorage.setItem('userId', data.userId);
        
        socket.auth = { token: data.access_token };
        socket.connect();
        navigate('/chat');
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Error');
    }
  };

  return (
    <div className="auth-container">
      <h2>Chat App</h2>
      <input type="email" placeholder="Email" onChange={(e) => setEmail(e.target.value)} />
      <input type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} />
      <button onClick={() => handleAuth('login')}>Login</button>
      <button onClick={() => handleAuth('signup')}>Sign Up</button>
    </div>
  );
};

export default Login;