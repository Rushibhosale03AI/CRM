import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import Customer from './pages/Customer';
import CustomerEdit from './pages/CustomerEdit';
import Contacts from './pages/Contacts';
import ContactEdit from './pages/ContactEdit';
import Leads from './pages/Leads';
import LeadEdit from './pages/LeadEdit';
import Todos from './pages/Todos';
import Calls from './pages/Calls';
import CallEdit from './pages/CallEdit';
import Inbox from './pages/Inbox';
import Calendar from './pages/Calendar';
import Meetings from './pages/Meetings';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminApprovals from './pages/AdminApprovals';
import AdminEODReports from './pages/AdminEODReports';
import { AuthProvider, AuthContext } from './context/AuthContext';
import { useContext } from 'react';

const AppLayout = ({ children }) => {
  return (
    <div style={{ display: 'flex', height: '100vh', backgroundColor: '#f4f7f6', overflow: 'hidden', fontFamily: 'Inter, sans-serif' }}>
      <Sidebar />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        <Navbar />
        <main style={{ flex: 1, overflowY: 'auto', padding: '24px' }}>
          {children}
        </main>
      </div>
    </div>
  );
};

const ProtectedRoutes = () => {
  const { user, loading } = useContext(AuthContext);

  if (loading) return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>Loading...</div>;

  if (!user) {
    return (
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
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
        <Route path="/contacts" element={<Contacts />} />
        <Route path="/contacts/new" element={<ContactEdit />} />
        <Route path="/contacts/edit/:id" element={<ContactEdit />} />
        <Route path="/leads" element={<Leads />} />
        <Route path="/leads/new" element={<LeadEdit />} />
        <Route path="/leads/edit/:id" element={<LeadEdit />} />
        <Route path="/calendar" element={<Calendar />} />
        <Route path="/todos" element={<Todos />} />
        <Route path="/calls" element={<Calls />} />
        <Route path="/calls/new" element={<CallEdit />} />
        <Route path="/calls/edit/:id" element={<CallEdit />} />
        <Route path="/meetings" element={<Meetings />} />
        <Route path="/inbox" element={<Inbox />} />
        <Route path="/admin/approvals" element={<AdminApprovals />} />
        <Route path="/admin/eod-reports" element={<AdminEODReports />} />
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
