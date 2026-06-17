import React, { useState, useEffect, useContext } from 'react';
import apiClient from '../api/apiClient';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { createPortal } from 'react-dom';
import Loader from '../components/Loader';
import PageSearchBar from '../components/PageSearchBar';
import { Trash2 } from 'lucide-react';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userToDelete, setUserToDelete] = useState(null);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (user && user.role !== 'Admin') {
      navigate('/');
    } else {
      fetchUsers();
    }
  }, [user, navigate]);

  const fetchUsers = async () => {
    try {
      const response = await apiClient.get('/auth/users/');
      setUsers(response.data);
    } catch (error) {
      console.error("Failed to fetch users", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (id, name) => {
    setUserToDelete({ id, name });
  };

  const confirmDeleteUser = async () => {
    if (!userToDelete) return;
    try {
      await apiClient.delete(`/auth/users/${userToDelete.id}/`);
      setUsers(users.filter(u => u.id !== userToDelete.id));
      alert("User deleted successfully!");
      setUserToDelete(null);
    } catch (error) {
      console.error("Failed to delete user", error);
      alert(error.response?.data?.error || "Failed to delete user");
      setUserToDelete(null);
    }
  };

  if (loading) return <Loader message="Loading users..." />;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', maxWidth: '100%', margin: '0 auto' }}>
      
      <div style={{ marginBottom: '-8px' }}>
        <PageSearchBar placeholder="Search users..." />
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 'bold', color: '#1e293b' }}>Manage Users</h1>
      </div>

      <div style={{ backgroundColor: 'white', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
              <th style={{ padding: '16px', fontWeight: '600', color: '#64748b', fontSize: '14px' }}>Name</th>
              <th style={{ padding: '16px', fontWeight: '600', color: '#64748b', fontSize: '14px' }}>Username</th>
              <th style={{ padding: '16px', fontWeight: '600', color: '#64748b', fontSize: '14px' }}>Email</th>
              <th style={{ padding: '16px', fontWeight: '600', color: '#64748b', fontSize: '14px' }}>Role</th>
              <th style={{ padding: '16px', fontWeight: '600', color: '#64748b', fontSize: '14px', textAlign: 'center' }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {users.length === 0 ? (
              <tr>
                <td colSpan="5" style={{ padding: '24px', textAlign: 'center', color: '#64748b' }}>No users found.</td>
              </tr>
            ) : (
              users.map(u => (
                <tr key={u.id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                  <td style={{ padding: '16px', color: '#1e293b', fontWeight: '500' }}>{u.name}</td>
                  <td style={{ padding: '16px', color: '#475569' }}>{u.username}</td>
                  <td style={{ padding: '16px', color: '#475569' }}>{u.email}</td>
                  <td style={{ padding: '16px', color: '#475569' }}>
                    <span style={{ padding: '4px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: '500', backgroundColor: u.role === 'Admin' ? '#fef2f2' : '#eff6ff', color: u.role === 'Admin' ? '#ef4444' : '#007bff' }}>
                      {u.role}
                    </span>
                  </td>
                  <td style={{ padding: '16px', textAlign: 'center' }}>
                    {u.id !== user?.id && (
                      <button 
                        onClick={() => handleDelete(u.id, u.name)}
                        style={{ padding: '6px', borderRadius: '4px', backgroundColor: '#fef2f2', color: '#ef4444', border: 'none', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}
                        title="Delete User"
                      >
                        <Trash2 style={{ width: '16px', height: '16px' }} />
                      </button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {userToDelete && createPortal(
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
              <Trash2 style={{ width: '24px', height: '24px' }} />
            </div>
            <h2 style={{ margin: '0 0 8px 0', fontSize: '18px', fontWeight: 'bold', color: '#1e293b' }}>Confirm Delete</h2>
            <p style={{ margin: '0 0 24px 0', fontSize: '14px', color: '#64748b', lineHeight: '1.5' }}>
              Are you sure you want to permanently delete user "{userToDelete.name}" and all of their personal activity records (Calls, Meetings, Todos)? <br/><br/> Note: Their Leads and Customers will NOT be deleted, but will become unassigned.
            </p>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
              <button 
                onClick={() => setUserToDelete(null)}
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
              >
                Cancel
              </button>
              <button 
                onClick={confirmDeleteUser}
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
              >
                Delete
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}

    </div>
  );
};

export default AdminUsers;
