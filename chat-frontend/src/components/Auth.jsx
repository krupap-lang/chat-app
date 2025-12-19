import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { socket } from '../socket';

const Auth = () => {
  const [isLogin, setIsLogin] = useState(false); 
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState(''); 
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const endpoint = isLogin ? 'login' : 'signup';
    
    const payload = isLogin ? { email, password } : { name, email, password };
    
    try {
      const { data } = await axios.post(`http://localhost:3000/auth/${endpoint}`, payload);
      
      if (isLogin) {
        // Success Login
        localStorage.setItem('token', data.access_token);
        localStorage.setItem('userId', data.userId);
        localStorage.setItem('userName', data.name);

        socket.auth = { token: data.access_token };
        socket.connect();
        
        navigate('/chat');
        window.location.reload(); 
      } else {
        alert('Signup successful! Now please Login.');
        setIsLogin(true); 
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Authentication failed');
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '80px auto', padding: '30px', border: '1px solid #ddd', borderRadius: '12px', textAlign: 'center' }}>
      <h2>{isLogin ? 'Login' : 'Create Account'}</h2>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        
        {!isLogin && (
          <input 
            type="text" 
            placeholder="Full Name" 
            required 
            onChange={(e) => setName(e.target.value)} 
            style={{ padding: '12px', borderRadius: '6px', border: '1px solid #ccc' }} 
          />
        )}

        <input 
          type="email" 
          placeholder="Email Address" 
          required 
          onChange={(e) => setEmail(e.target.value)} 
          style={{ padding: '12px', borderRadius: '6px', border: '1px solid #ccc' }} 
        />
        
        <input 
          type="password" 
          placeholder="Password" 
          required 
          onChange={(e) => setPassword(e.target.value)} 
          style={{ padding: '12px', borderRadius: '6px', border: '1px solid #ccc' }} 
        />

        <button type="submit" style={{ padding: '12px', background: '#007bff', color: 'white', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}>
          {isLogin ? 'Login' : 'Sign Up'}
        </button>
      </form>

      <p onClick={() => setIsLogin(!isLogin)} style={{ cursor: 'pointer', color: '#007bff', marginTop: '20px' }}>
        {isLogin ? "New here? Create an account" : "Already have an account? Log in"}
      </p>
    </div>
  );
};

export default Auth;