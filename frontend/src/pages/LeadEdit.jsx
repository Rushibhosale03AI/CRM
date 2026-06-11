import React, { useState, useEffect } from 'react';
import { ChevronDown, X } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import apiClient from '../api/apiClient';

const CustomSelect = ({ label, name, value, onChange, options, placeholder, isRequired, hasClear }) => {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', position: 'relative' }}>
      <label style={{ fontSize: '13px', fontWeight: 600, color: '#475569' }}>
        {label} {isRequired && <span style={{ color: '#ef4444' }}>*</span>}
      </label>
      <div 
        onClick={() => setIsOpen(!isOpen)}
        style={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between',
          padding: '10px 14px', 
          border: '1px solid #cbd5e1', 
          borderRadius: '8px', 
          backgroundColor: '#ffffff',
          cursor: 'pointer',
          color: value ? '#1e293b' : '#94a3b8',
          fontSize: '14px',
          boxShadow: '0 1px 2px rgba(0,0,0,0.02)'
        }}
      >
        <span>{options.find(opt => (opt.value || opt) === value)?.label || value || placeholder}</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {hasClear && value && (
            <X style={{ width: '14px', height: '14px', color: '#94a3b8', cursor: 'pointer' }} onClick={(e) => { e.stopPropagation(); if(onChange) onChange({ target: { name, value: '' } }); }} />
          )}
          <ChevronDown style={{ width: '16px', height: '16px', color: '#94a3b8' }} />
        </div>
      </div>
      
      {isOpen && (
        <div style={{ 
          position: 'absolute', 
          top: '100%', 
          left: 0, 
          right: 0, 
          marginTop: '4px', 
          backgroundColor: '#ffffff', 
          border: '1px solid #e2e8f0', 
          borderRadius: '8px', 
          boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
          zIndex: 50,
          maxHeight: '240px',
          overflowY: 'auto',
          padding: '4px 0'
        }}>
          {options.map((opt, i) => (
            <div 
              key={i} 
              style={{ 
                padding: '10px 16px', 
                fontSize: '13px', 
                color: opt === value ? '#ffffff' : '#334155', 
                backgroundColor: opt === value ? '#1b4353' : 'transparent',
                cursor: 'pointer',
              }}
              onMouseEnter={(e) => { if(opt !== value) e.target.style.backgroundColor = '#f1f5f9'; }}
              onMouseLeave={(e) => { if(opt !== value) e.target.style.backgroundColor = 'transparent'; }}
              onClick={() => {
                if(onChange) onChange({ target: { name, value: opt.value || opt } });
                setIsOpen(false);
              }}
            >
              {opt.label || opt}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const TextInput = ({ label, name, value, onChange, placeholder, isRequired, type = "text", error, disabled }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
    <label style={{ fontSize: '13px', fontWeight: 600, color: '#475569' }}>
      {label} {isRequired && <span style={{ color: '#ef4444' }}>*</span>}
    </label>
    <input 
      type={type} 
      name={name}
      value={value || ''}
      onChange={onChange}
      placeholder={placeholder}
      disabled={disabled}
      style={{
        padding: '10px 14px',
        border: error ? '1px solid #ef4444' : '1px solid #cbd5e1',
        borderRadius: '8px',
        fontSize: '14px',
        color: disabled ? '#94a3b8' : '#1e293b',
        backgroundColor: disabled ? '#f8fafc' : '#ffffff',
        cursor: disabled ? 'not-allowed' : 'text',
        outline: 'none',
        boxShadow: '0 1px 2px rgba(0,0,0,0.02)'
      }}
    />
    {error && <span style={{ color: '#ef4444', fontSize: '12px', marginTop: '-2px' }}>{error}</span>}
  </div>
);

const PhoneInput = ({ label, name, value, onChange, code, isRequired }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
    <label style={{ fontSize: '13px', fontWeight: 600, color: '#475569' }}>
      {label} {isRequired && <span style={{ color: '#ef4444' }}>*</span>}
    </label>
    <div style={{ display: 'flex', gap: '8px' }}>
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between',
        padding: '10px 14px', 
        border: '1px solid #cbd5e1', 
        borderRadius: '8px', 
        backgroundColor: '#ffffff',
        width: '140px',
        color: '#1e293b',
        fontSize: '14px',
        boxShadow: '0 1px 2px rgba(0,0,0,0.02)'
      }}>
        <span>{code}</span>
        <ChevronDown style={{ width: '16px', height: '16px', color: '#94a3b8' }} />
      </div>
      <input 
        type="text" 
        name={name}
        value={value || ''}
        onChange={onChange}
        placeholder={label}
        style={{
          flex: 1,
          padding: '10px 14px',
          border: '1px solid #cbd5e1',
          borderRadius: '8px',
          fontSize: '14px',
          color: '#1e293b',
          backgroundColor: '#ffffff',
          outline: 'none',
          boxShadow: '0 1px 2px rgba(0,0,0,0.02)'
        }}
      />
    </div>
  </div>
);

const LeadEdit = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(!!id);
  const [users, setUsers] = useState([]);
  const [formData, setFormData] = useState({
    industry: '',
    contact_name: '',
    company_name: '',
    email_address: '',
    contact_no: '',
    designation: '',
    meeting_date: '',
    ae_assigned: '',
    status: '',
    outcome: '',
    linkedin_connect: '',
    demo_call: '',
    proposal_sent: '',
    closures: ''
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetchUsers();
    if (id) {
      fetchLead();
    }
  }, [id]);

  const fetchUsers = async () => {
    try {
      const response = await apiClient.get('auth/users/');
      setUsers(response.data.map(u => ({ value: u.id, label: u.name || u.username || u.email })));
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const fetchLead = async () => {
    try {
      const response = await apiClient.get(`leads/${id}/`);
      setFormData(response.data);
    } catch (error) {
      console.error("Error fetching lead:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (formData.contact_no) {
      // Allow optional +, digits, spaces, and hyphens (min 7, max 15 chars)
      const phoneRegex = /^[+]?[\d\s-]{7,20}$/;
      if (!phoneRegex.test(formData.contact_no)) {
        newErrors.contact_no = "Invalid format. Use digits, spaces, hyphens, or a leading +";
      }
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) return;
    try {
      // Remove empty foreign keys and fields to prevent validation errors
      const payload = { ...formData };
      if (!payload.ae_assigned) delete payload.ae_assigned;
      
      if (id) {
        await apiClient.put(`leads/${id}/`, payload);
      } else {
        await apiClient.post('leads/', payload);
      }
      navigate('/leads');
    } catch (error) {
      console.error("Error saving lead:", error);
      alert("Failed to save lead: " + (error.response?.data ? JSON.stringify(error.response.data) : error.message));
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', maxWidth: '100%', margin: '0 auto' }}>
      
      {/* Top Action Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#ffffff', padding: '16px 24px', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
        <h1 style={{ fontSize: '20px', fontWeight: 'bold', color: '#1e293b', margin: 0 }}>{id ? 'Edit Lead' : 'New Lead'}</h1>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button 
            onClick={() => navigate('/leads')}
            style={{ padding: '8px 16px', backgroundColor: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '6px', color: '#64748b', fontWeight: 500, cursor: 'pointer' }}>
            Cancel
          </button>
          <button 
            onClick={handleSave}
            style={{ padding: '8px 16px', backgroundColor: '#1b4353', border: 'none', borderRadius: '6px', color: '#ffffff', fontWeight: 500, cursor: 'pointer' }}>
            Save
          </button>
        </div>
      </div>

      {/* Container */}
      <div style={{ backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)', padding: '32px' }}>
        
        {/* Section 1: Lead Information */}
        <div style={{ marginBottom: '40px' }}>
          <h2 style={{ fontSize: '16px', fontWeight: 'bold', color: '#1e293b', marginBottom: '24px' }}>Core Information</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px' }}>
            <TextInput label="Industry" name="industry" value={formData.industry} onChange={handleChange} placeholder="Industry" disabled={!!id} />
            <TextInput label="Contact Name" name="contact_name" value={formData.contact_name} onChange={handleChange} placeholder="Contact Name" disabled={!!id} />
            <TextInput label="Company Name" name="company_name" value={formData.company_name} onChange={handleChange} placeholder="Company Name" disabled={!!id} />
            <TextInput label="Email Address" name="email_address" value={formData.email_address} onChange={handleChange} placeholder="Email" />
            <TextInput label="Contact No" name="contact_no" value={formData.contact_no} onChange={handleChange} placeholder="Number" error={errors.contact_no} />
            <TextInput label="Designation" name="designation" value={formData.designation} onChange={handleChange} placeholder="Designation" />
            <TextInput label="LinkedIn Connect" name="linkedin_connect" value={formData.linkedin_connect} onChange={handleChange} placeholder="LinkedIn URL or Status" />
          </div>
        </div>

        <div style={{ marginBottom: '40px' }}>
          <h2 style={{ fontSize: '16px', fontWeight: 'bold', color: '#1e293b', marginBottom: '24px' }}>Meeting & Status</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px' }}>
            <TextInput label="Meeting Date" type="date" name="meeting_date" value={formData.meeting_date} onChange={handleChange} />
            <CustomSelect label="AE Assigned" name="ae_assigned" value={formData.ae_assigned} onChange={handleChange} options={users} hasClear={true} placeholder="Select AE" />
            <CustomSelect label="Status" name="status" value={formData.status} onChange={handleChange} options={['Completed', 'Rescheduled', 'No Show']} />
            <CustomSelect label="Outcome" name="outcome" value={formData.outcome} onChange={handleChange} options={['Qualified', 'Not Qualified', 'Follow-up']} />
            <CustomSelect label="Demo Call" name="demo_call" value={formData.demo_call} onChange={handleChange} options={['Yes', 'No', 'Pending']} />
            <CustomSelect label="Proposal Sent" name="proposal_sent" value={formData.proposal_sent} onChange={handleChange} options={['Yes', 'No', 'Pending']} />
            <CustomSelect label="Closures" name="closures" value={formData.closures} onChange={handleChange} options={['Won', 'Lost', 'Pending']} />
          </div>
        </div>

      </div>
    </div>
  );
};

export default LeadEdit;
