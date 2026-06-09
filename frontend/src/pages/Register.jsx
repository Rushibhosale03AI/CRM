import React, { useState } from 'react';
import apiClient from '../api/apiClient';
import { useNavigate, Link } from 'react-router-dom';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    email: '',
    password: '',
    role: 'Sales Representative'
  });
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
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
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#f8fafc' }}>
      <div style={{ backgroundColor: 'white', padding: '40px', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', width: '100%', maxWidth: '450px' }}>
        <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '24px', textAlign: 'center', color: '#1e293b' }}>Create an Account</h2>
        {error && <div style={{ backgroundColor: '#fee2e2', color: '#dc2626', padding: '12px', borderRadius: '8px', marginBottom: '16px', fontSize: '14px' }}>{error}</div>}
        {success && <div style={{ backgroundColor: '#dcfce3', color: '#166534', padding: '12px', borderRadius: '8px', marginBottom: '16px', fontSize: '14px' }}>Registration successful! Pending Admin Approval. Redirecting...</div>}
        
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500', color: '#475569' }}>Full Name</label>
            <input type="text" name="name" value={formData.name} onChange={handleChange} style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none' }} required />
          </div>
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500', color: '#475569' }}>Username</label>
            <input type="text" name="username" value={formData.username} onChange={handleChange} style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none' }} required />
          </div>
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500', color: '#475569' }}>Email</label>
            <input type="email" name="email" value={formData.email} onChange={handleChange} style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none' }} required />
          </div>
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500', color: '#475569' }}>Role</label>
            <select name="role" value={formData.role} onChange={handleChange} style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none', backgroundColor: 'white' }}>
              <option value="Sales Representative">Sales Representative</option>
              <option value="Admin">Admin</option>
            </select>
          </div>
          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500', color: '#475569' }}>Password</label>
            <input type="password" name="password" value={formData.password} onChange={handleChange} style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none' }} required />
          </div>
          <button type="submit" disabled={success} style={{ width: '100%', padding: '12px', backgroundColor: '#2563eb', color: 'white', border: 'none', borderRadius: '8px', fontSize: '16px', fontWeight: 'bold', cursor: success ? 'not-allowed' : 'pointer' }}>
            Register
          </button>
        </form>
        <div style={{ marginTop: '24px', textAlign: 'center', fontSize: '14px', color: '#64748b' }}>
          Already have an account? <Link to="/login" style={{ color: '#2563eb', textDecoration: 'none', fontWeight: 'bold' }}>Log In</Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
