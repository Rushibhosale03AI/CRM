import React, { useState, useEffect } from 'react';
import DataTable from '../components/DataTable';
import { Edit, Trash2, CheckCircle2, ChevronDown, Filter, LayoutGrid, X } from 'lucide-react';
import apiClient from '../api/apiClient';
import PageSearchBar from '../components/PageSearchBar';
import Loader from '../components/Loader';

const Meetings = () => {
  const [meetings, setMeetings] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const [activeTab, setActiveTab] = useState('In Progress');
  const [showReminder, setShowReminder] = useState(true);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMeetings();
  }, [activeTab]);

  const fetchMeetings = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get('meetings/');
      const filtered = response.data.filter(m => m.status === activeTab);
      setMeetings(filtered);
    } catch (error) {
      console.error("Error fetching meetings:", error);
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    { 
      header: 'Action', 
      accessor: 'action',
      render: () => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', justifyContent: 'center', minWidth: '90px' }}>
          <button style={{ padding: '4px', borderRadius: '4px', backgroundColor: '#fffbeb', color: '#d97706', border: 'none', cursor: 'pointer' }}><Edit style={{ width: '14px', height: '14px' }} /></button>
          <button style={{ padding: '4px', borderRadius: '4px', backgroundColor: '#fef2f2', color: '#dc2626', border: 'none', cursor: 'pointer' }}><Trash2 style={{ width: '14px', height: '14px' }} /></button>
          <button style={{ padding: '4px', borderRadius: '4px', backgroundColor: '#f0fdf4', color: '#16a34a', border: 'none', cursor: 'pointer' }}><CheckCircle2 style={{ width: '14px', height: '14px' }} /></button>
        </div>
      )
    },
    { header: 'Title', accessor: 'title', render: (row) => <span style={{ color: '#2563eb', fontWeight: 600 }}>{row.title}</span> },
    { header: 'Meeting Owner', accessor: 'meeting_owner' },
    { header: 'From Date', accessor: 'from_date', render: (row) => new Date(row.from_date).toLocaleString() },
    { header: 'To Date', accessor: 'to_date', render: (row) => new Date(row.to_date).toLocaleString() },
    { header: 'Status', accessor: 'status' },
  ];

  if (loading) return <Loader message="Loading Meetings..." />;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', maxWidth: '100%', margin: '0 auto' }}>
      
      <div style={{ marginBottom: '-8px' }}>
        <PageSearchBar placeholder="Search meetings..." />
      </div>

      {/* Top Action Bar */}
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'flex-start', gap: '16px', backgroundColor: '#ffffff', padding: '16px 20px', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
        
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
                backgroundColor: activeTab === tab ? '#e0f2fe' : 'transparent',
                color: activeTab === tab ? '#0056b3' : '#64748b',
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
            <strong>Reminder:</strong> After completing a Meeting listed under 'In Progress', you must add the Meeting outcome. If the outcome is not entered, the Meeting will stay in the 'In Progress' tab and won't move to 'Closed'.
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
            onChange={(e) => setSelectedIds(e.target.checked ? meetings.map(m => m.id) : [])}
            checked={selectedIds.length === meetings.length && meetings.length > 0}
            style={{ borderRadius: '4px', width: '16px', height: '16px', border: '1px solid #cbd5e1', accentColor: '#2563eb' }} 
          />
          <span>Select all {meetings.length} rows</span>
        </label>
        
        <button style={{ padding: '4px 8px', backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '4px', color: '#2563eb', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
          <svg style={{ width: '16px', height: '16px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
          <ChevronDown style={{ width: '12px', height: '12px' }} />
        </button>
      </div>

      <div style={{ fontSize: '15px', fontWeight: 'bold', color: '#1e293b', marginTop: '-8px' }}>
        Total Count : {meetings.length} records
      </div>

      <div style={{ overflowX: 'auto' }}>
        <DataTable columns={columns} data={meetings} selectedIds={selectedIds} onSelectAll={(e) => setSelectedIds(e.target.checked ? meetings.map(m => m.id) : [])} />
      </div>
    </div>
  );
};

export default Meetings;
