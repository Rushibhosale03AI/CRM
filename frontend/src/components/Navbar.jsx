import React, { useState, useEffect, useContext, useRef } from 'react';
import { Bell, Settings, LogOut, Menu } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { createPortal } from 'react-dom';
import { AuthContext } from '../context/AuthContext';
import apiClient from '../api/apiClient';
import EODReportModal from './EODReportModal';

const Navbar = ({ onMenuClick }) => {
  const [hoveredIcon, setHoveredIcon] = useState(null);
  const [isEodModalOpen, setIsEodModalOpen] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfilePopup, setShowProfilePopup] = useState(false);
  const notificationRef = useRef(null);
  const profileRef = useRef(null);
  const [todayEvents, setTodayEvents] = useState([]);
  const [rungEvents, setRungEvents] = useState(new Set());
  const location = useLocation();
  const { user, logout } = useContext(AuthContext);

  const getPageTitle = () => {
    const path = location.pathname;
    if (path === '/') return 'Dashboard';
    if (path.startsWith('/customers')) return 'Customers';
    if (path.startsWith('/leads')) return 'Leads';
    if (path.startsWith('/calendar')) return 'Calendar';
    if (path.startsWith('/todos')) return 'To-dos';
    if (path.startsWith('/meetings')) return 'Meetings';
    if (path.startsWith('/admin/approvals')) return 'User Approvals';
    if (path.startsWith('/admin/eod-reports')) return 'EOD Reports';
    if (path.startsWith('/settings')) return 'Settings';
    return '';
  };

  useEffect(() => {
    const fetchTodayEvents = async () => {
      try {
        const [callsRes, meetingsRes, todosRes] = await Promise.all([
          apiClient.get('/calls/').catch(() => ({ data: [] })),
          apiClient.get('/meetings/').catch(() => ({ data: [] })),
          apiClient.get('/todos/').catch(() => ({ data: [] }))
        ]);
        
        let pendingUsersRes = { data: [] };
        if (user?.role === 'Admin') {
          try {
            pendingUsersRes = await apiClient.get('/auth/pending-users/');
          } catch (e) {
            console.error("Error fetching pending users", e);
          }
        }
        
        const allEvents = [];
        const today = new Date();
        const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
        
        const checkDate = (isoString, type, title, id) => {
           if (!isoString) return;
           const d = new Date(isoString);
           const dStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
           if (dStr === todayStr) {
             allEvents.push({ id, type, title, time: d.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}), timestamp: d.getTime() });
           }
        };

        (callsRes.data || []).forEach(c => checkDate(c.start_date, 'Call', c.title, `call-${c.id}`));
        (meetingsRes.data || []).forEach(m => checkDate(m.from_date, 'Meeting', m.title, `meeting-${m.id}`));
        (todosRes.data || []).forEach(t => checkDate(t.due_date, 'To-do', t.title, `todo-${t.id}`));
        
        (pendingUsersRes.data || []).forEach(u => {
           allEvents.push({
             id: `pending-${u.id}`,
             type: 'Approval',
             title: `Pending User: ${u.name || u.email}`,
             time: 'Action Required',
             timestamp: 0 
           });
        });

        setTodayEvents(allEvents);
      } catch (err) {
        console.error("Error fetching notifications", err);
      }
    };
    if (user) fetchTodayEvents();
    // Refresh notifications every 1 minute to stay up to date
    const interval = setInterval(fetchTodayEvents, 60 * 1000);
    return () => clearInterval(interval);
  }, [user]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setShowProfilePopup(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (todayEvents.length === 0) return;
    
    const checkAlarms = () => {
      const now = Date.now();
      let triggered = false;
      const newRung = new Set(rungEvents);
      
      todayEvents.forEach(evt => {
        // If event time is within the last 5 minutes, and we haven't rung yet
        if (now >= evt.timestamp && now <= evt.timestamp + 5 * 60 * 1000) {
          if (!newRung.has(evt.id)) {
            newRung.add(evt.id);
            triggered = true;
            setShowNotifications(true); // Auto open dropdown to show the user
          }
        }
      });
      
      if (triggered) {
        setRungEvents(newRung);
        playRingSound();
      }
    };
    
    checkAlarms(); // Check immediately
    const interval = setInterval(checkAlarms, 10000); // Check every 10 seconds
    return () => clearInterval(interval);
  }, [todayEvents, rungEvents]);

  const playRingSound = () => {
    try {
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const playBeep = (startTime) => {
        const oscillator = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();
        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(880, audioCtx.currentTime); // A5 note
        gainNode.gain.setValueAtTime(0, startTime);
        gainNode.gain.linearRampToValueAtTime(1, startTime + 0.05);
        gainNode.gain.setValueAtTime(1, startTime + 0.2);
        gainNode.gain.linearRampToValueAtTime(0, startTime + 0.25);
        oscillator.connect(gainNode);
        gainNode.connect(audioCtx.destination);
        oscillator.start(startTime);
        oscillator.stop(startTime + 0.25);
      };
      
      const now = audioCtx.currentTime;
      // 4 beeps spanning exactly 2 seconds
      playBeep(now);
      playBeep(now + 0.5);
      playBeep(now + 1.0);
      playBeep(now + 1.5);
    } catch(e) {
      console.error("Audio play failed", e);
    }
  };

  return (
    <header className="responsive-navbar" style={{
      backgroundColor: 'rgba(255, 255, 255, 0.8)',
      backdropFilter: 'blur(12px)',
      borderBottom: '1px solid #e2e8f0',
      height: '64px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 32px',
      position: 'sticky',
      top: 0,
      zIndex: 10,
      flexShrink: 0,
      boxShadow: '0 4px 20px -2px rgba(0, 0, 0, 0.05)'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flex: 1 }}>
        <button 
          className="mobile-only"
          onClick={onMenuClick}
          style={{ 
            background: 'none', border: 'none', padding: '8px', cursor: 'pointer', 
            color: '#64748b', display: 'flex', alignItems: 'center', justifyContent: 'center' 
          }}
        >
          <Menu style={{ width: '24px', height: '24px' }} />
        </button>
        <h1 style={{ margin: 0, fontSize: '20px', fontWeight: 'bold', color: '#1e293b' }}>
          {getPageTitle()}
        </h1>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', borderRight: '1px solid #e2e8f0', paddingRight: '20px' }}>
          <div ref={notificationRef} style={{ position: 'relative' }}>
            <button 
              onClick={() => setShowNotifications(!showNotifications)}
              onMouseEnter={() => setHoveredIcon('bell')}
              onMouseLeave={() => setHoveredIcon(null)}
              style={{
                padding: '8px',
                color: hoveredIcon === 'bell' || showNotifications ? '#2563eb' : '#94a3b8',
                backgroundColor: hoveredIcon === 'bell' || showNotifications ? '#eff6ff' : 'transparent',
                border: 'none',
                borderRadius: '50%',
                cursor: 'pointer',
                transition: 'all 0.2s',
                position: 'relative'
              }}
            >
              <Bell style={{ width: '20px', height: '20px' }} />
              {todayEvents.length > 0 && (
                <span style={{
                  position: 'absolute',
                  top: '6px',
                  right: '6px',
                  width: '8px',
                  height: '8px',
                  backgroundColor: '#ef4444',
                  borderRadius: '50%',
                  border: '2px solid #ffffff'
                }}></span>
              )}
            </button>

            {showNotifications && (
              <div style={{
                position: 'absolute',
                top: '100%',
                right: '-10px',
                marginTop: '12px',
                width: '320px',
                backgroundColor: '#ffffff',
                borderRadius: '12px',
                boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
                border: '1px solid #e2e8f0',
                zIndex: 100,
                overflow: 'hidden'
              }}>
                <div style={{ padding: '16px', borderBottom: '1px solid #e2e8f0', backgroundColor: '#f8fafc' }}>
                  <h3 style={{ margin: 0, fontSize: '15px', fontWeight: 'bold', color: '#1e293b' }}>Notifications & Reminders</h3>
                  <p style={{ margin: '4px 0 0 0', fontSize: '13px', color: '#64748b' }}>You have {todayEvents.length} pending items.</p>
                </div>
                <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                  {todayEvents.length > 0 ? todayEvents.map((evt, i) => (
                    <div key={i} style={{ padding: '12px 16px', borderBottom: i !== todayEvents.length - 1 ? '1px solid #f1f5f9' : 'none', display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                      <div style={{ 
                        padding: '6px', 
                        backgroundColor: evt.type === 'Call' ? '#dcfce7' : evt.type === 'Meeting' ? '#ede9fe' : evt.type === 'Approval' ? '#ffedd5' : '#e0f2fe', 
                        color: evt.type === 'Call' ? '#16a34a' : evt.type === 'Meeting' ? '#7c3aed' : evt.type === 'Approval' ? '#ea580c' : '#0056b3', 
                        borderRadius: '8px', 
                        fontSize: '10px', 
                        fontWeight: 'bold', 
                        textTransform: 'uppercase', 
                        minWidth: '55px', 
                        textAlign: 'center' 
                      }}>
                        {evt.type}
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: '14px', fontWeight: 600, color: '#334155', marginBottom: '2px' }}>{evt.title || 'Untitled Event'}</div>
                        <div style={{ fontSize: '12px', color: '#94a3b8' }}>{evt.time}</div>
                      </div>
                    </div>
                  )) : (
                    <div style={{ padding: '32px 16px', textAlign: 'center', color: '#94a3b8', fontSize: '14px' }}>
                      No tasks scheduled for today. You're all caught up!
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {user && user.role !== 'Admin' && (
          <button
            onClick={() => setIsEodModalOpen(true)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              backgroundColor: '#3b82f6',
              color: '#ffffff',
              border: 'none',
              borderRadius: '8px',
              padding: '8px 16px',
              fontSize: '13px',
              fontWeight: 600,
              cursor: 'pointer',
              boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
              transition: 'background-color 0.2s',
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#2563eb'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#3b82f6'}
          >
            EOD Report
          </button>
        )}

        <div ref={profileRef} style={{ display: 'flex', alignItems: 'center', gap: '12px', borderLeft: '1px solid #e2e8f0', paddingLeft: '20px', position: 'relative' }}>
          <div 
            onClick={() => setShowProfilePopup(!showProfilePopup)}
            style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}
          >
            <div className="desktop-only" style={{ textAlign: 'right', flexDirection: 'column', alignItems: 'flex-end', justifyContent: 'center' }}>
              <div style={{ fontSize: '13px', fontWeight: 600, color: '#1e293b' }}>{user?.name || 'User'}</div>
              <div style={{ fontSize: '11px', fontWeight: 500, color: '#64748b' }}>{user?.role || 'Role'}</div>
            </div>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              background: 'linear-gradient(to top right, #dbeafe, #eff6ff)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#2563eb',
              position: 'relative',
              border: '1px solid #bfdbfe',
              boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)'
            }}>
              <span style={{ fontWeight: 'bold', fontSize: '14px', letterSpacing: '0.025em' }}>
                {user?.name ? user.name.substring(0, 2).toUpperCase() : 'U'}
              </span>
              <div style={{
                position: 'absolute',
                bottom: 0,
                right: 0,
                width: '12px',
                height: '12px',
                backgroundColor: '#22c55e',
                borderRadius: '50%',
                border: '2px solid #ffffff',
                boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)'
              }}></div>
            </div>
          </div>

          {showProfilePopup && (
            <div style={{
              position: 'absolute',
              top: '100%',
              right: 0,
              marginTop: '12px',
              width: '260px',
              backgroundColor: '#ffffff',
              borderRadius: '12px',
              boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
              border: '1px solid #e2e8f0',
              zIndex: 100,
              overflow: 'hidden'
            }}>
              <div style={{ padding: '16px', borderBottom: '1px solid #e2e8f0', backgroundColor: '#f8fafc' }}>
                <h3 style={{ margin: 0, fontSize: '15px', fontWeight: 'bold', color: '#1e293b' }}>{user?.name || 'User'}</h3>
                <p style={{ margin: '4px 0 0 0', fontSize: '13px', color: '#64748b' }}>{user?.role || 'Role'}</p>
              </div>
              <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div>
                  <div style={{ fontSize: '12px', color: '#64748b', fontWeight: 600, marginBottom: '2px' }}>Email Address</div>
                  <div style={{ fontSize: '14px', color: '#1e293b', wordBreak: 'break-all' }}>{user?.email || 'N/A'}</div>
                </div>
                <div>
                  <div style={{ fontSize: '12px', color: '#64748b', fontWeight: 600, marginBottom: '2px' }}>Username</div>
                  <div style={{ fontSize: '14px', color: '#1e293b' }}>{user?.username || 'N/A'}</div>
                </div>
              </div>
              <div style={{ borderTop: '1px solid #e2e8f0', padding: '8px' }}>
                <button 
                  onClick={() => setIsLogoutModalOpen(true)}
                  style={{ 
                    width: '100%', padding: '10px 16px', color: '#ef4444', backgroundColor: 'transparent', 
                    border: 'none', borderRadius: '8px', cursor: 'pointer', transition: 'all 0.2s', 
                    display: 'flex', alignItems: 'center', gap: '12px', fontWeight: 500, fontSize: '14px',
                    textAlign: 'left'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#fee2e2'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                  <LogOut style={{ width: '18px', height: '18px' }} />
                  Sign Out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <EODReportModal 
        isOpen={isEodModalOpen} 
        onClose={() => setIsEodModalOpen(false)} 
      />

      {isLogoutModalOpen && createPortal(
        <div style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(15, 23, 42, 0.4)',
          backdropFilter: 'blur(4px)',
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <div style={{
            backgroundColor: '#ffffff',
            borderRadius: '16px',
            padding: '24px',
            width: '100%',
            maxWidth: '400px',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
            textAlign: 'center',
            animation: 'fadeIn 0.2s ease-out'
          }}>
            <div style={{
              width: '48px', height: '48px',
              backgroundColor: '#fee2e2',
              color: '#ef4444',
              borderRadius: '50%',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 16px'
            }}>
              <LogOut style={{ width: '24px', height: '24px' }} />
            </div>
            <h2 style={{ margin: '0 0 8px 0', fontSize: '18px', fontWeight: 'bold', color: '#1e293b' }}>Confirm Logout</h2>
            <p style={{ margin: '0 0 24px 0', fontSize: '14px', color: '#64748b', lineHeight: '1.5' }}>
              Are you sure you want to log out of your account? You will need to sign in again to access the dashboard.
            </p>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
              <button 
                onClick={() => setIsLogoutModalOpen(false)}
                style={{
                  padding: '10px 20px',
                  backgroundColor: '#f1f5f9',
                  color: '#475569',
                  border: 'none',
                  borderRadius: '8px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  flex: 1,
                  transition: 'background-color 0.2s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#e2e8f0'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#f1f5f9'}
              >
                Cancel
              </button>
              <button 
                onClick={() => {
                  setIsLogoutModalOpen(false);
                  logout();
                }}
                style={{
                  padding: '10px 20px',
                  backgroundColor: '#ef4444',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '8px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  flex: 1,
                  transition: 'background-color 0.2s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#dc2626'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#ef4444'}
              >
                Logout
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </header>
  );
};

export default Navbar;
