import React, { useState, useContext } from 'react';
import { X, Send } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import apiClient from '../api/apiClient';

const EODReportModal = ({ isOpen, onClose }) => {
  const { user } = useContext(AuthContext);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    report_date: new Date().toISOString().split('T')[0],
    calls_done: '',
    emails_sent: '',
    follow_ups_done: '',
    meetings_fixed: '',
    meetings_attended: '',
    pipeline_added: '',
    key_highlights: '',
    target_calls: '',
    target_emails: '',
    target_follow_ups: '',
    target_meetings: '',
    key_deals_focus: ''
  });

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await apiClient.post('/eod-reports/', formData);
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        onClose();
        // Reset form
        setFormData({
          report_date: new Date().toISOString().split('T')[0],
          calls_done: '', emails_sent: '', follow_ups_done: '', meetings_fixed: '', meetings_attended: '', pipeline_added: '', key_highlights: '',
          target_calls: '', target_emails: '', target_follow_ups: '', target_meetings: '', key_deals_focus: ''
        });
      }, 2000);
    } catch (err) {
      console.error("Error submitting EOD report", err);
      alert("Failed to submit EOD report.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const InputRow = ({ label, name, type = "text", highlightColor = '#3b82f6', labelColor = '#475569' }) => (
    <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
      <label style={{ fontSize: '13px', color: labelColor, fontWeight: 600, flex: '0 0 160px', paddingRight: '12px', lineHeight: '1.4' }}>{label}</label>
      <input 
        type={type} 
        name={name} 
        value={formData[name]} 
        onChange={handleChange}
        style={{
          flex: 1,
          width: '100%',
          padding: '10px 12px',
          borderRadius: '8px',
          border: '1px solid #cbd5e1',
          fontSize: '14px',
          outline: 'none',
          color: '#1e293b',
          backgroundColor: '#ffffff',
          boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.02)',
          transition: 'border-color 0.2s',
          boxSizing: 'border-box'
        }}
        onFocus={(e) => e.target.style.borderColor = highlightColor}
        onBlur={(e) => e.target.style.borderColor = '#cbd5e1'}
      />
    </div>
  );

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(15, 23, 42, 0.4)',
      backdropFilter: 'blur(4px)',
      display: 'flex', alignItems: 'flex-start', justifyContent: 'center',
      paddingTop: '4vh',
      paddingBottom: '4vh',
      paddingLeft: '16px',
      paddingRight: '16px',
      zIndex: 1000
    }}>
      <div style={{
        backgroundColor: '#ffffff',
        borderRadius: '16px',
        width: '100%',
        maxWidth: '960px',
        maxHeight: '90vh',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
        fontFamily: "'Inter', sans-serif"
      }}>
        {/* Header */}
        <div style={{ padding: '24px', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <h2 style={{ fontSize: '22px', fontWeight: 'bold', color: '#1e293b', margin: '0 0 8px 0' }}>End of Day Report</h2>
            <div style={{ display: 'flex', gap: '16px', alignItems: 'center', flexWrap: 'wrap' }}>
              <input 
                type="date" 
                name="report_date" 
                value={formData.report_date} 
                onChange={handleChange} 
                style={{ fontSize: '14px', color: '#1e293b', border: '1px solid #cbd5e1', borderRadius: '6px', padding: '4px 8px', outline: 'none' }} 
              />
              <div style={{ height: '16px', width: '1px', backgroundColor: '#cbd5e1' }}></div>
              <p style={{ fontSize: '14px', color: '#1e293b', margin: 0, fontWeight: 500 }}>
                <span style={{ color: '#64748b', marginRight: '4px' }}>Name:</span> 
                {user?.name || user?.username || 'User'}
              </p>
            </div>
          </div>
          <button onClick={onClose} style={{ background: '#f8fafc', border: '1px solid #e2e8f0', cursor: 'pointer', padding: '8px', color: '#64748b', borderRadius: '8px', transition: 'all 0.2s', display: 'flex', alignItems: 'center', justifyContent: 'center' }} onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#f1f5f9'; e.currentTarget.style.color = '#1e293b'; }} onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#f8fafc'; e.currentTarget.style.color = '#64748b'; }}>
            <X style={{ width: '20px', height: '20px' }} />
          </button>
        </div>

        {/* Body */}
        <div style={{ padding: '24px', overflowY: 'auto', overflowX: 'hidden', flex: 1, backgroundColor: '#f8fafc' }}>
          {success ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', padding: '40px 0' }}>
              <div style={{ width: '80px', height: '80px', borderRadius: '50%', backgroundColor: '#dcfce3', color: '#22c55e', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '24px', boxShadow: '0 4px 10px rgba(34, 197, 94, 0.2)' }}>
                <svg style={{ width: '40px', height: '40px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
              </div>
              <h3 style={{ fontSize: '22px', fontWeight: 'bold', color: '#1e293b', margin: '0 0 12px 0' }}>Report Submitted Successfully!</h3>
              <p style={{ fontSize: '16px', color: '#64748b', margin: 0 }}>Great job today. See you tomorrow!</p>
            </div>
          ) : (
            <form id="eod-form" onSubmit={handleSubmit}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '24px' }}>
                
                {/* Left Column: Targets (Swapped) */}
                <div style={{ backgroundColor: '#ffffff', padding: '24px', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.02)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', marginBottom: '24px', paddingBottom: '16px', borderBottom: '2px solid #f1f5f9' }}>
                    <div style={{ width: '32px', height: '32px', borderRadius: '8px', backgroundColor: '#eff6ff', color: '#3b82f6', display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: '12px' }}>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><circle cx="12" cy="12" r="6"></circle><circle cx="12" cy="12" r="2"></circle></svg>
                    </div>
                    <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: '#0f172a', margin: 0 }}>Objective Daily Reporting (Targets)</h3>
                  </div>
                  
                  <InputRow label="Consultative Discussions (Calls)" name="target_calls" highlightColor="#3b82f6" />
                  <InputRow label="Emails" name="target_emails" highlightColor="#3b82f6" />
                  <InputRow label="Follow-ups" name="target_follow_ups" highlightColor="#3b82f6" />
                  <InputRow label="Meetings Planned" name="target_meetings" highlightColor="#3b82f6" />
                  
                  <div style={{ marginTop: '24px' }}>
                    <label style={{ display: 'block', fontSize: '13px', color: '#475569', fontWeight: 600, marginBottom: '8px' }}>Key Deals Focus Today</label>
                    <textarea 
                      name="key_deals_focus"
                      value={formData.key_deals_focus}
                      onChange={handleChange}
                      placeholder="e.g. Focusing on Manufacturing Prospects & LinkedIn Leads"
                      style={{
                        width: '100%',
                        minHeight: '100px',
                        padding: '12px',
                        borderRadius: '8px',
                        border: '1px solid #cbd5e1',
                        fontSize: '14px',
                        outline: 'none',
                        color: '#1e293b',
                        resize: 'vertical',
                        boxSizing: 'border-box',
                        backgroundColor: '#ffffff',
                        transition: 'border-color 0.2s',
                        boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.02)'
                      }}
                      onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
                      onBlur={(e) => e.target.style.borderColor = '#cbd5e1'}
                    />
                  </div>
                </div>

                {/* Right Column: Actuals (Swapped) */}
                <div style={{ backgroundColor: '#ffffff', padding: '24px', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.02)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', marginBottom: '24px', paddingBottom: '16px', borderBottom: '2px solid #f1f5f9' }}>
                    <div style={{ width: '32px', height: '32px', borderRadius: '8px', backgroundColor: '#f0fdf4', color: '#22c55e', display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: '12px' }}>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                    </div>
                    <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: '#166534', margin: 0 }}>Evening Report (Actuals)</h3>
                  </div>
                  
                  <InputRow label="Calls Done" name="calls_done" highlightColor="#22c55e" labelColor="#166534" />
                  <InputRow label="Emails Sent" name="emails_sent" highlightColor="#22c55e" labelColor="#166534" />
                  <InputRow label="Follow-ups Done" name="follow_ups_done" highlightColor="#22c55e" labelColor="#166534" />
                  <InputRow label="Meetings Fixed" name="meetings_fixed" highlightColor="#22c55e" labelColor="#166534" />
                  <InputRow label="Meetings Attended" name="meetings_attended" highlightColor="#22c55e" labelColor="#166534" />
                  <InputRow label="Pipeline Added (₹)" name="pipeline_added" type="text" highlightColor="#22c55e" labelColor="#166534" />
                  
                  <div style={{ marginTop: '24px' }}>
                    <label style={{ display: 'block', fontSize: '13px', color: '#166534', fontWeight: 600, marginBottom: '8px' }}>Key Highlights / Learning of the Day</label>
                    <textarea 
                      name="key_highlights"
                      value={formData.key_highlights}
                      onChange={handleChange}
                      placeholder="e.g. Attended discussion with Niwas regarding BRS solution..."
                      style={{
                        width: '100%',
                        minHeight: '100px',
                        padding: '12px',
                        borderRadius: '8px',
                        border: '1px solid #cbd5e1',
                        fontSize: '14px',
                        outline: 'none',
                        color: '#1e293b',
                        resize: 'vertical',
                        boxSizing: 'border-box',
                        backgroundColor: '#ffffff',
                        transition: 'border-color 0.2s',
                        boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.02)'
                      }}
                      onFocus={(e) => e.target.style.borderColor = '#22c55e'}
                      onBlur={(e) => e.target.style.borderColor = '#cbd5e1'}
                    />
                  </div>
                </div>

              </div>
            </form>
          )}
        </div>

        {/* Footer */}
        {!success && (
          <div style={{ padding: '20px 24px', backgroundColor: '#ffffff', borderTop: '1px solid #e2e8f0', display: 'flex', justifyContent: 'flex-end', gap: '16px', borderRadius: '0 0 16px 16px' }}>
            <button onClick={onClose} style={{ padding: '10px 24px', borderRadius: '8px', border: '1px solid #cbd5e1', backgroundColor: '#ffffff', color: '#475569', fontSize: '15px', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s' }} onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#f1f5f9'; e.currentTarget.style.borderColor = '#94a3b8'; }} onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#ffffff'; e.currentTarget.style.borderColor = '#cbd5e1'; }}>
              Cancel
            </button>
            <button 
              type="submit" 
              form="eod-form"
              disabled={isSubmitting}
              style={{ padding: '10px 24px', borderRadius: '8px', border: 'none', backgroundColor: '#3b82f6', color: '#ffffff', fontSize: '15px', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', opacity: isSubmitting ? 0.7 : 1, transition: 'all 0.2s', boxShadow: '0 4px 6px -1px rgba(59, 130, 246, 0.3)' }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#2563eb'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#3b82f6'}
            >
              {isSubmitting ? 'Submitting...' : (
                <>
                  <Send style={{ width: '18px', height: '18px' }} />
                  Submit Report
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default EODReportModal;
