import React, { useState } from 'react';
import { ChevronDown, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const CustomInput = ({ label, placeholder, isRequired, type="text" }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
    <label style={{ fontSize: '14px', fontWeight: 500, color: '#334155' }}>
      {label} {isRequired && <span style={{ color: '#ef4444' }}>*</span>}
    </label>
    <input 
      type={type}
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

const CustomSelect = ({ label, value, options, placeholder, isRequired }) => {
  const [isOpen, setIsOpen] = useState(false);
  
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
              onClick={() => setIsOpen(false)}
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
              {opt}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const CallEdit = () => {
  const navigate = useNavigate();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', maxWidth: '1000px', margin: '0 auto' }}>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #e2e8f0', paddingBottom: '16px' }}>
        <h1 style={{ fontSize: '20px', fontWeight: 'bold', color: '#1e293b', margin: 0 }}>Edit Call</h1>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button 
            onClick={() => navigate('/calls')}
            style={{ padding: '8px 16px', backgroundColor: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '6px', color: '#64748b', fontWeight: 500, cursor: 'pointer' }}>
            Cancel
          </button>
          <button 
            onClick={() => navigate('/calls')}
            style={{ padding: '8px 16px', backgroundColor: '#007bff', border: 'none', borderRadius: '6px', color: '#ffffff', fontWeight: 500, cursor: 'pointer' }}>
            Save
          </button>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
        
        <div>
          <h2 style={{ fontSize: '16px', fontWeight: 600, color: '#334155', marginBottom: '20px' }}>Call Information</h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
            <CustomInput label="Subject" placeholder="Call Subject" isRequired />
            <CustomSelect label="Call Type" value="Outbound" options={['Inbound', 'Outbound']} isRequired />
            <CustomSelect label="Related To" value="" placeholder="Search Leads/Contacts" options={['Lead: Pradeep', 'Lead: Umesh Jadav']} />
            <CustomSelect label="Call Purpose" value="" placeholder="-None-" options={['Prospecting', 'Administrative', 'Negotiation', 'Demo']} />
            <CustomSelect label="Call Status" value="In Progress" options={['Scheduled', 'In Progress', 'Closed']} />
            <CustomInput label="Start Time" type="datetime-local" isRequired />
            <CustomInput label="Call Duration" placeholder="e.g. 15 mins" />
          </div>
        </div>

        <div>
          <h2 style={{ fontSize: '16px', fontWeight: 600, color: '#334155', marginBottom: '20px' }}>Call Details</h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '24px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ fontSize: '14px', fontWeight: 500, color: '#334155' }}>Call Agenda</label>
              <textarea 
                placeholder="Enter call agenda..."
                style={{ padding: '10px 14px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '14px', minHeight: '80px', fontFamily: 'inherit', resize: 'vertical' }}
              />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ fontSize: '14px', fontWeight: 500, color: '#334155' }}>Call Result</label>
              <textarea 
                placeholder="Enter call result or outcome..."
                style={{ padding: '10px 14px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '14px', minHeight: '80px', fontFamily: 'inherit', resize: 'vertical' }}
              />
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};

export default CallEdit;
