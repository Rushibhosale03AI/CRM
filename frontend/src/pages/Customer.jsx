import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DataTable from '../components/DataTable';
import { Edit, Trash2, ChevronDown, Plus, Filter, FileText } from 'lucide-react';
import apiClient from '../api/apiClient';

const Customer = () => {
  const [customers, setCustomers] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const [isActionsOpen, setIsActionsOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get('customers/');
      setCustomers(response.data);
    } catch (error) {
      console.error("Error fetching customers:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (id) => {
    navigate(`/customers/edit/${id}`);
  };

  const handleDelete = async (id) => {
    try {
      await apiClient.delete(`customers/${id}/`);
      setCustomers(customers.filter(c => c.id !== id));
    } catch (error) {
      console.error("Error deleting customer:", error);
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
    { header: 'Name', accessor: 'name', render: (row) => <span onClick={() => handleEdit(row.id)} style={{ color: '#0d9488', fontWeight: 600, cursor: 'pointer' }}>{row.name}</span> },
    { header: 'Customer Owner', accessor: 'customer_owner' },
    { header: 'Industry', accessor: 'industry' },
    { header: 'Mobile', accessor: 'mobile' },
    { header: 'Email', accessor: 'email' },
    { header: 'Created At', accessor: 'created_at', render: (row) => new Date(row.created_at).toLocaleString() },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', maxWidth: '100%', margin: '0 auto' }}>
      
      {/* Top Action Bar */}
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '16px', backgroundColor: '#ffffff', padding: '16px 20px', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <button style={{ padding: '8px', backgroundColor: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '6px', color: '#3b82f6', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Filter style={{ width: '16px', height: '16px' }} />
          </button>
          
          <div style={{ position: 'relative' }}>
            <button 
              onClick={() => setIsActionsOpen(!isActionsOpen)}
              style={{
              padding: '8px 16px',
              backgroundColor: '#ffffff',
              border: '1px solid #cbd5e1',
              borderRadius: '6px',
              fontSize: '14px',
              fontWeight: 500,
              color: '#3b82f6',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              cursor: 'pointer'
            }}>
              Actions <ChevronDown style={{ width: '16px', height: '16px' }} />
            </button>
            {isActionsOpen && (
              <div style={{
                position: 'absolute',
                top: '100%',
                left: 0,
                marginTop: '4px',
                backgroundColor: '#ffffff',
                border: '1px solid #e2e8f0',
                borderRadius: '8px',
                boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                minWidth: '160px',
                zIndex: 50,
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden'
              }}>
                {['Mass Update', 'Change Owner', 'Export Customers', 'Delete Selected'].map((action, idx) => (
                  <button
                    key={idx}
                    style={{
                      padding: '10px 16px',
                      textAlign: 'left',
                      backgroundColor: 'transparent',
                      border: 'none',
                      borderBottom: idx !== 3 ? '1px solid #f1f5f9' : 'none',
                      fontSize: '14px',
                      color: action === 'Delete Selected' ? '#ef4444' : '#334155',
                      cursor: 'pointer',
                      fontWeight: 500
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f8fafc'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                    onClick={() => setIsActionsOpen(false)}
                  >
                    {action}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button style={{ padding: '8px', backgroundColor: '#f1f5f9', border: '1px solid #cbd5e1', borderRadius: '6px', color: '#64748b', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <FileText style={{ width: '16px', height: '16px' }} />
          </button>
          <button style={{ padding: '8px', backgroundColor: '#f1f5f9', border: '1px solid #cbd5e1', borderRadius: '6px', color: '#64748b', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg style={{ width: '16px', height: '16px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2"></path></svg>
          </button>
          
          <button 
            onClick={() => navigate('/customers/new')}
            style={{
            padding: '8px 16px',
            backgroundColor: '#1b4353',
            color: '#ffffff',
            border: 'none',
            borderRadius: '6px',
            fontSize: '14px',
            fontWeight: 500,
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            cursor: 'pointer',
            boxShadow: '0 2px 4px rgba(27, 67, 83, 0.2)'
          }}>
            <Plus style={{ width: '16px', height: '16px' }} /> Add Customer
          </button>
        </div>
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
        <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', color: '#334155', fontWeight: 500 }}>
          <input 
            type="checkbox" 
            onChange={(e) => setSelectedIds(e.target.checked ? customers.map(c => c.id) : [])}
            checked={selectedIds.length === customers.length && customers.length > 0}
            style={{ borderRadius: '4px', width: '16px', height: '16px', border: '1px solid #cbd5e1', accentColor: '#0d9488' }} 
          />
          <span>Select all 247 rows</span>
        </label>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <span style={{ fontWeight: 600, color: '#1e293b' }}>Total Count : 247 records</span>
          <div style={{ padding: '4px 8px', backgroundColor: '#f1f5f9', borderRadius: '4px', color: '#3b82f6', cursor: 'pointer' }}>
            <svg style={{ width: '16px', height: '16px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2"></path></svg>
          </div>
        </div>
      </div>

      <DataTable columns={columns} data={customers} selectedIds={selectedIds} onSelectAll={(e) => setSelectedIds(e.target.checked ? customers.map(c => c.id) : [])} />
    </div>
  );
};

export default Customer;
