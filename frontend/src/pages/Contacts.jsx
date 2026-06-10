import React, { useState, useEffect } from 'react';
import DataTable from '../components/DataTable';
import { Edit, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import apiClient from '../api/apiClient';
import PageSearchBar from '../components/PageSearchBar';

const Contacts = () => {
  const [contacts, setContacts] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get('contacts/');
      setContacts(response.data);
    } catch (error) {
      console.error("Error fetching contacts:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (id) => {
    navigate(`/contacts/edit/${id}`);
  };

  const handleDelete = async (id) => {
    try {
      await apiClient.delete(`contacts/${id}/`);
      setContacts(contacts.filter(c => c.id !== id));
    } catch (error) {
      console.error("Error deleting contact:", error);
    }
  };

  const columns = [
    { 
      header: 'Action', 
      accessor: 'action',
      render: (row) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'center' }}>
          <button 
            onClick={() => handleEdit(row.id)}
            style={{ padding: '6px', borderRadius: '4px', backgroundColor: '#fffbeb', color: '#d97706', border: 'none', cursor: 'pointer' }}
          >
            <Edit style={{ width: '14px', height: '14px' }} />
          </button>
          <button 
            onClick={() => handleDelete(row.id)}
            style={{ padding: '6px', borderRadius: '4px', backgroundColor: '#fef2f2', color: '#dc2626', border: 'none', cursor: 'pointer' }}
          >
            <Trash2 style={{ width: '14px', height: '14px' }} />
          </button>
        </div>
      )
    },
    { header: 'Contact Name', accessor: 'name', render: (row) => <span onClick={() => handleEdit(row.id)} style={{ color: '#0f766e', fontWeight: 600, cursor: 'pointer' }}>{row.name}</span> },
    { header: 'Customer Name', accessor: 'customer' },
    { header: 'Email', accessor: 'email' },
    { header: 'Mobile', accessor: 'mobile' },
    { header: 'Job Title', accessor: 'job_title' },
    { header: 'Phone', accessor: 'phone' },
    { header: 'Lead Source', accessor: 'lead_source' },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', maxWidth: '100%', margin: '0 auto' }}>
      
      <div style={{ marginBottom: '-8px' }}>
        <PageSearchBar placeholder="Search contacts..." />
      </div>

      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        fontSize: '14px',
        color: '#64748b',
        backgroundColor: '#ffffff',
        padding: '12px 20px',
        borderRadius: '12px',
        border: '1px solid #e2e8f0',
        boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', color: '#334155', fontWeight: 500 }}>
            <input 
              type="checkbox" 
              onChange={(e) => setSelectedIds(e.target.checked ? contacts.map(c => c.id) : [])}
              checked={selectedIds.length === contacts.length && contacts.length > 0}
              style={{ borderRadius: '4px', width: '16px', height: '16px', border: '1px solid #cbd5e1', accentColor: '#0d9488' }} 
            />
            <span>Select all {contacts.length} rows</span>
          </label>
          <span style={{ fontWeight: 'bold', color: '#1e293b', marginLeft: '4px' }}>Total Count : {contacts.length} records</span>
        </div>

        <button style={{ padding: '4px 8px', backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '4px', color: '#0f766e', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <svg style={{ width: '16px', height: '16px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
        </button>
      </div>

      <div style={{ overflowX: 'auto' }}>
        <DataTable columns={columns} data={contacts} selectedIds={selectedIds} onSelectAll={(e) => setSelectedIds(e.target.checked ? contacts.map(c => c.id) : [])} />
      </div>
    </div>
  );
};

export default Contacts;
