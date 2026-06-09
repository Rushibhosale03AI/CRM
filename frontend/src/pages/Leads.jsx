import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import DataTable from '../components/DataTable';
import { Edit, Trash2, ChevronDown, Plus, Filter, User, CheckCircle2, XCircle, Download, Upload, List } from 'lucide-react';
import apiClient from '../api/apiClient';

const Leads = () => {
  const [leads, setLeads] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const [activeTab, setActiveTab] = useState('All');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const searchQuery = (searchParams.get('q') || '').toLowerCase();

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
    navigate(`/leads/edit/${id}`);
  };

  const handleDelete = async (id) => {
    try {
      await apiClient.delete(`leads/${id}/`);
      setLeads(leads.filter(lead => lead.id !== id));
    } catch (error) {
      console.error("Error deleting lead:", error);
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
      header: 'Action', 
      render: (row) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'center' }}>
          <button 
            onClick={() => handleEdit(row.id)}
            style={{ padding: '6px', borderRadius: '4px', backgroundColor: '#fffbeb', color: '#d97706', border: 'none', cursor: 'pointer' }}
          >
            <Edit style={{ width: '14px', height: '14px' }} />
          </button>
        </div>
      )
    },
    { header: 'Industry', accessor: 'industry' },
    { header: 'Contact Name', accessor: 'contact_name', render: (row) => <span onClick={() => handleEdit(row.id)} style={{ color: '#0f766e', fontWeight: 600, cursor: 'pointer' }}>{row.contact_name || 'N/A'}</span> },
    { header: 'Company Name', accessor: 'company_name' },
    { header: 'Email Address', accessor: 'email_address' },
    { header: 'Contact No', accessor: 'contact_no' },
    { header: 'Designation', accessor: 'designation' },
    { header: 'Meeting Date', accessor: 'meeting_date' },
    { header: 'AE Assigned', accessor: 'ae_assigned_details', render: (row) => row.ae_assigned_details?.name || row.ae_assigned_details?.username || 'Unassigned' },
    { header: 'Status', accessor: 'status' },
    { header: 'Outcome', accessor: 'outcome' },
    { header: 'LinkedIn Connect', accessor: 'linkedin_connect' },
    { header: 'Demo Call', accessor: 'demo_call' },
    { header: 'Proposal Sent', accessor: 'proposal_sent' },
    { header: 'Closures', accessor: 'closures' },
  ];

  const filteredLeads = leads.filter(lead => {
    if (searchQuery) {
      const match = (
        (lead.contact_name || '').toLowerCase().includes(searchQuery) ||
        (lead.company_name || '').toLowerCase().includes(searchQuery) ||
        (lead.email_address || '').toLowerCase().includes(searchQuery) ||
        (lead.contact_no || '').toLowerCase().includes(searchQuery)
      );
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

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedIds(filteredLeads.map(t => t.id));
    } else {
      setSelectedIds([]);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', maxWidth: '100%', margin: '0 auto' }}>
      
      {/* Top Action Bar */}
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '16px', backgroundColor: '#ffffff', padding: '16px 20px', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
        
        {/* Left Side: Filter Tabs */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
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
                color: activeTab === 'All' ? '#0f766e' : '#64748b',
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
                color: activeTab === 'Active' ? '#0f766e' : '#64748b',
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
                color: activeTab === 'Closed' ? '#0f766e' : '#64748b',
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
                color: activeTab === 'Dead' ? '#0f766e' : '#64748b',
                boxShadow: activeTab === 'Dead' ? '0 1px 2px rgba(0,0,0,0.05)' : 'none'
              }}
            >
              <XCircle style={{ width: '16px', height: '16px' }} /> Dead
            </button>
          </div>
        </div>
          
        {/* Right Side: Action Buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button 
            onClick={handleExport}
            style={{
            padding: '8px 16px',
            backgroundColor: '#ffffff',
            color: '#0f766e',
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
            color: '#0f766e',
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
            <Plus style={{ width: '16px', height: '16px' }} /> Add Lead
          </button>
        </div>
      </div>

      
      <div style={{ fontSize: '15px', fontWeight: 'bold', color: '#1e293b', marginTop: '-8px' }}>
        Total Count : {filteredLeads.length} records
      </div>

      <DataTable columns={columns} data={filteredLeads} selectedIds={selectedIds} onSelectAll={handleSelectAll} />
    </div>
  );
};

export default Leads;
