import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import heroImage from '../assets/crm_hero.png';
import logoImg from '../assets/datatech_logo.png';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      await login(username, password);
      navigate('/');
    } catch (err) {
      if (err.response && err.response.data.error) {
        setError(err.response.data.error);
      } else {
        setError("Failed to login. Please check your credentials.");
      }
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#f8fafc', padding: '20px' }}>
      <div style={{ display: 'flex', backgroundColor: 'white', borderRadius: '12px', boxShadow: '0 10px 25px rgba(0,0,0,0.1)', overflow: 'hidden', width: '100%', maxWidth: '900px' }}>
        
        {/* Left side: Login Form */}
        <div style={{ padding: '40px', width: '100%', maxWidth: '400px', flexShrink: 0 }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '24px' }}>
            <img src={logoImg} alt="The DataTech Labs Logo" style={{ width: '100%', maxWidth: '240px', height: 'auto', objectFit: 'contain' }} />
          </div>
          <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '24px', textAlign: 'center', color: '#1e293b' }}>Welcome Back</h2>
          {error && <div style={{ backgroundColor: '#fee2e2', color: '#dc2626', padding: '12px', borderRadius: '8px', marginBottom: '16px', fontSize: '14px' }}>{error}</div>}
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500', color: '#475569' }}>Username</label>
              <input 
                type="text" 
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none' }}
                required 
              />
            </div>
            <div style={{ marginBottom: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <label style={{ fontSize: '14px', fontWeight: '500', color: '#475569' }}>Password</label>
                <Link to="/forgot-password" style={{ fontSize: '13px', color: '#14b8a6', textDecoration: 'none', fontWeight: '500' }}>Forgot password?</Link>
              </div>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none' }}
                required 
              />
            </div>
            <button type="submit" style={{ width: '100%', padding: '12px', backgroundColor: '#14b8a6', color: 'white', border: 'none', borderRadius: '8px', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer' }}>
              Log In
            </button>
          </form>
          <div style={{ marginTop: '24px', textAlign: 'center', fontSize: '14px', color: '#64748b' }}>
            Don't have an account? <Link to="/register" style={{ color: '#14b8a6', textDecoration: 'none', fontWeight: 'bold' }}>Register</Link>
          </div>
        </div>

        {/* Right side: Illustration */}
        <div style={{ flex: 1, backgroundColor: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px' }}>
          <img src={heroImage} alt="CRM Illustration" style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
        </div>
      </div>
    </div>
  );
};

export default Login;
