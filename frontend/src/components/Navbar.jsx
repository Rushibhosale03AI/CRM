import React, { useState, useEffect, useContext } from 'react';
import { Search, Bell, Settings, LogOut } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import apiClient from '../api/apiClient';
import EODReportModal from './EODReportModal';

const Navbar = () => {
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [hoveredIcon, setHoveredIcon] = useState(null);
  const [isEodModalOpen, setIsEodModalOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [todayEvents, setTodayEvents] = useState([]);
  const [rungEvents, setRungEvents] = useState(new Set());
  const [searchParams, setSearchParams] = useSearchParams();
  const searchQuery = searchParams.get('q') || '';
  const { user, logout } = useContext(AuthContext);

  useEffect(() => {
    const fetchTodayEvents = async () => {
      try {
        const [callsRes, meetingsRes, todosRes] = await Promise.all([
          apiClient.get('/calls/'),
          apiClient.get('/meetings/'),
          apiClient.get('/todos/')
        ]);
        
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

  const handleSearchChange = (e) => {
    const val = e.target.value;
    const newParams = new URLSearchParams(searchParams);
    if (val) {
      newParams.set('q', val);
    } else {
      newParams.delete('q');
    }
    setSearchParams(newParams);
  };

  return (
    <header style={{
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
      boxShadow: '0 4px 20px -2px rgba(0, 0, 0, 0.05)'
    }}>
      <div style={{ flex: 1, maxWidth: '576px' }}>
        <div style={{ position: 'relative' }}>
          <Search style={{
            position: 'absolute',
            left: '14px',
            top: '50%',
            transform: 'translateY(-50%)',
            width: '16px',
            height: '16px',
            color: isSearchFocused ? '#14b8a6' : '#94a3b8',
            transition: 'color 0.2s'
          }} />
          <input
            type="text"
            value={searchQuery}
            onChange={handleSearchChange}
            placeholder="Search leads, contacts, or CRM pages..."
            onFocus={() => setIsSearchFocused(true)}
            onBlur={() => setIsSearchFocused(false)}
            style={{
              width: '100%',
              padding: '8px 16px 8px 40px',
              backgroundColor: isSearchFocused ? '#ffffff' : 'rgba(241, 245, 249, 0.5)',
              border: `1px solid ${isSearchFocused ? '#14b8a6' : 'transparent'}`,
              borderRadius: '12px',
              fontSize: '14px',
              outline: 'none',
              boxShadow: isSearchFocused ? '0 0 0 2px rgba(20, 184, 166, 0.2)' : 'none',
              transition: 'all 0.2s',
              color: '#334155'
            }}
          />
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', borderRight: '1px solid #e2e8f0', paddingRight: '20px' }}>
          <div style={{ position: 'relative' }}>
            <button 
              onClick={() => setShowNotifications(!showNotifications)}
              onMouseEnter={() => setHoveredIcon('bell')}
              onMouseLeave={() => setHoveredIcon(null)}
              style={{
                padding: '8px',
                color: hoveredIcon === 'bell' || showNotifications ? '#0d9488' : '#94a3b8',
                backgroundColor: hoveredIcon === 'bell' || showNotifications ? '#f0fdfa' : 'transparent',
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
                  <h3 style={{ margin: 0, fontSize: '15px', fontWeight: 'bold', color: '#1e293b' }}>Today's Reminders</h3>
                  <p style={{ margin: '4px 0 0 0', fontSize: '13px', color: '#64748b' }}>You have {todayEvents.length} tasks scheduled for today.</p>
                </div>
                <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                  {todayEvents.length > 0 ? todayEvents.map((evt, i) => (
                    <div key={i} style={{ padding: '12px 16px', borderBottom: i !== todayEvents.length - 1 ? '1px solid #f1f5f9' : 'none', display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                      <div style={{ padding: '6px', backgroundColor: evt.type === 'Call' ? '#dcfce7' : evt.type === 'Meeting' ? '#ede9fe' : '#e0f2fe', color: evt.type === 'Call' ? '#16a34a' : evt.type === 'Meeting' ? '#7c3aed' : '#0284c7', borderRadius: '8px', fontSize: '10px', fontWeight: 'bold', textTransform: 'uppercase', minWidth: '55px', textAlign: 'center' }}>
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
          <button 
            onMouseEnter={() => setHoveredIcon('settings')}
            onMouseLeave={() => setHoveredIcon(null)}
            style={{
              padding: '8px',
              color: hoveredIcon === 'settings' ? '#334155' : '#94a3b8',
              backgroundColor: hoveredIcon === 'settings' ? '#f1f5f9' : 'transparent',
              border: 'none',
              borderRadius: '50%',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
          >
            <Settings style={{ width: '20px', height: '20px' }} />
          </button>
        </div>

        {user && user.role !== 'Admin' && (
          <button
            onClick={() => setIsEodModalOpen(true)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              backgroundColor: '#0ea5e9',
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
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#0284c7'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#0ea5e9'}
          >
            EOD Report
          </button>
        )}

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer', borderLeft: '1px solid #e2e8f0', paddingLeft: '20px' }}>
          <div style={{ textAlign: 'right', display: 'block' }}>
            <div style={{ fontSize: '13px', fontWeight: 600, color: '#1e293b' }}>{user?.name || 'User'}</div>
            <div style={{ fontSize: '11px', fontWeight: 500, color: '#64748b' }}>{user?.role || 'Role'}</div>
          </div>
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            background: 'linear-gradient(to top right, #ccfbf1, #f0fdfa)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#0f766e',
            position: 'relative',
            border: '1px solid #99f6e4',
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
          <button 
            onClick={logout}
            style={{ marginLeft: '12px', padding: '8px', color: '#ef4444', backgroundColor: '#fee2e2', border: 'none', borderRadius: '50%', cursor: 'pointer', transition: 'all 0.2s', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            title="Logout"
          >
            <LogOut style={{ width: '18px', height: '18px' }} />
          </button>
        </div>
      </div>

      <EODReportModal 
        isOpen={isEodModalOpen} 
        onClose={() => setIsEodModalOpen(false)} 
      />
    </header>
  );
};

export default Navbar;
