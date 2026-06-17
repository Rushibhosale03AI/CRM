import React, { useState, useEffect, useContext } from 'react';
import apiClient from '../api/apiClient';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import Loader from '../components/Loader';
import PageSearchBar from '../components/PageSearchBar';

const AdminApprovals = () => {
  const [pendingUsers, setPendingUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (user && user.role !== 'Admin') {
      navigate('/');
    } else {
      fetchPendingUsers();
    }
  }, [user, navigate]);

  const fetchPendingUsers = async () => {
    try {
      const response = await apiClient.get('/auth/pending-users/');
      setPendingUsers(response.data);
    } catch (error) {
      console.error("Failed to fetch pending users", error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id) => {
    try {
      await apiClient.post(`/auth/approve-user/${id}/`);
      setPendingUsers(pendingUsers.filter(u => u.id !== id));
      alert("User approved successfully!");
    } catch (error) {
      console.error("Failed to approve user", error);
      alert("Failed to approve user");
    }
  };

  if (loading) return <Loader message="Loading approvals..." />;

  return (
    <div>
      <div style={{ marginBottom: '16px' }}>
        <PageSearchBar placeholder="Search approvals..." />
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 'bold', color: '#1e293b' }}>Pending User Approvals</h1>
      </div>

      <div style={{ backgroundColor: 'white', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
              <th style={{ padding: '16px', fontWeight: '600', color: '#64748b', fontSize: '14px' }}>Name</th>
              <th style={{ padding: '16px', fontWeight: '600', color: '#64748b', fontSize: '14px' }}>Username</th>
              <th style={{ padding: '16px', fontWeight: '600', color: '#64748b', fontSize: '14px' }}>Email</th>
              <th style={{ padding: '16px', fontWeight: '600', color: '#64748b', fontSize: '14px' }}>Role</th>
              <th style={{ padding: '16px', fontWeight: '600', color: '#64748b', fontSize: '14px' }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {pendingUsers.length === 0 ? (
              <tr>
                <td colSpan="5" style={{ padding: '24px', textAlign: 'center', color: '#64748b' }}>No pending approvals.</td>
              </tr>
            ) : (
              pendingUsers.map(user => (
                <tr key={user.id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                  <td style={{ padding: '16px', color: '#1e293b', fontWeight: '500' }}>{user.name}</td>
                  <td style={{ padding: '16px', color: '#475569' }}>{user.username}</td>
                  <td style={{ padding: '16px', color: '#475569' }}>{user.email}</td>
                  <td style={{ padding: '16px', color: '#475569' }}>
                    <span style={{ padding: '4px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: '500', backgroundColor: '#eff6ff', color: '#007bff' }}>
                      {user.role}
                    </span>
                  </td>
                  <td style={{ padding: '16px' }}>
                    <button 
                      onClick={() => handleApprove(user.id)}
                      style={{ padding: '6px 12px', backgroundColor: '#10b981', color: 'white', border: 'none', borderRadius: '6px', fontSize: '14px', fontWeight: '500', cursor: 'pointer' }}
                    >
                      Approve
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminApprovals;
