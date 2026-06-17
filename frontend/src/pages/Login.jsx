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
    <div style={{
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #d4d3f5 0%, #fbd5c6 100%)',
      padding: '20px',
      fontFamily: "'Inter', sans-serif"
    }}>
      {/* Outer Glass Container */}
      <div style={{
        background: 'rgba(255, 255, 255, 0.4)',
        backdropFilter: 'blur(16px)',
        borderRadius: '30px',
        padding: '16px',
        border: '1px solid rgba(255, 255, 255, 0.5)',
        boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
        width: '100%',
        maxWidth: '1000px',
        display: 'flex'
      }}>
        {/* Inner Solid Container */}
        <div style={{
          backgroundColor: '#ffffff',
          borderRadius: '24px',
          display: 'flex',
          width: '100%',
          overflow: 'hidden',
          flexDirection: 'row',
          flexWrap: 'wrap',
          minHeight: '650px'
        }}>
          
          {/* Left side: Login Form */}
          <div style={{ flex: '1 1 400px', padding: '60px 40px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <div style={{ marginBottom: '32px', textAlign: 'center' }}>
              <img src={logoImg} alt="The DataTech Labs Logo" style={{ height: '60px', marginBottom: '16px', objectFit: 'contain' }} />
              <h2 style={{ fontSize: '28px', fontWeight: 'bold', color: '#1e293b', marginBottom: '8px' }}>Sign In to your Account</h2>
            </div>

            {error && <div style={{ backgroundColor: '#fee2e2', color: '#dc2626', padding: '12px', borderRadius: '8px', marginBottom: '16px', fontSize: '14px', textAlign: 'center' }}>{error}</div>}
            
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px', maxWidth: '360px', margin: '0 auto', width: '100%' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '600', color: '#334155' }}>Username</label>
                <input 
                  type="text" 
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter Username"
                  style={{ 
                    width: '100%', padding: '14px', borderRadius: '12px', border: 'none', 
                    backgroundColor: '#f1f5f9', outline: 'none', fontSize: '14px', color: '#1e293b',
                    boxSizing: 'border-box'
                  }}
                  required 
                />
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <label style={{ fontSize: '14px', fontWeight: '600', color: '#334155' }}>Password</label>
                  <Link to="/forgot-password" style={{ fontSize: '13px', color: '#4f46e5', textDecoration: 'none', fontWeight: '600' }}>Forgot password?</Link>
                </div>
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter Password"
                  style={{ 
                    width: '100%', padding: '14px', borderRadius: '12px', border: 'none', 
                    backgroundColor: '#f1f5f9', outline: 'none', fontSize: '14px', color: '#1e293b',
                    boxSizing: 'border-box'
                  }}
                  required 
                />
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                <input type="checkbox" id="remember" style={{ width: '16px', height: '16px', cursor: 'pointer', accentColor: '#4f46e5' }} />
                <label htmlFor="remember" style={{ fontSize: '14px', color: '#64748b', cursor: 'pointer' }}>Remember me</label>
              </div>

              <button type="submit" style={{ 
                width: '100%', padding: '14px', backgroundColor: '#4f46e5', color: 'white', 
                border: 'none', borderRadius: '12px', fontSize: '16px', fontWeight: 'bold', 
                cursor: 'pointer', boxShadow: '0 4px 12px rgba(79, 70, 229, 0.3)',
                transition: 'background-color 0.2s'
              }}
              onMouseEnter={(e) => e.target.style.backgroundColor = '#4338ca'}
              onMouseLeave={(e) => e.target.style.backgroundColor = '#4f46e5'}
              >
                SIGN IN
              </button>
            </form>
            
            <div style={{ marginTop: '32px', textAlign: 'center', fontSize: '14px', color: '#64748b' }}>
              Not registered yet? <Link to="/register" style={{ color: '#4f46e5', textDecoration: 'none', fontWeight: 'bold' }}>Create an account</Link>
            </div>
          </div>

          {/* Right side: Illustration */}
          <div className="illustration-panel" style={{ 
            flex: '1 1 400px', 
            background: 'linear-gradient(135deg, #1e3a8a 0%, #4f46e5 100%)', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            padding: '40px',
            borderTopLeftRadius: '120px',
            borderBottomLeftRadius: '120px'
          }}>
            <img src={heroImage} alt="CRM Illustration" style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain', filter: 'drop-shadow(0 20px 30px rgba(0,0,0,0.2))' }} />
          </div>
          
        </div>
      </div>
      <style>{`
        @media (max-width: 768px) {
          .illustration-panel { 
             border-radius: 0 !important;
             border-top-left-radius: 0 !important;
             border-bottom-left-radius: 0 !important;
          }
        }
      `}</style>
    </div>
  );
};

export default Login;
