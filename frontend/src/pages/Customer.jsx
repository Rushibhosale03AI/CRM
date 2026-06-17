import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DataTable from '../components/DataTable';
import { Edit, Trash2, Calendar, Clock, List, XCircle } from 'lucide-react';
import apiClient from '../api/apiClient';
import PageSearchBar from '../components/PageSearchBar';
import Loader from '../components/Loader';

const Customer = () => {
  const [leads, setLeads] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const [activeTab, setActiveTab] = useState('All Active');
  const [filterDate, setFilterDate] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchLeads();
  }, []);

  const fetchLeads = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get('leads/');
      setLeads(response.data);
    } catch (error) {
      console.error("Error fetching leads:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (id) => {
    // Navigate to Lead Edit since we are showing leads
    navigate(`/leads/edit/${id}`);
  };

  const handleDelete = async (id) => {
    try {
      await apiClient.delete(`leads/${id}/`);
      setLeads(leads.filter(c => c.id !== id));
    } catch (error) {
      console.error("Error deleting lead:", error);
    }
  };

  const columns = [
    { 
      header: 'Sr. No.', 
      render: (row, index) => <div style={{ fontWeight: 500, color: '#334155' }}>{index + 1}</div>
    },
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
    { header: 'Created Date', accessor: 'created_at', render: (row) => row.created_at ? new Date(row.created_at).toLocaleDateString('en-GB') : 'N/A' },
    { header: 'Contact Name', accessor: 'contact_name', render: (row) => <span onClick={() => handleEdit(row.id)} style={{ fontWeight: 700, cursor: 'pointer', color: '#1e293b' }}>{row.contact_name || 'N/A'}</span> },
    { header: 'Assigned AE', accessor: 'ae_assigned_details', render: (row) => row.ae_assigned_details?.name || row.ae_assigned_details?.username || 'Unassigned' },
    { header: 'Industry', accessor: 'industry' },
    { header: 'Contact No', accessor: 'contact_no' },
    { header: 'Email', accessor: 'email_address' },
    { header: 'Meeting Date', accessor: 'meeting_date', render: (row) => row.meeting_date ? new Date(row.meeting_date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : '' },
    { header: 'Call Outcome', accessor: 'call_outcome' },
    { header: 'Demo Call', accessor: 'demo_call' },
    { header: 'Proposal Sent', accessor: 'proposal_sent' }
  ];

  // 1. Only show "Active" leads
  const activeLeads = leads.filter(lead => {
    const closureStatus = (lead.closures || '').toLowerCase();
    const outcome = (lead.outcome || '').toLowerCase();
    return !closureStatus.includes('won') && !closureStatus.includes('lost') && !closureStatus.includes('closed') && !closureStatus.includes('dead') && !outcome.includes('not qualified');
  });

  // 2. Apply Filters (Follow-up, Pending, Date)
  const filteredData = activeLeads.filter(lead => {
    // Date filter
    if (filterDate) {
      const createdAt = lead.created_at ? new Date(lead.created_at).toISOString().split('T')[0] : '';
      const meetingDate = lead.meeting_date ? new Date(lead.meeting_date).toISOString().split('T')[0] : '';
      const convoDate = lead.conversation_time ? new Date(lead.conversation_time).toISOString().split('T')[0] : '';
      
      if (createdAt !== filterDate && meetingDate !== filterDate && convoDate !== filterDate) return false;
    }

    if (activeTab === 'All Active') return true;

    if (activeTab === 'Follow-up') {
      const callOut = (lead.call_outcome || '').toLowerCase();
      const meetType = (lead.meeting_type || '').toLowerCase();
      // Sometimes "followup meeting" might be indicated by outcome
      return callOut.includes('follow-up') || callOut.includes('follow up') || meetType.includes('follow');
    }

    if (activeTab === 'Pending') {
      const demo = (lead.demo_call || '').toLowerCase();
      const prop = (lead.proposal_sent || '').toLowerCase();
      const close = (lead.closures || '').toLowerCase();
      return demo.includes('pending') || prop.includes('pending') || close.includes('pending');
    }

    return true;
  });

  if (loading) return <Loader message="Loading Customer..." />;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', maxWidth: '100%', margin: '0 auto' }}>
      
      <div style={{ marginBottom: '-8px' }}>
        <PageSearchBar placeholder="Search active leads..." />
      </div>

      {/* Top Action Bar */}
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '16px', backgroundColor: '#ffffff', padding: '16px 20px', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
        
        {/* Left Side: Filter Tabs */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', backgroundColor: '#f8fafc', borderRadius: '8px', padding: '4px', border: '1px solid #e2e8f0' }}>
            <button
              onClick={() => setActiveTab('All Active')}
              style={{
                padding: '6px 16px',
                fontSize: '14px',
                fontWeight: 600,
                borderRadius: '6px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                cursor: 'pointer',
                border: activeTab === 'All Active' ? '1px solid #cbd5e1' : '1px solid transparent',
                backgroundColor: activeTab === 'All Active' ? '#ffffff' : 'transparent',
                color: activeTab === 'All Active' ? '#2563eb' : '#64748b',
                boxShadow: activeTab === 'All Active' ? '0 1px 2px rgba(0,0,0,0.05)' : 'none'
              }}
            >
              <List style={{ width: '16px', height: '16px' }} /> All Active
            </button>
            <button
              onClick={() => setActiveTab('Follow-up')}
              style={{
                padding: '6px 16px',
                fontSize: '14px',
                fontWeight: 600,
                borderRadius: '6px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                cursor: 'pointer',
                border: activeTab === 'Follow-up' ? '1px solid #cbd5e1' : '1px solid transparent',
                backgroundColor: activeTab === 'Follow-up' ? '#ffffff' : 'transparent',
                color: activeTab === 'Follow-up' ? '#2563eb' : '#64748b',
                boxShadow: activeTab === 'Follow-up' ? '0 1px 2px rgba(0,0,0,0.05)' : 'none'
              }}
            >
              <Calendar style={{ width: '16px', height: '16px' }} /> Follow-up
            </button>
            <button
              onClick={() => setActiveTab('Pending')}
              style={{
                padding: '6px 16px',
                fontSize: '14px',
                fontWeight: 600,
                borderRadius: '6px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                cursor: 'pointer',
                border: activeTab === 'Pending' ? '1px solid #cbd5e1' : '1px solid transparent',
                backgroundColor: activeTab === 'Pending' ? '#ffffff' : 'transparent',
                color: activeTab === 'Pending' ? '#2563eb' : '#64748b',
                boxShadow: activeTab === 'Pending' ? '0 1px 2px rgba(0,0,0,0.05)' : 'none'
              }}
            >
              <Clock style={{ width: '16px', height: '16px' }} /> Pending
            </button>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '14px', fontWeight: 500, color: '#64748b' }}>Date:</span>
            <input 
              type="date" 
              value={filterDate}
              onChange={(e) => setFilterDate(e.target.value)}
              style={{ padding: '6px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '14px', outline: 'none', color: '#1e293b' }}
            />
            {filterDate && (
              <button onClick={() => setFilterDate('')} style={{ padding: '4px', background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', display: 'flex', alignItems: 'center' }} title="Clear Date">
                <XCircle style={{ width: '16px', height: '16px' }} />
              </button>
            )}
          </div>
        </div>
      </div>

      <div style={{ fontSize: '15px', fontWeight: 'bold', color: '#1e293b', marginTop: '-8px' }}>
        Total Count : {filteredData.length} active leads
      </div>

      <DataTable columns={columns} data={filteredData} selectedIds={selectedIds} onSelectAll={(e) => setSelectedIds(e.target.checked ? filteredData.map(c => c.id) : [])} rowsPerPage={25} />
    </div>
  );
};

export default Customer;
