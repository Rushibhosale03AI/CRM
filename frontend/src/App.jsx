import React, { useState, useContext } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import Customer from './pages/Customer';
import CustomerEdit from './pages/CustomerEdit';
import Leads from './pages/Leads';
import LeadEdit from './pages/LeadEdit';
import Todos from './pages/Todos';
import Calendar from './pages/Calendar';
import Meetings from './pages/Meetings';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import AdminApprovals from './pages/AdminApprovals';
import AdminEODReports from './pages/AdminEODReports';
import AdminUsers from './pages/AdminUsers';
import Settings from './pages/Settings';
import { AuthProvider, AuthContext } from './context/AuthContext';
import Loader from './components/Loader';

const AppLayout = ({ children }) => {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  
  return (
    <div style={{ display: 'flex', height: '100vh', backgroundColor: '#f4f7f6', overflow: 'hidden', fontFamily: 'Inter, sans-serif' }}>
      
      {/* Mobile Overlay */}
      {isMobileSidebarOpen && (
        <div 
          onClick={() => setIsMobileSidebarOpen(false)}
          style={{
            position: 'fixed', inset: 0, backgroundColor: 'rgba(15, 23, 42, 0.4)', backdropFilter: 'blur(4px)', zIndex: 40
          }}
        />
      )}

      <Sidebar isOpen={isMobileSidebarOpen} onClose={() => setIsMobileSidebarOpen(false)} />
      
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        <Navbar onMenuClick={() => setIsMobileSidebarOpen(true)} />
        <main className="responsive-padding" style={{ flex: 1, overflowY: 'auto', padding: '24px' }}>
          {children}
        </main>
      </div>
    </div>
  );
};

const ProtectedRoutes = () => {
  const { user, loading } = useContext(AuthContext);

  if (loading) return <Loader message="Verifying authentication..." />;

  if (!user) {
    return (
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    );
  }

  return (
    <AppLayout>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/customers" element={<Customer />} />
        <Route path="/customers/new" element={<CustomerEdit />} />
        <Route path="/customers/edit/:id" element={<CustomerEdit />} />
        <Route path="/leads" element={<Leads />} />
        <Route path="/leads/new" element={<LeadEdit />} />
        <Route path="/leads/edit/:id" element={<LeadEdit />} />
        <Route path="/calendar" element={<Calendar />} />
        <Route path="/todos" element={<Todos />} />
        <Route path="/meetings" element={<Meetings />} />
        <Route path="/admin/approvals" element={<AdminApprovals />} />
        <Route path="/admin/users" element={<AdminUsers />} />
        <Route path="/admin/eod-reports" element={<AdminEODReports />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="*" element={<div style={{ textAlign: 'center', padding: '80px 0', color: '#64748b' }}>Page under construction</div>} />
      </Routes>
    </AppLayout>
  );
};

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <ProtectedRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
