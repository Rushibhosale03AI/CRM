import React, { useState, useEffect } from 'react';
import apiClient from '../api/apiClient';
import { X } from 'lucide-react';

const AddEventModal = ({ isOpen, onClose, defaultDate, onSuccess }) => {
  const [eventType, setEventType] = useState('call');
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('09:00');
  const [leads, setLeads] = useState([]);
  const [selectedLead, setSelectedLead] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setDate(defaultDate || new Date().toISOString().split('T')[0]);
      fetchLeads();
    }
  }, [isOpen, defaultDate]);

  const fetchLeads = async () => {
    try {
      const res = await apiClient.get('/leads/');
      setLeads(res.data || []);
      if (res.data?.length > 0) setSelectedLead(res.data[0].id);
    } catch (err) {
      console.error('Error fetching leads', err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const datetime = new Date(`${date}T${time}:00`).toISOString();
      let payload = { title, lead: selectedLead || null };
      
      if (eventType === 'call') {
        payload.start_date = datetime;
        payload.status = 'Scheduled';
        await apiClient.post('/calls/', payload);
      } else if (eventType === 'meeting') {
        payload.from_date = datetime;
        payload.to_date = new Date(new Date(datetime).getTime() + 60 * 60 * 1000).toISOString(); // +1 hour
        payload.status = 'Scheduled';
        await apiClient.post('/meetings/', payload);
      } else if (eventType === 'todo') {
        payload.due_date = datetime;
        payload.status = 'Pending';
        payload.priority = 'Medium';
        await apiClient.post('/todos/', payload);
      }
      
      onSuccess();
      onClose();
    } catch (err) {
      console.error('Error saving event', err);
      alert('Failed to save event. Please check your inputs.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(15, 23, 42, 0.6)', backdropFilter: 'blur(4px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
    }}>
      <div style={{
        backgroundColor: '#ffffff', borderRadius: '16px', width: '100%', maxWidth: '500px',
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        overflow: 'hidden', display: 'flex', flexDirection: 'column'
      }}>
        {/* Header */}
        <div style={{ padding: '20px 24px', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#f8fafc' }}>
          <h2 style={{ fontSize: '18px', fontWeight: 'bold', color: '#0f172a', margin: 0 }}>Schedule Event</h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b', padding: '4px' }}>
            <X style={{ width: '20px', height: '20px' }} />
          </button>
        </div>

        {/* Form Body */}
        <div style={{ padding: '24px', overflowY: 'auto' }}>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#475569', marginBottom: '6px' }}>Event Type</label>
              <div style={{ display: 'flex', gap: '12px' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                  <input type="radio" name="eventType" checked={eventType === 'call'} onChange={() => setEventType('call')} />
                  <span style={{ fontSize: '14px', color: '#1e293b' }}>Call</span>
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                  <input type="radio" name="eventType" checked={eventType === 'meeting'} onChange={() => setEventType('meeting')} />
                  <span style={{ fontSize: '14px', color: '#1e293b' }}>Meeting</span>
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                  <input type="radio" name="eventType" checked={eventType === 'todo'} onChange={() => setEventType('todo')} />
                  <span style={{ fontSize: '14px', color: '#1e293b' }}>To-Do</span>
                </label>
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#475569', marginBottom: '6px' }}>Title</label>
              <input 
                type="text" 
                required
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="e.g. Discovery Call with Acme Corp"
                style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '14px', outline: 'none' }}
              />
            </div>

            <div style={{ display: 'flex', gap: '16px' }}>
              <div style={{ flex: 1 }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#475569', marginBottom: '6px' }}>Date</label>
                <input 
                  type="date" 
                  required
                  value={date}
                  onChange={e => setDate(e.target.value)}
                  style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '14px', outline: 'none' }}
                />
              </div>
              <div style={{ flex: 1 }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#475569', marginBottom: '6px' }}>Time</label>
                <input 
                  type="time" 
                  required
                  value={time}
                  onChange={e => setTime(e.target.value)}
                  style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '14px', outline: 'none' }}
                />
              </div>
            </div>

            {(eventType === 'call' || eventType === 'meeting') && (
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#475569', marginBottom: '6px' }}>Related Lead</label>
                <select 
                  value={selectedLead}
                  onChange={e => setSelectedLead(e.target.value)}
                  style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '14px', outline: 'none', backgroundColor: '#fff' }}
                >
                  <option value="">None</option>
                  {leads.map(l => (
                    <option key={l.id} value={l.id}>{l.contact_name} ({l.company_name})</option>
                  ))}
                </select>
              </div>
            )}

            <div style={{ marginTop: '16px', display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
              <button 
                type="button"
                onClick={onClose}
                style={{ padding: '10px 16px', borderRadius: '8px', border: '1px solid #cbd5e1', backgroundColor: '#ffffff', color: '#475569', fontSize: '14px', fontWeight: 600, cursor: 'pointer' }}
              >
                Cancel
              </button>
              <button 
                type="submit"
                disabled={loading}
                style={{ padding: '10px 24px', borderRadius: '8px', border: 'none', backgroundColor: '#0ea5e9', color: '#ffffff', fontSize: '14px', fontWeight: 600, cursor: 'pointer', opacity: loading ? 0.7 : 1 }}
              >
                {loading ? 'Saving...' : 'Save Event'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddEventModal;
