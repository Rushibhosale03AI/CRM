import React, { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import apiClient from '../api/apiClient';
import { User, Bell, Shield, Moon, Sun, Monitor, CheckCircle, AlertCircle } from 'lucide-react';

const Settings = () => {
  const { user, login } = useContext(AuthContext); // Note: login might just be used to refresh context if needed, or we might need to manually trigger context refresh. We'll just update local state for now.
  const [activeTab, setActiveTab] = useState('profile');
  
  // Profile State
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    username: user?.username || '',
    email: user?.email || '',
    phone_number: user?.phone_number || '',
    role: user?.role || ''
  });
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileMessage, setProfileMessage] = useState({ type: '', text: '' });

  // Password State
  const [passwordData, setPasswordData] = useState({
    current_password: '',
    new_password: '',
    confirm_password: ''
  });
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordMessage, setPasswordMessage] = useState({ type: '', text: '' });



  // Preferences State
  const [theme, setTheme] = useState(user?.theme || 'system');
  const [emailNotifications, setEmailNotifications] = useState(user?.email_notifications !== undefined ? user.email_notifications : true);

  // Sync profile data when user changes
  useEffect(() => {
    if (user) {
      setProfileData({
        name: user.name || '',
        username: user.username || '',
        email: user.email || '',
        phone_number: user.phone_number || '',
        role: user.role || ''
      });
      setTheme(user.theme || 'system');
      if (user.email_notifications !== undefined) {
        setEmailNotifications(user.email_notifications);
      }
    }
  }, [user]);

  const handleProfileChange = (e) => {
    setProfileData({ ...profileData, [e.target.name]: e.target.value });
  };

  const updatePreference = async (key, value) => {
    try {
      await apiClient.put('/auth/me/', { [key]: value });
    } catch (error) {
      console.error(`Failed to update ${key}:`, error);
    }
  };

  const handlePasswordChange = (e) => {
    setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (passwordData.new_password !== passwordData.confirm_password) {
      setPasswordMessage({ type: 'error', text: 'New passwords do not match.' });
      return;
    }
    
    setPasswordLoading(true);
    setPasswordMessage({ type: '', text: '' });
    
    try {
      await apiClient.post('/auth/change-password/', {
        current_password: passwordData.current_password,
        new_password: passwordData.new_password
      });
      setPasswordMessage({ type: 'success', text: 'Password updated successfully!' });
      setPasswordData({ current_password: '', new_password: '', confirm_password: '' });
    } catch (error) {
      setPasswordMessage({ type: 'error', text: error.response?.data?.error || 'Failed to update password.' });
    } finally {
      setPasswordLoading(false);
    }
  };

  const handleThemeChange = (newTheme) => {
    setTheme(newTheme);
    updatePreference('theme', newTheme);
    // Optionally apply to document right now if it was implemented globally
    document.documentElement.setAttribute('data-theme', newTheme);
  };

  const handleNotificationChange = (enabled) => {
    setEmailNotifications(enabled);
    updatePreference('email_notifications', enabled);
  };
  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setProfileLoading(true);
    setProfileMessage({ type: '', text: '' });
    
    if (profileData.phone_number) {
      const phoneRegex = /^[+]?[\d\s-]{10,15}$/;
      if (!phoneRegex.test(profileData.phone_number.trim())) {
        setProfileMessage({ type: 'error', text: 'Please enter a valid phone number (10-15 digits, optional + or -).' });
        setProfileLoading(false);
        return;
      }
    }

    try {
      // Assuming PUT /auth/me/ updates the user
      const response = await apiClient.put('/auth/me/', {
        name: profileData.name,
        username: profileData.username,
        phone_number: profileData.phone_number
      });
      setProfileMessage({ type: 'success', text: 'Profile updated successfully! Note: Please refresh the page to see changes in the sidebar.' });
    } catch (error) {
      setProfileMessage({ type: 'error', text: error.response?.data?.error || 'Failed to update profile.' });
    } finally {
      setProfileLoading(false);
    }
  };


  const MessageBanner = ({ message }) => {
    if (!message.text) return null;
    const isError = message.type === 'error';
    return (
      <div style={{ 
        display: 'flex', alignItems: 'center', gap: '8px', 
        padding: '12px 16px', borderRadius: '8px', marginBottom: '20px',
        backgroundColor: isError ? '#fef2f2' : '#f0fdf4',
        border: `1px solid ${isError ? '#fecaca' : '#bbf7d0'}`,
        color: isError ? '#991b1b' : '#166534',
        fontSize: '14px'
      }}>
        {isError ? <AlertCircle size={18} /> : <CheckCircle size={18} />}
        {message.text}
      </div>
    );
  };

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      <div>
        <p style={{ color: '#64748b', margin: 0, fontSize: '15px' }}>Manage your account settings and preferences.</p>
      </div>

      <div style={{ display: 'flex', gap: '32px', alignItems: 'flex-start' }}>
        
        {/* Sidebar Tabs */}
        <div style={{ 
          width: '240px', 
          display: 'flex', 
          flexDirection: 'column', 
          gap: '4px',
          backgroundColor: '#ffffff',
          padding: '16px',
          borderRadius: '12px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
        }}>
          <button 
            onClick={() => setActiveTab('profile')}
            style={{ 
              display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px', borderRadius: '8px', border: 'none', cursor: 'pointer',
              backgroundColor: activeTab === 'profile' ? '#eff6ff' : 'transparent',
              color: activeTab === 'profile' ? '#2563eb' : '#475569',
              fontWeight: activeTab === 'profile' ? 600 : 500,
              textAlign: 'left', transition: 'all 0.2s'
            }}
          >
            <User size={18} />
            Profile Details
          </button>
          


          <button 
            onClick={() => setActiveTab('security')}
            style={{ 
              display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px', borderRadius: '8px', border: 'none', cursor: 'pointer',
              backgroundColor: activeTab === 'security' ? '#eff6ff' : 'transparent',
              color: activeTab === 'security' ? '#2563eb' : '#475569',
              fontWeight: activeTab === 'security' ? 600 : 500,
              textAlign: 'left', transition: 'all 0.2s'
            }}
          >
            <Shield size={18} />
            Security
          </button>
        </div>

        {/* Content Area */}
        <div style={{ 
          flex: 1, 
          backgroundColor: '#ffffff', 
          borderRadius: '12px', 
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          padding: '32px'
        }}>
          
          {/* PROFILE TAB */}
          {activeTab === 'profile' && (
            <div>
              <h2 style={{ fontSize: '18px', fontWeight: 'bold', color: '#1e293b', margin: '0 0 24px 0', borderBottom: '1px solid #e2e8f0', paddingBottom: '16px' }}>Profile Details</h2>
              <MessageBanner message={profileMessage} />
              
              <form onSubmit={handleProfileSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px', maxWidth: '500px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: 600, color: '#334155' }}>Full Name</label>
                  <input 
                    type="text" 
                    name="name" 
                    value={profileData.name} 
                    onChange={handleProfileChange}
                    style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none', fontSize: '14px' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: 600, color: '#334155' }}>Username</label>
                  <input 
                    type="text" 
                    name="username" 
                    value={profileData.username} 
                    onChange={handleProfileChange}
                    style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none', fontSize: '14px' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: 600, color: '#334155' }}>Phone Number</label>
                  <input 
                    type="text" 
                    name="phone_number" 
                    value={profileData.phone_number} 
                    onChange={handleProfileChange}
                    style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none', fontSize: '14px' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: 600, color: '#334155' }}>Email Address</label>
                  <input 
                    type="email" 
                    value={profileData.email} 
                    disabled
                    style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none', fontSize: '14px', backgroundColor: '#f1f5f9', color: '#64748b' }}
                  />
                  <p style={{ margin: '6px 0 0 0', fontSize: '12px', color: '#64748b' }}>Email address cannot be changed directly. Contact admin.</p>
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: 600, color: '#334155' }}>Role</label>
                  <input 
                    type="text" 
                    value={profileData.role} 
                    disabled
                    style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none', fontSize: '14px', backgroundColor: '#f1f5f9', color: '#64748b' }}
                  />
                </div>
                
                <button type="submit" disabled={profileLoading} style={{ 
                  marginTop: '12px', padding: '12px 24px', backgroundColor: '#3b82f6', color: 'white', border: 'none', borderRadius: '8px', fontSize: '15px', fontWeight: 600, cursor: profileLoading ? 'not-allowed' : 'pointer', opacity: profileLoading ? 0.7 : 1, width: 'fit-content'
                }}>
                  {profileLoading ? 'Saving...' : 'Save Changes'}
                </button>
              </form>
            </div>
          )}



          {/* SECURITY TAB */}
          {activeTab === 'security' && (
            <div>
              <h2 style={{ fontSize: '18px', fontWeight: 'bold', color: '#1e293b', margin: '0 0 24px 0', borderBottom: '1px solid #e2e8f0', paddingBottom: '16px' }}>Security</h2>
              
              <div style={{ maxWidth: '500px' }}>
                <h3 style={{ fontSize: '15px', fontWeight: 600, color: '#334155', margin: '0 0 16px 0' }}>Change Password</h3>
                <MessageBanner message={passwordMessage} />
                <form onSubmit={handlePasswordSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: 600, color: '#334155' }}>Current Password</label>
                    <input type="password" name="current_password" value={passwordData.current_password} onChange={handlePasswordChange} required style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none', fontSize: '14px' }} />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: 600, color: '#334155' }}>New Password</label>
                    <input type="password" name="new_password" value={passwordData.new_password} onChange={handlePasswordChange} required style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none', fontSize: '14px' }} />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: 600, color: '#334155' }}>Confirm New Password</label>
                    <input type="password" name="confirm_password" value={passwordData.confirm_password} onChange={handlePasswordChange} required style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none', fontSize: '14px' }} />
                  </div>
                  <button type="submit" disabled={passwordLoading} style={{ marginTop: '12px', padding: '12px 24px', backgroundColor: '#0f172a', color: 'white', border: 'none', borderRadius: '8px', fontSize: '15px', fontWeight: 600, cursor: passwordLoading ? 'not-allowed' : 'pointer', opacity: passwordLoading ? 0.7 : 1, width: 'fit-content' }}>
                    {passwordLoading ? 'Updating...' : 'Update Password'}
                  </button>
                </form>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default Settings;
