import React, { useState, useEffect } from 'react';
import { ChevronDown, X } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import apiClient from '../api/apiClient';
import Loader from '../components/Loader';

const CustomInput = ({ label, name, value, onChange, placeholder, isRequired }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
    <label style={{ fontSize: '14px', fontWeight: 500, color: '#334155' }}>
      {label} {isRequired && <span style={{ color: '#ef4444' }}>*</span>}
    </label>
    <input 
      type="text" 
      name={name}
      value={value || ''}
      onChange={onChange}
      placeholder={placeholder}
      style={{
        padding: '10px 14px',
        border: '1px solid #cbd5e1',
        borderRadius: '6px',
        fontSize: '14px',
        color: '#1e293b',
        outline: 'none',
        backgroundColor: '#ffffff'
      }}
    />
  </div>
);

const CustomSelect = ({ label, name, value, onChange, options, placeholder, isRequired }) => {
  const [isOpen, setIsOpen] = useState(false);
  
  if (loading) return <Loader message="Loading ContactEdit..." />;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', position: 'relative' }}>
      <label style={{ fontSize: '14px', fontWeight: 500, color: '#334155' }}>
        {label} {isRequired && <span style={{ color: '#ef4444' }}>*</span>}
      </label>
      <div 
        onClick={() => setIsOpen(!isOpen)}
        style={{
          padding: '10px 14px',
          border: '1px solid #cbd5e1',
          borderRadius: '6px',
          fontSize: '14px',
          color: value ? '#1e293b' : '#94a3b8',
          backgroundColor: '#ffffff',
          cursor: 'pointer',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}
      >
        <span>{value || placeholder}</span>
        <ChevronDown style={{ width: '16px', height: '16px', color: '#64748b' }} />
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
          borderRadius: '6px',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
          zIndex: 10,
          maxHeight: '200px',
          overflowY: 'auto'
        }}>
          {options.map((opt, idx) => (
            <div 
              key={idx}
              onClick={() => {
                if(onChange) onChange({ target: { name, value: opt.value || opt } });
                setIsOpen(false);
              }}
              style={{
                padding: '10px 14px',
                fontSize: '14px',
                color: '#1e293b',
                cursor: 'pointer',
                borderBottom: idx !== options.length - 1 ? '1px solid #f1f5f9' : 'none'
              }}
              onMouseEnter={(e) => e.target.style.backgroundColor = '#f8fafc'}
              onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
            >
              {opt.label || opt}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const ContactEdit = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(!!id);
  const [formData, setFormData] = useState({
    name: '',
    customer: '',
    job_title: '',
    mobile: '',
    email: '',
    phone: '',
    lead_source: ''
  });

  useEffect(() => {
    if (id) {
      fetchContact();
    }
  }, [id]);

  const fetchContact = async () => {
    try {
      const response = await apiClient.get(`contacts/${id}/`);
      setFormData(response.data);
    } catch (error) {
      console.error("Error fetching contact:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      if (id) {
        await apiClient.put(`contacts/${id}/`, formData);
      } else {
        await apiClient.post('contacts/', formData);
      }
      navigate('/contacts');
    } catch (error) {
      console.error("Error saving contact:", error);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', maxWidth: '1000px', margin: '0 auto' }}>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #e2e8f0', paddingBottom: '16px' }}>
        <h1 style={{ fontSize: '20px', fontWeight: 'bold', color: '#1e293b', margin: 0 }}>{id ? 'Edit Contact' : 'New Contact'}</h1>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button 
            onClick={() => navigate('/contacts')}
            style={{ padding: '8px 16px', backgroundColor: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '6px', color: '#64748b', fontWeight: 500, cursor: 'pointer' }}>
            Cancel
          </button>
          <button 
            onClick={handleSave}
            style={{ padding: '8px 16px', backgroundColor: '#007bff', border: 'none', borderRadius: '6px', color: '#ffffff', fontWeight: 500, cursor: 'pointer' }}>
            Save
          </button>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
        
        {/* Contact Information Section */}
        <div>
          <h2 style={{ fontSize: '16px', fontWeight: 600, color: '#334155', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            Contact Information
          </h2>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
            <CustomInput label="Contact Name" name="name" value={formData.name} onChange={handleChange} placeholder="Enter contact name" isRequired />
            <CustomInput label="Customer Name" name="customer" value={formData.customer} onChange={handleChange} placeholder="Enter related customer" />
            <CustomInput label="Job Title" name="job_title" value={formData.job_title} onChange={handleChange} placeholder="Enter job title" />
            <CustomInput label="Mobile" name="mobile" value={formData.mobile} onChange={handleChange} placeholder="e.g. +91 9876543210" isRequired />
            <CustomInput label="Email" name="email" value={formData.email} onChange={handleChange} placeholder="e.g. example@domain.com" />
            <CustomInput label="Phone" name="phone" value={formData.phone} onChange={handleChange} placeholder="e.g. +91 1234567890" />
            <CustomSelect 
              label="Lead Source" 
              name="lead_source"
              value={formData.lead_source}
              onChange={handleChange}
              placeholder="-None-" 
              options={['Website', 'Cold Call', 'Referral', 'Event', 'Partner']} 
            />
          </div>
        </div>

      </div>

    </div>
  );
};

export default ContactEdit;
