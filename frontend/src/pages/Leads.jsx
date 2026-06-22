import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { createPortal } from 'react-dom';
import { AuthContext } from '../context/AuthContext';
import DataTable from '../components/DataTable';
import { Edit, Eye, Filter, Plus, FileText, Download, User, CheckCircle2, List, XCircle, Search, Trash2, Upload } from 'lucide-react';
import apiClient from '../api/apiClient';
import PageSearchBar from '../components/PageSearchBar';
import Loader from '../components/Loader';

const Leads = () => {
  const [leads, setLeads] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const [activeTab, setActiveTab] = useState('All');
  const [loading, setLoading] = useState(true);
  const [filterDate, setFilterDate] = useState('');
  const [filterAE, setFilterAE] = useState('');
  const [users, setUsers] = useState([]);
  const [leadToDelete, setLeadToDelete] = useState(null);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const searchQuery = (searchParams.get('q') || '').toLowerCase();
  const searchField = searchParams.get('field') || 'all';
  const { user } = useContext(AuthContext);

  const leadSearchOptions = [
    { label: 'Contact Name', value: 'contact_name' },
    { label: 'Source', value: 'source' },
    { label: 'Call Outcome', value: 'call_outcome' },
    { label: 'Closures', value: 'closures' },
    { label: 'Proposal Sent', value: 'proposal_sent' },
    { label: 'Demo Call', value: 'demo_call' },
    { label: 'Call Status', value: 'call_status' },
    { label: 'Meeting Status', value: 'status' }
  ];

  useEffect(() => {
    fetchLeads();
    if (user && user.role === 'Admin') {
      fetchUsers();
    }
  }, [user]);

  const fetchUsers = async () => {
    try {
      const response = await apiClient.get('/auth/users/');
      setUsers(response.data);
    } catch (error) {
      console.error("Failed to fetch users", error);
    }
  };

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
    navigate(`/leads/edit/${id}`);
  };

  const handleDelete = (id) => {
    setLeadToDelete(id);
  };

  const confirmDeleteLead = async () => {
    if (!leadToDelete) return;
    try {
      await apiClient.delete(`leads/${leadToDelete}/`);
      setLeads(leads.filter(lead => lead.id !== leadToDelete));
      setLeadToDelete(null);
    } catch (error) {
      console.error("Error deleting lead:", error);
      alert(error.response?.data?.error || "Failed to delete lead");
      setLeadToDelete(null);
    }
  };

  const handleExport = async () => {
    try {
      const response = await apiClient.get('leads/export/', { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'leads.xlsx');
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
    } catch (error) {
      console.error("Error exporting leads:", error);
      alert("Failed to export leads.");
    }
  };

  const handleDownloadTemplate = async () => {
    try {
      const response = await apiClient.get('leads/template/', { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'lead_template.xlsx');
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
    } catch (error) {
      console.error("Error downloading template:", error);
      
      let errorMsg = error.message;
      if (error.response && error.response.data) {
        if (error.response.data instanceof Blob) {
            error.response.data.text().then(text => alert("Failed to download template: " + text));
            return;
        } else {
            errorMsg = JSON.stringify(error.response.data);
        }
      }
      alert(`Failed to download template. Error: ${errorMsg}`);
    }
  };

  const handleImport = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    try {
      setLoading(true);
      const response = await apiClient.post('leads/import/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      alert(response.data.message || "Leads imported successfully!");
      setActiveTab('All'); // Switch to 'All' tab so they can see leads that might have closed/won status
      fetchLeads(); // Refresh the table
    } catch (error) {
      console.error("Error importing leads:", error);
      const errorMsg = error.response?.data?.error || error.response?.data?.detail || error.message;
      alert(`Failed to import leads: ${errorMsg}`);
    } finally {
      setLoading(false);
    }
    e.target.value = null; // reset input so same file can be chosen again
  };

  const columns = [
    { 
      header: 'Sr. No.', 
      render: (row, index) => <div style={{ fontWeight: 500, color: '#334155' }}>{index + 1}</div>
    },
    { 
      header: 'Action', 
      render: (row) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'center' }}>
          <button 
            onClick={() => handleEdit(row.id)}
            style={{ padding: '6px', borderRadius: '4px', backgroundColor: '#fffbeb', color: '#d97706', border: 'none', cursor: 'pointer' }}
            title="Edit"
          >
            <Edit style={{ width: '14px', height: '14px' }} />
          </button>
          <button 
            onClick={() => handleDelete(row.id)}
            style={{ padding: '6px', borderRadius: '4px', backgroundColor: '#fef2f2', color: '#ef4444', border: 'none', cursor: 'pointer' }}
            title="Delete"
          >
            <Trash2 style={{ width: '14px', height: '14px' }} />
          </button>
        </div>
      )
    },
    { header: 'Created Date', accessor: 'created_at', render: (row) => row.created_at ? new Date(row.created_at).toLocaleDateString() : 'N/A' },
    { header: 'Industry', accessor: 'industry' },
    { header: 'Contact Name', accessor: 'contact_name', render: (row) => <span onClick={() => handleEdit(row.id)} style={{ fontWeight: 700, cursor: 'pointer', color: '#1e293b' }}>{row.contact_name || 'N/A'}</span> },
    { header: 'Company Name', accessor: 'company_name' },
    { header: 'Email Address', accessor: 'email_address' },
    { header: 'Contact No', accessor: 'contact_no' },
    { header: 'Address', accessor: 'address' },
    { header: 'Designation', accessor: 'designation' },
    { header: 'Meeting Date', accessor: 'meeting_date', render: (row) => {
      if (!row.meeting_date) return '';
      const d = new Date(row.meeting_date);
      return isNaN(d.getTime()) ? '' : d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
    } },
    { header: 'AE Assigned', accessor: 'ae_assigned_details', render: (row) => row.ae_assigned_details?.name || row.ae_assigned_details?.username || 'Unassigned' },
    { header: 'Status', accessor: 'status' },
    { header: 'Call Outcome', accessor: 'call_outcome' },
    { header: 'LinkedIn Connect', accessor: 'linkedin_connect' },
    { header: 'Source', accessor: 'source' },
    { header: 'Call Interaction Time', accessor: 'call_interaction_time' },
    { header: 'Call Status', accessor: 'call_status' },
    { header: 'Demo Call', accessor: 'demo_call' },
    { header: 'Proposal Sent', accessor: 'proposal_sent' },
    { header: 'Closures', accessor: 'closures' },
  ];

  const filteredLeads = leads.filter(lead => {
    if (filterDate) {
      if (!lead.created_at) return false;
      const leadDate = new Date(lead.created_at).toISOString().split('T')[0];
      if (leadDate !== filterDate) return false;
    }

    if (filterAE) {
      if (filterAE === 'unassigned') {
        if (lead.ae_assigned) return false;
      } else {
        if (String(lead.ae_assigned) !== String(filterAE)) return false;
      }
    }

    if (searchQuery) {
      let match = false;
      if (searchField === 'all') {
        match = (
          (lead.contact_name || '').toLowerCase().includes(searchQuery) ||
          (lead.source || '').toLowerCase().includes(searchQuery) ||
          (lead.call_outcome || '').toLowerCase().includes(searchQuery) ||
          (lead.closures || '').toLowerCase().includes(searchQuery) ||
          (lead.proposal_sent || '').toLowerCase().includes(searchQuery) ||
          (lead.demo_call || '').toLowerCase().includes(searchQuery) ||
          (lead.call_status || '').toLowerCase().includes(searchQuery) ||
          (lead.status || '').toLowerCase().includes(searchQuery)
        );
      } else {
        match = (lead[searchField] || '').toLowerCase().includes(searchQuery);
      }
      if (!match) return false;
    }

    if (activeTab === 'All') return true;

    const closureStatus = (lead.closures || '').toLowerCase();
    const outcome = (lead.outcome || '').toLowerCase();
    
    if (activeTab === 'Closed') {
      return closureStatus.includes('won') || closureStatus.includes('closed');
    }
    if (activeTab === 'Dead') {
      return closureStatus.includes('lost') || outcome.includes('not qualified') || closureStatus.includes('dead');
    }
    // Active
    return !closureStatus.includes('won') && !closureStatus.includes('lost') && !closureStatus.includes('closed') && !closureStatus.includes('dead') && !outcome.includes('not qualified');
  });

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const getSortGroup = (dateStr) => {
    if (!dateStr) return 2;
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return 2;
    
    const meetDate = new Date(d);
    meetDate.setHours(0, 0, 0, 0);
    
    if (meetDate < today) return 1; // Past dates
    return 0; // Today and future dates
  };

  const sortedLeads = [...filteredLeads].sort((a, b) => {
    const groupA = getSortGroup(a.meeting_date);
    const groupB = getSortGroup(b.meeting_date);

    if (groupA !== groupB) {
      return groupA - groupB;
    }

    if (groupA === 0) {
      // Future and today: Ascending (today first, then tomorrow, etc.)
      return new Date(a.meeting_date) - new Date(b.meeting_date);
    }
    
    if (groupA === 1) {
      // Past dates: Descending (most recent past first, older ones at the bottom)
      return new Date(b.meeting_date) - new Date(a.meeting_date);
    }
    
    return 0;
  });

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedIds(filteredLeads.map(t => t.id));
    } else {
      setSelectedIds([]);
    }
  };

  if (loading) return <Loader message="Loading Leads..." />;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', maxWidth: '100%', margin: '0 auto' }}>
      
      <div style={{ marginBottom: '-8px' }}>
        <PageSearchBar placeholder="Search leads..." searchOptions={leadSearchOptions} />
      </div>

      {/* Top Action Bar */}
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '16px', backgroundColor: '#ffffff', padding: '16px 20px', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
        
        {/* Left Side: Filter Tabs */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', backgroundColor: '#f8fafc', borderRadius: '8px', padding: '4px', border: '1px solid #e2e8f0' }}>
            <button
              onClick={() => setActiveTab('All')}
              style={{
                padding: '6px 16px',
                fontSize: '14px',
                fontWeight: 600,
                borderRadius: '6px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                cursor: 'pointer',
                border: activeTab === 'All' ? '1px solid #cbd5e1' : '1px solid transparent',
                backgroundColor: activeTab === 'All' ? '#ffffff' : 'transparent',
                color: activeTab === 'All' ? '#2563eb' : '#64748b',
                boxShadow: activeTab === 'All' ? '0 1px 2px rgba(0,0,0,0.05)' : 'none'
              }}
            >
              <List style={{ width: '16px', height: '16px' }} /> All
            </button>
            <button
              onClick={() => setActiveTab('Active')}
              style={{
                padding: '6px 16px',
                fontSize: '14px',
                fontWeight: 600,
                borderRadius: '6px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                cursor: 'pointer',
                border: activeTab === 'Active' ? '1px solid #cbd5e1' : '1px solid transparent',
                backgroundColor: activeTab === 'Active' ? '#ffffff' : 'transparent',
                color: activeTab === 'Active' ? '#2563eb' : '#64748b',
                boxShadow: activeTab === 'Active' ? '0 1px 2px rgba(0,0,0,0.05)' : 'none'
              }}
            >
              <User style={{ width: '16px', height: '16px' }} /> Active
            </button>
            <button
              onClick={() => setActiveTab('Closed')}
              style={{
                padding: '6px 16px',
                fontSize: '14px',
                fontWeight: 600,
                borderRadius: '6px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                cursor: 'pointer',
                border: activeTab === 'Closed' ? '1px solid #cbd5e1' : '1px solid transparent',
                backgroundColor: activeTab === 'Closed' ? '#ffffff' : 'transparent',
                color: activeTab === 'Closed' ? '#2563eb' : '#64748b',
                boxShadow: activeTab === 'Closed' ? '0 1px 2px rgba(0,0,0,0.05)' : 'none'
              }}
            >
              <CheckCircle2 style={{ width: '16px', height: '16px' }} /> Closed
            </button>
            <button
              onClick={() => setActiveTab('Dead')}
              style={{
                padding: '6px 16px',
                fontSize: '14px',
                fontWeight: 600,
                borderRadius: '6px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                cursor: 'pointer',
                border: activeTab === 'Dead' ? '1px solid #cbd5e1' : '1px solid transparent',
                backgroundColor: activeTab === 'Dead' ? '#ffffff' : 'transparent',
                color: activeTab === 'Dead' ? '#2563eb' : '#64748b',
                boxShadow: activeTab === 'Dead' ? '0 1px 2px rgba(0,0,0,0.05)' : 'none'
              }}
            >
              <XCircle style={{ width: '16px', height: '16px' }} /> Dead
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

          {user && user.role === 'Admin' && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '14px', fontWeight: 500, color: '#64748b' }}>AE Assigned:</span>
              <select 
                value={filterAE}
                onChange={(e) => setFilterAE(e.target.value)}
                style={{ padding: '6px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '14px', outline: 'none', color: '#1e293b', backgroundColor: 'white' }}
              >
                <option value="">All</option>
                <option value="unassigned">Unassigned</option>
                {users.map(u => (
                  <option key={u.id} value={u.id}>{u.name || u.username}</option>
                ))}
              </select>
            </div>
          )}
        </div>
          
        {/* Right Side: Action Buttons */}
        <div className="responsive-flex-wrap responsive-w-full" style={{ display: 'flex', alignItems: 'center', gap: '12px', justifyContent: 'flex-end', flex: 1 }}>
          <button 
            onClick={handleDownloadTemplate}
            style={{
            padding: '8px 16px',
            backgroundColor: '#ffffff',
            color: '#64748b',
            border: '1px solid #cbd5e1',
            borderRadius: '6px',
            fontSize: '14px',
            fontWeight: 500,
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            cursor: 'pointer',
            boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
          }}>
            <FileText style={{ width: '16px', height: '16px' }} /> Template
          </button>

          <button 
            onClick={handleExport}
            style={{
            padding: '8px 16px',
            backgroundColor: '#ffffff',
            color: '#2563eb',
            border: '1px solid #cbd5e1',
            borderRadius: '6px',
            fontSize: '14px',
            fontWeight: 500,
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            cursor: 'pointer',
            boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
          }}>
            <Download style={{ width: '16px', height: '16px' }} /> Export
          </button>

          <label style={{
            padding: '8px 16px',
            backgroundColor: '#ffffff',
            color: '#2563eb',
            border: '1px solid #cbd5e1',
            borderRadius: '6px',
            fontSize: '14px',
            fontWeight: 500,
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            cursor: 'pointer',
            margin: 0,
            boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
          }}>
            <Upload style={{ width: '16px', height: '16px' }} /> Import
            <input type="file" accept=".xlsx, .xls" style={{ display: 'none' }} onChange={handleImport} />
          </label>

          <button 
            onClick={() => navigate('/leads/new')}
            style={{
            padding: '8px 16px',
            backgroundColor: '#2563eb',
            color: '#ffffff',
            border: 'none',
            borderRadius: '6px',
            fontSize: '14px',
            fontWeight: 500,
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            cursor: 'pointer',
            boxShadow: '0 4px 6px -1px rgba(15, 118, 110, 0.2)'
          }}>
            <Plus style={{ width: '16px', height: '16px' }} /> Add Lead
          </button>
        </div>
      </div>

      
      <div style={{ fontSize: '15px', fontWeight: 'bold', color: '#1e293b', marginTop: '-8px' }}>
        Total Count : {sortedLeads.length} records
      </div>

      <DataTable columns={columns} data={sortedLeads} selectedIds={selectedIds} onSelectAll={handleSelectAll} rowsPerPage={25} />

      {leadToDelete && createPortal(
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
              Are you sure you want to delete this lead? This action cannot be undone.
            </p>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
              <button 
                onClick={() => setLeadToDelete(null)}
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
                onClick={confirmDeleteLead}
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

export default Leads;
