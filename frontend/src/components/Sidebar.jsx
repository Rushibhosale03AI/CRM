import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Home, Users, Search, Contact, Calendar, CheckSquare, Inbox, PhoneCall, Video, Settings, ChevronDown, ChevronRight, Circle, ShieldCheck, FileText } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import { useContext } from 'react';

const Sidebar = () => {
  const [hoveredPath, setHoveredPath] = useState(null);
  const [isDashboardExpanded, setIsDashboardExpanded] = useState(true);
  const location = useLocation();

  const isCrmActive = location.pathname === '/';

  const { user } = useContext(AuthContext);

  const menuItems = [
    { name: 'Customer', icon: Users, path: '/customers' },
    { name: 'Leads', icon: Search, path: '/leads' },
    { name: 'Contacts', icon: Contact, path: '/contacts' },
    { name: 'Calendar', icon: Calendar, path: '/calendar' },
    { name: 'To-dos', icon: CheckSquare, path: '/todos' },
    { name: 'Inbox', icon: Inbox, path: '/inbox' },
    { name: 'Call', icon: PhoneCall, path: '/calls' },
    { name: 'Meetings', icon: Video, path: '/meetings' },
    { name: 'EOD Reports', icon: FileText, path: '/admin/eod-reports' },
    { name: 'Settings', icon: Settings, path: '/settings', hasSubmenu: true },
  ];

  if (user && user.role === 'Admin') {
    menuItems.push({ name: 'User Approvals', icon: ShieldCheck, path: '/admin/approvals' });
  }

  return (
    <aside style={{
      width: '256px',
      backgroundColor: '#ffffff',
      borderRight: '1px solid #e2e8f0',
      height: '100vh',
      display: 'flex',
      flexDirection: 'column',
      flexShrink: 0,
      position: 'sticky',
      top: 0,
      overflowY: 'auto',
      boxShadow: '4px 0 24px rgba(0,0,0,0.02)',
      zIndex: 20
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '24px 24px 24px 24px' }}>
        <div style={{
          width: '36px',
          height: '36px',
          borderRadius: '8px',
          background: 'linear-gradient(135deg, #2dd4bf, #0d9488)',
          color: 'white',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontWeight: 'bold',
          fontSize: '20px',
          boxShadow: '0 4px 6px -1px rgba(20, 184, 166, 0.2)'
        }}>
          <span style={{ transform: 'rotate(-45deg)' }}>&#x221E;</span>
        </div>
        <span style={{ fontSize: '20px', fontWeight: 'bold', color: '#1e293b', letterSpacing: '-0.025em' }}>
          TDTL <span style={{ fontSize: '12px', fontWeight: 500, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em', marginLeft: '4px' }}>CRM</span>
        </span>
      </div>

      <nav style={{ flex: 1, padding: '8px 16px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
        
        {/* Dashboard Expandable Menu */}
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div
            onClick={() => setIsDashboardExpanded(!isDashboardExpanded)}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '10px 14px',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: 500,
              cursor: 'pointer',
              transition: 'all 0.2s ease-in-out',
              color: '#64748b'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <Home style={{ width: '20px', height: '20px', color: '#94a3b8' }} strokeWidth={2} />
              Dashboard
            </div>
            <ChevronDown style={{ 
              width: '16px', 
              height: '16px', 
              transition: 'transform 0.2s',
              transform: isDashboardExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
              color: '#94a3b8'
            }} />
          </div>

          {isDashboardExpanded && (
            <div style={{ display: 'flex', flexDirection: 'column', marginTop: '4px', paddingLeft: '8px' }}>
              <NavLink
                to="/"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: '10px 14px',
                  borderRadius: '6px',
                  fontSize: '14px',
                  fontWeight: 500,
                  textDecoration: 'none',
                  transition: 'all 0.2s',
                  backgroundColor: isCrmActive ? '#14b8a6' : 'transparent',
                  color: isCrmActive ? '#ffffff' : '#64748b',
                  boxShadow: isCrmActive ? '0 4px 6px -1px rgba(20, 184, 166, 0.3)' : 'none'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <Circle style={{ width: '12px', height: '12px', color: isCrmActive ? '#ffffff' : '#94a3b8', fill: 'transparent' }} strokeWidth={2} />
                  CRM
                </div>
              </NavLink>
            </div>
          )}
        </div>

        {menuItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            onMouseEnter={() => setHoveredPath(item.path)}
            onMouseLeave={() => setHoveredPath(null)}
            style={({ isActive }) => ({
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '10px 14px',
              borderRadius: '6px',
              fontSize: '14px',
              fontWeight: 500,
              textDecoration: 'none',
              transition: 'all 0.2s ease-in-out',
              backgroundColor: isActive ? '#14b8a6' : (hoveredPath === item.path ? '#f8fafc' : 'transparent'),
              color: isActive ? '#ffffff' : (hoveredPath === item.path ? '#0f172a' : '#64748b'),
              boxShadow: isActive ? '0 4px 6px -1px rgba(20, 184, 166, 0.3)' : 'none'
            })}
          >
            {({ isActive }) => (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <item.icon 
                    style={{ 
                      width: '20px', 
                      height: '20px', 
                      transition: 'color 0.2s',
                      color: isActive ? '#ffffff' : (hoveredPath === item.path ? '#475569' : '#94a3b8')
                    }} 
                    strokeWidth={isActive ? 2.5 : 2} 
                  />
                  {item.name}
                </div>
                {item.hasSubmenu && (
                  <ChevronRight 
                    style={{ 
                      width: '16px', 
                      height: '16px', 
                      transition: 'transform 0.2s',
                      transform: isActive ? 'rotate(90deg)' : 'rotate(0deg)',
                      color: isActive ? '#ffffff' : '#94a3b8'
                    }} 
                  />
                )}
              </div>
            )}
          </NavLink>
        ))}

      </nav>

      <div style={{ padding: '24px', borderTop: '1px solid #f1f5f9' }}>
        <div style={{ marginTop: '16px', fontSize: '12px', color: '#94a3b8', textAlign: 'center', fontWeight: 500 }}>
          © 2026 - CHL CRM. All Rights Reserved.
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
