import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Home, Users as UsersIcon, Search, Contact, Calendar, CheckSquare, Inbox, PhoneCall, Video, Settings, ChevronRight, ChevronLeft, ShieldCheck, FileText, UserCog, Menu } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import { useContext } from 'react';
import logoImg from '../assets/datatech_logo.png';
import butterflyImg from '../assets/image.png';
import unitOneLogo from '../assets/unit_one_logo.png';

const Sidebar = ({ isOpen, onClose }) => {
  const [hoveredPath, setHoveredPath] = useState(null);
  const [isTeamHovered, setIsTeamHovered] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const location = useLocation();

  const { user } = useContext(AuthContext);

  const menuItems = [
    { name: 'Dashboard', icon: Home, path: '/' },
    { name: 'Customer', icon: UsersIcon, path: '/customers' },
    { name: 'Leads', icon: Search, path: '/leads' },
    { name: 'Calendar', icon: Calendar, path: '/calendar' },
    { name: 'To-dos', icon: CheckSquare, path: '/todos' },
    { name: 'Meetings', icon: Video, path: '/meetings' },
    { name: 'EOD Reports', icon: FileText, path: '/admin/eod-reports' },
    { name: 'Settings', icon: Settings, path: '/settings', hasSubmenu: true },
  ];

  if (user && user.role === 'Admin') {
    menuItems.push({ name: 'User Approvals', icon: ShieldCheck, path: '/admin/approvals' });
    menuItems.push({ name: 'Manage Users', icon: UserCog, path: '/admin/users' });
  }

  return (
    <aside 
      className={`sidebar-container ${isOpen ? 'open' : ''}`}
      style={{
        width: isCollapsed ? '80px' : '256px',
        backgroundColor: '#ffffff',
        borderRight: '1px solid #e2e8f0',
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        flexShrink: 0,
        zIndex: 20,
        transition: 'width 0.3s ease'
      }}
    >
      <div style={{ 
        padding: isCollapsed ? '20px 0 12px 0' : '28px 24px 16px 24px', 
        flexShrink: 0, 
        display: 'flex', 
        flexDirection: isCollapsed ? 'column' : 'row',
        alignItems: 'center', 
        justifyContent: isCollapsed ? 'center' : 'space-between', 
        height: isCollapsed ? 'auto' : '80px',
        gap: isCollapsed ? '16px' : '0'
      }}>
        {isCollapsed ? (
          <div style={{ width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <img src={butterflyImg} alt="Logo" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
          </div>
        ) : (
          <img src={logoImg} alt="The DataTech Labs Logo" style={{ width: '100%', maxWidth: '140px', height: 'auto', objectFit: 'contain' }} />
        )}
        <button className="desktop-only" onClick={() => setIsCollapsed(!isCollapsed)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '8px', color: '#64748b', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {isCollapsed ? <Menu style={{ width: '24px', height: '24px' }} /> : <ChevronLeft style={{ width: '24px', height: '24px' }} />}
        </button>
      </div>

      <nav style={{ flex: 1, padding: '8px 16px', display: 'flex', flexDirection: 'column', gap: '6px', overflowY: 'auto' }}>

        {menuItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            onClick={() => onClose && onClose()}
            onMouseEnter={() => setHoveredPath(item.path)}
            onMouseLeave={() => setHoveredPath(null)}
            style={({ isActive }) => ({
              display: 'flex',
              alignItems: 'center',
              justifyContent: isCollapsed ? 'center' : 'space-between',
              padding: isCollapsed ? '12px 0' : '10px 14px',
              borderRadius: '6px',
              fontSize: '14px',
              fontWeight: 500,
              textDecoration: 'none',
              transition: 'all 0.2s ease-in-out',
              backgroundColor: isActive ? '#3b82f6' : (hoveredPath === item.path ? '#f8fafc' : 'transparent'),
              color: isActive ? '#ffffff' : (hoveredPath === item.path ? '#0f172a' : '#64748b'),
              boxShadow: isActive ? '0 4px 6px -1px rgba(20, 184, 166, 0.3)' : 'none'
            })}
            title={isCollapsed ? item.name : ""}
          >
            {({ isActive }) => (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: isCollapsed ? 'center' : 'space-between', width: '100%' }}>
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
                  {!isCollapsed && item.name}
                </div>
                {!isCollapsed && item.hasSubmenu && (
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

      <div style={{ padding: isCollapsed ? '24px 0' : '24px 16px', borderTop: '1px solid #f1f5f9', flexShrink: 0, textAlign: 'center' }}>
        <div 
          style={{ position: 'relative', textAlign: 'center' }}
          onMouseEnter={() => setIsTeamHovered(true)}
          onMouseLeave={() => setIsTeamHovered(false)}
        >
          {isCollapsed ? (
            <div style={{ display: 'flex', justifyContent: 'center', cursor: 'pointer', transition: 'opacity 0.2s', opacity: isTeamHovered ? 1 : 0.8 }}>
              <img src={unitOneLogo} alt="Unit One" style={{ height: '20px', objectFit: 'contain' }} />
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', cursor: 'pointer', transition: 'opacity 0.2s', opacity: isTeamHovered ? 1 : 0.8 }}>
              <span style={{ 
                fontSize: '13px', 
                color: '#64748b', 
                fontWeight: 600
              }}>
                Developed by
              </span>
              <img src={unitOneLogo} alt="Unit One" style={{ height: '20px', objectFit: 'contain' }} />
            </div>
          )}
          {isTeamHovered && (
            <div style={{
              position: 'absolute',
              bottom: '100%',
              left: isCollapsed ? '16px' : '50%',
              transform: isCollapsed ? 'none' : 'translateX(-50%)',
              marginBottom: '12px',
              backgroundColor: '#1e293b',
              color: '#ffffff',
              padding: '8px 12px',
              borderRadius: '6px',
              fontSize: '12px',
              whiteSpace: 'normal',
              width: 'max-content',
              maxWidth: '220px',
              lineHeight: '1.4',
              boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
              zIndex: 50,
              fontWeight: 500,
              animation: 'fadeIn 0.2s ease-out',
              textAlign: isCollapsed ? 'left' : 'center'
            }}>
              Kartik Tambat, Ajay Shinde, Sonali Dalvi, Ashwini Takik, Supriya Shelke, Ishwari lamkhede,
               Rushikesh Bhosale, Swarada Joshi, Tejas Rane
              <div style={{
                position: 'absolute',
                top: '100%',
                left: isCollapsed ? '24px' : '50%',
                transform: 'translateX(-50%)',
                borderWidth: '5px',
                borderStyle: 'solid',
                borderColor: '#1e293b transparent transparent transparent'
              }} />
            </div>
          )}
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
