import React, { useState } from 'react';
import apiClient from '../api/apiClient';
import { useNavigate, Link } from 'react-router-dom';
import heroImage from '../assets/crm_hero.png';
import logoImg from '../assets/datatech_logo.png';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    email: '',
    password: ''
  });
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    
    if (formData.password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    
    try {
      await apiClient.post('/auth/register/', formData);
      setSuccess(true);
      setTimeout(() => navigate('/login'), 3000);
    } catch (err) {
      if (err.response && err.response.data) {
        setError(JSON.stringify(err.response.data));
      } else {
        setError("Registration failed.");
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
          
          {/* Left side: Register Form */}
          <div style={{ flex: '1 1 400px', padding: '40px 40px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <div style={{ marginBottom: '24px', textAlign: 'center' }}>
              <img src={logoImg} alt="The DataTech Labs Logo" style={{ height: '50px', marginBottom: '16px', objectFit: 'contain' }} />
              <h2 style={{ fontSize: '28px', fontWeight: 'bold', color: '#1e293b', marginBottom: '8px' }}>Create an Account</h2>
            </div>
            
            {error && <div style={{ backgroundColor: '#fee2e2', color: '#dc2626', padding: '12px', borderRadius: '8px', marginBottom: '16px', fontSize: '14px', textAlign: 'center' }}>{error}</div>}
            {success && <div style={{ backgroundColor: '#dcfce3', color: '#166534', padding: '12px', borderRadius: '8px', marginBottom: '16px', fontSize: '14px', textAlign: 'center' }}>Registration successful! Pending Admin Approval. Redirecting...</div>}
        
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxWidth: '360px', margin: '0 auto', width: '100%' }}>
              <div style={{ display: 'flex', gap: '12px' }}>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '600', color: '#334155' }}>Full Name</label>
                  <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Full Name" style={{ width: '100%', padding: '12px', borderRadius: '12px', border: 'none', backgroundColor: '#f1f5f9', outline: 'none', fontSize: '14px', boxSizing: 'border-box' }} required />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '600', color: '#334155' }}>Username</label>
                  <input type="text" name="username" value={formData.username} onChange={handleChange} placeholder="Username" style={{ width: '100%', padding: '12px', borderRadius: '12px', border: 'none', backgroundColor: '#f1f5f9', outline: 'none', fontSize: '14px', boxSizing: 'border-box' }} required />
                </div>
              </div>
              
              <div style={{ display: 'flex', gap: '12px' }}>
                <div style={{ flex: 2 }}>
                  <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '600', color: '#334155' }}>Email</label>
                  <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Email address" style={{ width: '100%', padding: '12px', borderRadius: '12px', border: 'none', backgroundColor: '#f1f5f9', outline: 'none', fontSize: '14px', boxSizing: 'border-box' }} required />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '600', color: '#334155' }}>Role</label>
                  <input type="text" value="Sales Rep." disabled style={{ width: '100%', padding: '12px', borderRadius: '12px', border: 'none', backgroundColor: '#e2e8f0', color: '#64748b', cursor: 'not-allowed', outline: 'none', fontSize: '14px', boxSizing: 'border-box' }} />
                </div>
              </div>
              
              <div style={{ display: 'flex', gap: '12px' }}>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '600', color: '#334155' }}>Password</label>
                  <input type="password" name="password" value={formData.password} onChange={handleChange} placeholder="Password" style={{ width: '100%', padding: '12px', borderRadius: '12px', border: 'none', backgroundColor: '#f1f5f9', outline: 'none', fontSize: '14px', boxSizing: 'border-box' }} required />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '600', color: '#334155' }}>Confirm</label>
                  <input type="password" name="confirmPassword" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Confirm" style={{ width: '100%', padding: '12px', borderRadius: '12px', border: 'none', backgroundColor: '#f1f5f9', outline: 'none', fontSize: '14px', boxSizing: 'border-box' }} required />
                </div>
              </div>
              
              <button type="submit" disabled={success} style={{ 
                width: '100%', padding: '14px', backgroundColor: '#4f46e5', color: 'white', 
                border: 'none', borderRadius: '12px', fontSize: '16px', fontWeight: 'bold', 
                cursor: success ? 'not-allowed' : 'pointer', marginTop: '8px', 
                boxShadow: '0 4px 12px rgba(79, 70, 229, 0.3)', transition: 'background-color 0.2s' 
              }}
              onMouseEnter={(e) => { if (!success) e.target.style.backgroundColor = '#4338ca'; }}
              onMouseLeave={(e) => { if (!success) e.target.style.backgroundColor = '#4f46e5'; }}
              >
                REGISTER
              </button>
            </form>
            
            <div style={{ marginTop: '24px', textAlign: 'center', fontSize: '14px', color: '#64748b' }}>
              Already have an account? <Link to="/login" style={{ color: '#4f46e5', textDecoration: 'none', fontWeight: 'bold' }}>Sign In</Link>
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

export default Register;
