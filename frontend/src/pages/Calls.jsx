import React, { useState, useEffect } from 'react';
import DataTable from '../components/DataTable';
import { Edit, Trash2, CheckCircle2, ChevronDown, Plus, Filter, LayoutGrid, X } from 'lucide-react';

import { useNavigate } from 'react-router-dom';
import apiClient from '../api/apiClient';

const Calls = () => {
  const [calls, setCalls] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const [activeTab, setActiveTab] = useState('In Progress');
  const [showReminder, setShowReminder] = useState(true);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCalls();
  }, [activeTab]);

  const fetchCalls = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get('calls/');
      // Filter calls by tab (if status matches tab name, adjust as needed depending on real status values)
      const filtered = response.data.filter(c => c.status === activeTab);
      setCalls(filtered);
    } catch (error) {
      console.error("Error fetching calls:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (id) => {
    navigate(`/calls/edit/${id}`);
  };

  const handleDelete = async (id) => {
    try {
      await apiClient.delete(`calls/${id}/`);
      setCalls(calls.filter(c => c.id !== id));
    } catch (error) {
      console.error("Error deleting call:", error);
    }
  };

  const columns = [
    { 
      header: 'Action', 
      accessor: 'action',
      render: (row) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', justifyContent: 'center', minWidth: '90px' }}>
          <button 
            onClick={() => handleEdit(row.id)}
            style={{ padding: '4px', borderRadius: '4px', backgroundColor: '#fffbeb', color: '#d97706', border: 'none', cursor: 'pointer' }}
          >
            <Edit style={{ width: '14px', height: '14px' }} />
          </button>
          <button 
            onClick={() => handleDelete(row.id)}
            style={{ padding: '4px', borderRadius: '4px', backgroundColor: '#fef2f2', color: '#dc2626', border: 'none', cursor: 'pointer' }}
          >
            <Trash2 style={{ width: '14px', height: '14px' }} />
          </button>
          <button style={{ padding: '4px', borderRadius: '4px', backgroundColor: '#f0fdf4', color: '#16a34a', border: 'none', cursor: 'pointer' }}>
            <CheckCircle2 style={{ width: '14px', height: '14px' }} />
          </button>
        </div>
      )
    },
    { header: 'Title', accessor: 'title', render: (row) => <span onClick={() => handleEdit(row.id)} style={{ color: '#0d9488', fontWeight: 600, cursor: 'pointer' }}>{row.title}</span> },
    { header: 'Call Owner', accessor: 'call_owner' },
    { header: 'Status', accessor: 'status' },
    { header: 'Start Date', accessor: 'start_date', render: (row) => new Date(row.start_date).toLocaleString() },
    { header: 'Reminder', accessor: 'reminder_time', render: (row) => row.reminder_time ? new Date(row.reminder_time).toLocaleString() : '-' },
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
          
          <button style={{
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
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0px', backgroundColor: '#f8fafc', borderRadius: '8px', padding: '4px', border: '1px solid #e2e8f0' }}>
          {['Scheduled', 'In Progress', 'Closed'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                padding: '8px 24px',
                fontSize: '14px',
                fontWeight: 600,
                borderRadius: '6px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                cursor: 'pointer',
                border: activeTab === tab ? '1px solid #cbd5e1' : '1px solid transparent',
                backgroundColor: activeTab === tab ? '#ffffff' : 'transparent',
                color: activeTab === tab ? '#0f766e' : '#64748b',
                boxShadow: activeTab === tab ? '0 1px 2px rgba(0,0,0,0.05)' : 'none'
              }}
            >
              {tab === 'Scheduled' && <LayoutGrid style={{ width: '16px', height: '16px' }} />}
              {tab === 'In Progress' && <div style={{ width: '16px', height: '16px', border: '2px solid currentColor', borderTopColor: 'transparent', borderRadius: '50%' }}></div>}
              {tab === 'Closed' && <CheckCircle2 style={{ width: '16px', height: '16px' }} />}
              {tab}
            </button>
          ))}
        </div>

        <button 
          onClick={() => navigate('/calls/new')}
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
          <Plus style={{ width: '16px', height: '16px' }} /> Add Call <ChevronDown style={{ width: '16px', height: '16px' }} />
        </button>
      </div>

      {showReminder && (
        <div style={{
          backgroundColor: '#e0f2fe',
          border: '1px solid #bae6fd',
          borderRadius: '8px',
          padding: '12px 16px',
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          color: '#0369a1',
          fontSize: '14px',
          lineHeight: '1.5'
        }}>
          <span>
            <strong>Reminder:</strong> After completing a call listed under 'In Progress', you must add the callOutcome. If the Outcome is not entered, the call will stay in the 'In Progress,' tab and won't move to 'Closed'.
          </span>
          <button onClick={() => setShowReminder(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#7dd3fc', padding: '4px' }}>
            <X style={{ width: '16px', height: '16px' }} />
          </button>
        </div>
      )}

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
            onChange={(e) => setSelectedIds(e.target.checked ? calls.map(c => c.id) : [])}
            checked={selectedIds.length === calls.length && calls.length > 0}
            style={{ borderRadius: '4px', width: '16px', height: '16px', border: '1px solid #cbd5e1', accentColor: '#0d9488' }} 
          />
          <span>Select all {calls.length} rows</span>
        </label>
      </div>

      <div style={{ fontSize: '15px', fontWeight: 'bold', color: '#1e293b', marginTop: '-8px' }}>
        Total Count : {calls.length} records
      </div>

      <div style={{ overflowX: 'auto' }}>
        <DataTable columns={columns} data={calls} selectedIds={selectedIds} onSelectAll={(e) => setSelectedIds(e.target.checked ? calls.map(c => c.id) : [])} />
      </div>
    </div>
  );
};

export default Calls;
