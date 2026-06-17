import React, { useState, useEffect, useContext } from 'react';
import { Calendar as CalendarIcon, Filter, Search, Download, FileText, CheckCircle, Clock } from 'lucide-react';
import apiClient from '../api/apiClient';
import { AuthContext } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';
import PageSearchBar from '../components/PageSearchBar';
import Loader from '../components/Loader';

const AdminEODReports = () => {
  const { user } = useContext(AuthContext);
  const [reports, setReports] = useState([]);
  const [allFetchedReports, setAllFetchedReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterDate, setFilterDate] = useState(new Date().toISOString().split('T')[0]); // Default today
  const [filterUser, setFilterUser] = useState(''); // Empty means all users
  const [uniqueUsers, setUniqueUsers] = useState([]);

  useEffect(() => {
    fetchReports();
  }, [filterDate]);

  const fetchReports = async () => {
    setLoading(true);
    try {
      const response = await apiClient.get('/eod-reports/');
      let allReports = response.data || [];
      
      setAllFetchedReports(allReports);
      
      // Extract unique users
      const usersMap = {};
      allReports.forEach(r => {
        if (r.user_details && r.user_details.name) {
          usersMap[r.user_details.name] = r.user_details;
        }
      });
      setUniqueUsers(Object.values(usersMap));
      
      applyFilters(allReports, filterDate, filterUser);
    } catch (err) {
      console.error("Error fetching EOD reports", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    applyFilters(allFetchedReports, filterDate, filterUser);
  }, [filterDate, filterUser]);

  const applyFilters = (data, dateVal, userVal) => {
    const filtered = data.filter(report => {
      let match = true;
      if (dateVal) {
        if (!report.created_at) match = false;
        else {
          const reportDate = new Date(report.created_at).toISOString().split('T')[0];
          if (reportDate !== dateVal) match = false;
        }
      }
      if (userVal) {
        if (report.user_details?.name !== userVal) match = false;
      }
      return match;
    });
    setReports(filtered);
  };

  const formatDate = (dateStr) => {
    const d = new Date(dateStr);
    return d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  };

  if (loading) return <Loader message="Loading AdminEODReports..." />;

  return (
    <div style={{ padding: '32px', maxWidth: '1400px', margin: '0 auto', fontFamily: '"Inter", sans-serif' }}>
      
      <div style={{ marginBottom: '16px' }}>
        <PageSearchBar placeholder="Search EOD reports..." />
      </div>

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <div>
          <h1 style={{ fontSize: '28px', fontWeight: 'bold', color: '#0f172a', margin: '0 0 8px 0', letterSpacing: '-0.02em' }}>
            Daily EOD Reports
          </h1>
          <p style={{ color: '#64748b', margin: 0, fontSize: '15px' }}>
            Review end-of-day submissions from Sales Representatives
          </p>
        </div>
        
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
          <div style={{ position: 'relative' }}>
            <Filter style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', width: '16px', height: '16px', color: '#64748b' }} />
            <select
              value={filterUser}
              onChange={(e) => setFilterUser(e.target.value)}
              style={{
                padding: '10px 16px 10px 36px',
                borderRadius: '8px',
                border: '1px solid #cbd5e1',
                fontSize: '14px',
                color: '#334155',
                outline: 'none',
                cursor: 'pointer',
                backgroundColor: '#ffffff',
                appearance: 'none',
                minWidth: '200px'
              }}
            >
              <option value="">All Representatives</option>
              {uniqueUsers.map(u => (
                <option key={u.id || u.name} value={u.name}>{u.name}</option>
              ))}
            </select>
          </div>
          <div style={{ position: 'relative' }}>
            <CalendarIcon style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', width: '16px', height: '16px', color: '#64748b' }} />
            <input 
              type="date"
              value={filterDate}
              onChange={(e) => setFilterDate(e.target.value)}
              style={{
                padding: '10px 16px 10px 36px',
                borderRadius: '8px',
                border: '1px solid #cbd5e1',
                fontSize: '14px',
                color: '#334155',
                outline: 'none',
                cursor: 'pointer'
              }}
            />
            {filterDate && (
              <button 
                onClick={() => setFilterDate('')}
                style={{
                  position: 'absolute', right: '8px', top: '50%', transform: 'translateY(-50%)',
                  background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', fontSize: '12px', padding: '4px'
                }}
                title="Clear Date Filter"
              >
                ✕
              </button>
            )}
          </div>
          
          <button style={{
            display: 'flex', alignItems: 'center', gap: '8px',
            backgroundColor: '#ffffff', color: '#334155',
            border: '1px solid #cbd5e1', borderRadius: '8px',
            padding: '10px 16px', fontSize: '14px', fontWeight: 500,
            cursor: 'pointer', transition: 'all 0.2s',
            boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
          }}>
            <Download style={{ width: '16px', height: '16px' }} />
            Export
          </button>
        </div>
      </div>

      {/* Reports Grid */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '64px 0', color: '#64748b' }}>Loading reports...</div>
      ) : reports.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '64px 0', backgroundColor: '#f8fafc', borderRadius: '12px', border: '1px dashed #cbd5e1' }}>
          <FileText style={{ width: '48px', height: '48px', color: '#cbd5e1', margin: '0 auto 16px auto' }} />
          <h3 style={{ fontSize: '16px', fontWeight: 600, color: '#334155', margin: '0 0 8px 0' }}>No Reports Found</h3>
          <p style={{ fontSize: '14px', color: '#64748b', margin: 0 }}>No End of Day reports match your selected filters.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(600px, 1fr))', gap: '24px' }}>
          {reports.map((report) => (
            <div key={report.id} style={{
              backgroundColor: '#ffffff',
              borderRadius: '16px',
              border: '1px solid #e2e8f0',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -2px rgba(0, 0, 0, 0.05)',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column'
            }}>
              {/* Card Header */}
              <div style={{ padding: '20px 24px', borderBottom: '1px solid #e2e8f0', backgroundColor: '#f8fafc', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <div style={{
                    width: '40px', height: '40px', borderRadius: '50%',
                    background: 'linear-gradient(to top right, #dbeafe, #bfdbfe)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: '#4f46e5', fontWeight: 'bold', fontSize: '14px'
                  }}>
                    {report.user_details?.name ? report.user_details.name.substring(0, 2).toUpperCase() : 'AE'}
                  </div>
                  <div>
                    <h3 style={{ fontSize: '16px', fontWeight: 'bold', color: '#0f172a', margin: 0 }}>
                      {report.user_details?.name || 'Unknown User'}
                    </h3>
                    <p style={{ fontSize: '13px', color: '#64748b', margin: '4px 0 0 0' }}>
                      {report.user_details?.role || 'Sales Representative'}
                    </p>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#64748b', fontSize: '13px' }}>
                  <CalendarIcon style={{ width: '14px', height: '14px' }} />
                  {new Date(report.created_at).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                  <span style={{ margin: '0 4px', color: '#cbd5e1' }}>|</span>
                  <Clock style={{ width: '14px', height: '14px' }} />
                  {formatDate(report.created_at)}
                </div>
              </div>

              {/* Card Body */}
              <div style={{ padding: '24px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px' }}>
                
                {/* Actuals */}
                <div>
                  <h4 style={{ fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#64748b', fontWeight: 600, margin: '0 0 16px 0', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <CheckCircle style={{ width: '14px', height: '14px', color: '#10b981' }} />
                    Evening Report
                  </h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}>
                      <span style={{ color: '#475569' }}>Calls Done:</span>
                      <span style={{ fontWeight: 600, color: '#1e293b' }}>{report.calls_done}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}>
                      <span style={{ color: '#475569' }}>Emails Sent:</span>
                      <span style={{ fontWeight: 600, color: '#1e293b' }}>{report.emails_sent}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}>
                      <span style={{ color: '#475569' }}>Follow-ups:</span>
                      <span style={{ fontWeight: 600, color: '#1e293b' }}>{report.follow_ups_done}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}>
                      <span style={{ color: '#475569' }}>Meetings Fixed:</span>
                      <span style={{ fontWeight: 600, color: '#1e293b' }}>{report.meetings_fixed}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}>
                      <span style={{ color: '#475569' }}>Meetings Attended:</span>
                      <span style={{ fontWeight: 600, color: '#1e293b' }}>{report.meetings_attended}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}>
                      <span style={{ color: '#475569' }}>Pipeline Added:</span>
                      <span style={{ fontWeight: 600, color: '#1e293b' }}>{report.pipeline_added || '—'}</span>
                    </div>
                  </div>
                  
                  {report.key_highlights && (
                    <div style={{ marginTop: '20px', backgroundColor: '#f1f5f9', padding: '12px', borderRadius: '8px' }}>
                      <span style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#64748b', marginBottom: '4px' }}>Key Highlights:</span>
                      <p style={{ margin: 0, fontSize: '13px', color: '#334155', whiteSpace: 'pre-wrap' }}>{report.key_highlights}</p>
                    </div>
                  )}
                </div>

                {/* Targets */}
                <div>
                  <h4 style={{ fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#64748b', fontWeight: 600, margin: '0 0 16px 0', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <CalendarIcon style={{ width: '14px', height: '14px', color: '#3b82f6' }} />
                    Daily Targets
                  </h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}>
                      <span style={{ color: '#475569' }}>Consultative Discussions:</span>
                      <span style={{ fontWeight: 600, color: '#1e293b' }}>{report.target_calls}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}>
                      <span style={{ color: '#475569' }}>Emails:</span>
                      <span style={{ fontWeight: 600, color: '#1e293b' }}>{report.target_emails}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}>
                      <span style={{ color: '#475569' }}>Follow-ups:</span>
                      <span style={{ fontWeight: 600, color: '#1e293b' }}>{report.target_follow_ups}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}>
                      <span style={{ color: '#475569' }}>Meetings Planned:</span>
                      <span style={{ fontWeight: 600, color: '#1e293b' }}>{report.target_meetings}</span>
                    </div>
                  </div>
                  
                  {report.key_deals_focus && (
                    <div style={{ marginTop: '20px', backgroundColor: '#eff6ff', padding: '12px', borderRadius: '8px' }}>
                      <span style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#2563eb', marginBottom: '4px' }}>Key Deals Focus Today:</span>
                      <p style={{ margin: 0, fontSize: '13px', color: '#115e59', whiteSpace: 'pre-wrap' }}>{report.key_deals_focus}</p>
                    </div>
                  )}
                </div>

              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
};

export default AdminEODReports;
