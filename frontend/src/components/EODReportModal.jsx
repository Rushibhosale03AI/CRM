import React, { useState, useContext } from 'react';
import { X, Send } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import apiClient from '../api/apiClient';

const EODReportModal = ({ isOpen, onClose }) => {
  const { user } = useContext(AuthContext);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
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

  const InputRow = ({ label, name, type = "text" }) => (
    <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', alignItems: 'center', marginBottom: '8px', gap: '8px' }}>
      <label style={{ fontSize: '13px', color: '#475569', fontWeight: 500 }}>{label}</label>
      <input 
        type={type} 
        name={name} 
        value={formData[name]} 
        onChange={handleChange}
        style={{
          width: '100%',
          padding: '6px 12px',
          borderRadius: '6px',
          border: '1px solid #cbd5e1',
          fontSize: '13px',
          outline: 'none',
          color: '#1e293b',
          boxSizing: 'border-box'
        }}
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
      zIndex: 1000
    }}>
      <div style={{
        backgroundColor: '#ffffff',
        borderRadius: '16px',
        width: '95%',
        maxWidth: '900px',
        maxHeight: '90vh',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)'
      }}>
        {/* Header */}
        <div style={{ padding: '16px 24px', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h2 style={{ fontSize: '18px', fontWeight: 'bold', color: '#1e293b', margin: 0 }}>End of Day Report</h2>
            <p style={{ fontSize: '13px', color: '#64748b', margin: '4px 0 0 0' }}>{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px', color: '#64748b' }}>
            <X style={{ width: '20px', height: '20px' }} />
          </button>
        </div>

        {/* Body */}
        <div style={{ padding: '16px 24px', overflowY: 'auto', flex: 1 }}>
          {success ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', padding: '40px 0' }}>
              <div style={{ width: '64px', height: '64px', borderRadius: '50%', backgroundColor: '#dcfce3', color: '#22c55e', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
                <svg style={{ width: '32px', height: '32px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
              </div>
              <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: '#1e293b', margin: '0 0 8px 0' }}>Report Submitted Successfully!</h3>
              <p style={{ fontSize: '14px', color: '#64748b', margin: 0 }}>Great job today. See you tomorrow!</p>
            </div>
          ) : (
            <form id="eod-form" onSubmit={handleSubmit}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px' }}>
                
                {/* Left Column: Evening Report */}
                <div>
                  <h3 style={{ fontSize: '15px', fontWeight: 'bold', color: '#0f172a', borderBottom: '2px solid #e2e8f0', paddingBottom: '8px', marginBottom: '16px' }}>Evening Report (Actuals)</h3>
                  
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
                    <span style={{ fontSize: '14px', color: '#475569', fontWeight: 500 }}>Name:</span>
                    <span style={{ fontSize: '14px', color: '#1e293b', fontWeight: 'bold' }}>{user?.name || user?.username || 'User'}</span>
                  </div>

                  <InputRow label="Calls Done" name="calls_done" />
                  <InputRow label="Emails Sent" name="emails_sent" />
                  <InputRow label="Follow-ups Done" name="follow_ups_done" />
                  <InputRow label="Meetings Fixed" name="meetings_fixed" />
                  <InputRow label="Meetings Attended" name="meetings_attended" />
                  <InputRow label="Pipeline Added (₹)" name="pipeline_added" type="text" />
                  
                  <div style={{ marginTop: '16px' }}>
                    <label style={{ display: 'block', fontSize: '14px', color: '#475569', fontWeight: 500, marginBottom: '8px' }}>Key Highlights / Learning of the Day</label>
                    <textarea 
                      name="key_highlights"
                      value={formData.key_highlights}
                      onChange={handleChange}
                      placeholder="e.g. Attended discussion with Niwas regarding BRS solution..."
                      style={{
                        width: '100%',
                        height: '60px',
                        padding: '12px',
                        borderRadius: '8px',
                        border: '1px solid #cbd5e1',
                        fontSize: '14px',
                        outline: 'none',
                        color: '#1e293b',
                        resize: 'vertical'
                      }}
                    />
                  </div>
                </div>

                {/* Right Column: Targets */}
                <div>
                  <h3 style={{ fontSize: '15px', fontWeight: 'bold', color: '#0f172a', borderBottom: '2px solid #e2e8f0', paddingBottom: '8px', marginBottom: '16px' }}>Objective Daily Reporting (Targets)</h3>
                  
                  <div style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', height: '20px' }}>
                    {/* Placeholder to align with Name row on the left */}
                  </div>

                  <InputRow label="Consultative Discussions (Calls)" name="target_calls" />
                  <InputRow label="Emails" name="target_emails" />
                  <InputRow label="Follow-ups" name="target_follow_ups" />
                  <InputRow label="Meetings Planned" name="target_meetings" />
                  
                  <div style={{ marginTop: '16px' }}>
                    <label style={{ display: 'block', fontSize: '14px', color: '#475569', fontWeight: 500, marginBottom: '8px' }}>Key Deals Focus Today</label>
                    <textarea 
                      name="key_deals_focus"
                      value={formData.key_deals_focus}
                      onChange={handleChange}
                      placeholder="e.g. Focusing on Manufacturing Prospects & LinkedIn Leads"
                      style={{
                        width: '100%',
                        height: '60px',
                        padding: '12px',
                        borderRadius: '8px',
                        border: '1px solid #cbd5e1',
                        fontSize: '14px',
                        outline: 'none',
                        color: '#1e293b',
                        resize: 'vertical'
                      }}
                    />
                  </div>
                </div>

              </div>
            </form>
          )}
        </div>

        {/* Footer */}
        {!success && (
          <div style={{ padding: '16px 24px', backgroundColor: '#f8fafc', borderTop: '1px solid #e2e8f0', display: 'flex', justifyContent: 'flex-end', gap: '12px', borderRadius: '0 0 16px 16px' }}>
            <button onClick={onClose} style={{ padding: '8px 16px', borderRadius: '6px', border: '1px solid #cbd5e1', backgroundColor: '#ffffff', color: '#475569', fontSize: '14px', fontWeight: 500, cursor: 'pointer' }}>
              Cancel
            </button>
            <button 
              type="submit" 
              form="eod-form"
              disabled={isSubmitting}
              style={{ padding: '8px 16px', borderRadius: '6px', border: 'none', backgroundColor: '#0ea5e9', color: '#ffffff', fontSize: '14px', fontWeight: 500, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', opacity: isSubmitting ? 0.7 : 1 }}
            >
              {isSubmitting ? 'Submitting...' : (
                <>
                  <Send style={{ width: '16px', height: '16px' }} />
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
