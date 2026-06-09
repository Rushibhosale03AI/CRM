import React, { useContext, useState, useEffect } from 'react';
import { ChevronDown, ArrowUpRight } from 'lucide-react';
import { LineChart, Line, PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { AuthContext } from '../context/AuthContext';
import apiClient from '../api/apiClient';

const sparklineDataRed = [
  { value: 100 }, { value: 120 }, { value: 80 }, { value: 90 }, { value: 40 }, { value: 30 }
];

const sparklineDataGreen = [
  { value: 10 }, { value: 15 }, { value: 20 }, { value: 15 }, { value: 40 }, { value: 50 }, { value: 45 }
];

const pieData = [
  { name: 'Active', value: 87.12, color: '#3b82f6' },
  { name: 'Dead', value: 10, color: '#06b6d4' },
  { name: 'Closed', value: 2.88, color: '#fbbf24' }
];

const Dashboard = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const { user } = useContext(AuthContext);
  
  const [leadsData, setLeadsData] = useState({ count: 0, active: 0, dead: 0, closed: 0 });
  const [customersCount, setCustomersCount] = useState(0);
  const [contactsCount, setContactsCount] = useState(0);
  const [todaysCalls, setTodaysCalls] = useState([]);
  const [latestEodReport, setLatestEodReport] = useState(null);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [leadsRes, customersRes, contactsRes, callsRes, eodRes] = await Promise.all([
          apiClient.get('leads/'),
          apiClient.get('customers/'),
          apiClient.get('contacts/'),
          apiClient.get('calls/'),
          apiClient.get('eod-reports/')
        ]);
        
        const leads = leadsRes.data || [];
        let active = 0, dead = 0, closed = 0;
        leads.forEach(l => {
          const c = (l.closures || '').toLowerCase();
          const o = (l.outcome || '').toLowerCase();
          if (c.includes('won') || c.includes('closed')) closed++;
          else if (c.includes('lost') || o.includes('not qualified') || c.includes('dead')) dead++;
          else active++;
        });
        setLeadsData({ count: leads.length, active, dead, closed });
        setCustomersCount((customersRes.data || []).length);
        setContactsCount((contactsRes.data || []).length);
        
        const todayStr = new Date().toISOString().split('T')[0];
        const tCalls = (callsRes.data || []).filter(c => {
          const callDate = c.call_time ? new Date(c.call_time).toISOString().split('T')[0] : '';
          return callDate === todayStr;
        });
        setTodaysCalls(tCalls);
        
        const eodReports = eodRes.data || [];
        if (eodReports.length > 0) {
          const latest = eodReports[0];
          const latestDate = new Date(latest.created_at).toISOString().split('T')[0];
          if (latestDate === todayStr) {
            setLatestEodReport(latest);
          } else {
            setLatestEodReport('NONE');
          }
        } else {
          setLatestEodReport('NONE');
        }
        
      } catch (err) {
        console.error("Error fetching dashboard data", err);
      }
    };
    fetchDashboardData();
  }, []);

  const getGreeting = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  const getOrdinalNum = (n) => {
    return n + (n > 0 ? ['th', 'st', 'nd', 'rd'][(n > 3 && n < 21) || n % 10 > 3 ? 0 : n % 10] : '');
  };

  const formatDateTime = (date) => {
    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const month = monthNames[date.getMonth()];
    const day = getOrdinalNum(date.getDate());
    const year = date.getFullYear();
    
    let hours = date.getHours();
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    const ampm = hours >= 12 ? 'pm' : 'am';
    
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    const formattedHours = String(hours).padStart(2, '0');

    return `${month} ${day} ${year}, ${formattedHours}:${minutes}:${seconds} ${ampm}`;
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', maxWidth: '100%', margin: '0 auto' }}>
      
      {/* Top Banner */}
      <div style={{
        backgroundColor: '#f8fafc',
        borderRadius: '12px',
        padding: '24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        border: '1px solid #e2e8f0'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            backgroundColor: '#e0f2fe',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#38bdf8'
          }}>
            <svg style={{ width: '32px', height: '32px' }} viewBox="0 0 24 24" fill="currentColor"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>
          </div>
          <div>
            <h1 style={{ fontSize: '24px', fontWeight: 'bold', color: '#334155', margin: '0 0 4px 0' }}>{getGreeting()}, {user?.name || user?.username || 'User'}</h1>
            <p style={{ fontSize: '14px', color: '#64748b', margin: 0, fontWeight: 500 }}>{formatDateTime(currentTime)}</p>
          </div>
        </div>

      </div>

      {/* Metrics Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
        
        {/* Leads Card */}
        <div style={{ backgroundColor: '#ffffff', borderRadius: '12px', padding: '20px', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <h3 style={{ fontSize: '15px', color: '#475569', fontWeight: 600, margin: 0 }}>Leads</h3>
            <ArrowUpRight style={{ width: '16px', height: '16px', color: '#94a3b8' }} />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
            <div>
              <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#1e293b', margin: '8px 0' }}>{leadsData.count}</div>
              <div style={{ fontSize: '12px', color: '#64748b' }}>
                <span style={{ color: '#10b981', fontWeight: 600 }}>Active data</span> dynamically loaded
              </div>
            </div>
            <div style={{ width: '100px', height: '50px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={sparklineDataGreen}>
                  <Line type="monotone" dataKey="value" stroke="#10b981" strokeWidth={2} dot={false} isAnimationActive={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div style={{ marginTop: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#64748b', marginBottom: '8px', fontWeight: 500 }}>
              <span><strong style={{ color: '#334155' }}>{leadsData.active}</strong> Active, <strong style={{ color: '#334155' }}>{leadsData.closed}</strong> Closed</span>
            </div>
            <div style={{ width: '100%', height: '6px', backgroundColor: '#bfdbfe', borderRadius: '3px', overflow: 'hidden', display: 'flex' }}>
              <div style={{ width: '48%', height: '100%', backgroundColor: '#3b82f6' }}></div>
            </div>
          </div>
        </div>

        {/* Customer Card */}
        <div style={{ backgroundColor: '#ffffff', borderRadius: '12px', padding: '20px', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <h3 style={{ fontSize: '15px', color: '#475569', fontWeight: 600, margin: 0 }}>Customer</h3>
            <ArrowUpRight style={{ width: '16px', height: '16px', color: '#94a3b8' }} />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
            <div>
              <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#1e293b', margin: '8px 0' }}>{customersCount}</div>
              <div style={{ fontSize: '12px', color: '#64748b' }}>
                <span style={{ color: '#10b981', fontWeight: 600 }}>Active data</span> dynamically loaded
              </div>
            </div>
            <div style={{ width: '100px', height: '50px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={sparklineDataGreen}>
                  <Line type="monotone" dataKey="value" stroke="#10b981" strokeWidth={2} dot={false} isAnimationActive={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div style={{ marginTop: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#64748b', marginBottom: '8px', fontWeight: 500 }}>
              <span><strong style={{ color: '#334155' }}>{customersCount}</strong> Total Customers</span>
            </div>
            <div style={{ width: '100%', height: '6px', backgroundColor: '#bfdbfe', borderRadius: '3px', overflow: 'hidden', display: 'flex' }}>
              <div style={{ width: '47%', height: '100%', backgroundColor: '#1d4ed8' }}></div>
            </div>
          </div>
        </div>

        {/* Contacts Card */}
        <div style={{ backgroundColor: '#ffffff', borderRadius: '12px', padding: '20px', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <h3 style={{ fontSize: '15px', color: '#475569', fontWeight: 600, margin: 0 }}>Contacts</h3>
            <ArrowUpRight style={{ width: '16px', height: '16px', color: '#94a3b8' }} />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
            <div>
              <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#1e293b', margin: '8px 0' }}>{contactsCount}</div>
              <div style={{ fontSize: '12px', color: '#64748b' }}>
                <span style={{ color: '#10b981', fontWeight: 600 }}>Active data</span> dynamically loaded
              </div>
            </div>
            <div style={{ width: '100px', height: '50px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={sparklineDataGreen}>
                  <Line type="monotone" dataKey="value" stroke="#10b981" strokeWidth={2} dot={false} isAnimationActive={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div style={{ marginTop: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#64748b', marginBottom: '8px', fontWeight: 500 }}>
              <span><strong style={{ color: '#334155' }}>{contactsCount}</strong> Total Contacts</span>
            </div>
            <div style={{ width: '100%', height: '6px', backgroundColor: '#bae6fd', borderRadius: '3px', overflow: 'hidden', display: 'flex' }}>
              <div style={{ width: '27%', height: '100%', backgroundColor: '#0ea5e9' }}></div>
            </div>
          </div>
        </div>

      </div>

      {/* Middle Charts Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
        
        {/* Today's Calls */}
        <div style={{ backgroundColor: '#ffffff', borderRadius: '12px', padding: '20px', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <h3 style={{ fontSize: '15px', color: '#475569', fontWeight: 600, margin: 0 }}>Today's calls</h3>
            <ArrowUpRight style={{ width: '16px', height: '16px', color: '#94a3b8' }} />
          </div>
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
            {latestEodReport && latestEodReport !== 'NONE' ? (
              <>
                <div style={{ fontSize: '48px', fontWeight: 'bold', color: '#0d9488', marginBottom: '8px' }}>{latestEodReport.calls_done || '0'}</div>
                <h4 style={{ fontSize: '16px', fontWeight: 'bold', color: '#1e293b', margin: '0 0 4px 0' }}>Calls Done Today</h4>
                <p style={{ fontSize: '13px', color: '#64748b', margin: 0 }}>Target: {latestEodReport.target_calls || '0'} calls</p>
                {todaysCalls.length > 0 && (
                  <div style={{ marginTop: '12px', fontSize: '12px', color: '#3b82f6', backgroundColor: '#eff6ff', padding: '4px 12px', borderRadius: '12px' }}>
                    {todaysCalls.length} call(s) were scheduled
                  </div>
                )}
              </>
            ) : todaysCalls.length > 0 ? (
              <>
                <div style={{ fontSize: '48px', fontWeight: 'bold', color: '#0d9488', marginBottom: '8px' }}>{todaysCalls.length}</div>
                <h4 style={{ fontSize: '16px', fontWeight: 'bold', color: '#1e293b', margin: '0 0 4px 0' }}>Calls Scheduled</h4>
                <p style={{ fontSize: '13px', color: '#64748b', margin: 0 }}>You have {todaysCalls.length} call(s) to make today!</p>
              </>
            ) : (
              <>
                <div style={{ width: '120px', height: '120px', backgroundColor: '#f1f5f9', borderRadius: '16px', marginBottom: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <svg style={{ width: '64px', height: '64px', color: '#cbd5e1' }} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"></path></svg>
                </div>
                <h4 style={{ fontSize: '16px', fontWeight: 'bold', color: '#1e293b', margin: '0 0 4px 0' }}>No calls today!</h4>
                <p style={{ fontSize: '13px', color: '#64748b', margin: 0 }}>Your phone is having a day at the beach!</p>
              </>
            )}
          </div>
        </div>

        {/* Conversion Rate */}
        <div style={{ backgroundColor: '#ffffff', borderRadius: '12px', padding: '20px', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h3 style={{ fontSize: '15px', color: '#475569', fontWeight: 600, margin: 0 }}>Conversion Rate</h3>
          </div>
          <div style={{ flex: 1, position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ width: '200px', height: '200px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={[
                      { value: leadsData.count > 0 ? leadsData.closed : 0 }, 
                      { value: leadsData.count > 0 ? (leadsData.count - leadsData.closed) : 100 }
                    ]}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={70}
                    startAngle={225}
                    endAngle={-45}
                    dataKey="value"
                    stroke="none"
                  >
                    <Cell fill="#10b981" />
                    <Cell fill="#f1f5f9" />
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', fontSize: '32px', fontWeight: 'bold', color: '#334155' }}>
                {leadsData.count > 0 ? Math.round((leadsData.closed / leadsData.count) * 100) : 0}%
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-around', borderTop: '1px solid #e2e8f0', paddingTop: '16px' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '12px', color: '#64748b', marginBottom: '4px' }}>Converted Lead</div>
              <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#1e293b' }}>{leadsData.closed}</div>
            </div>
            <div style={{ width: '1px', backgroundColor: '#e2e8f0' }}></div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '12px', color: '#64748b', marginBottom: '4px' }}>In Progress Lead</div>
              <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#1e293b' }}>{leadsData.active}</div>
            </div>
          </div>
        </div>

        {/* Lead Stages */}
        <div style={{ backgroundColor: '#ffffff', borderRadius: '12px', padding: '20px', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h3 style={{ fontSize: '15px', color: '#475569', fontWeight: 600, margin: 0 }}>Lead Stages</h3>
          </div>
          <div style={{ flex: 1, position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', height: '220px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={[{ value: 100 }]} cx="50%" cy="50%" innerRadius={85} outerRadius={95} fill="#f1f5f9" stroke="none" />
                <Pie data={[
                  { value: leadsData.count > 0 ? (leadsData.closed / leadsData.count) * 100 : 0 }, 
                  { value: leadsData.count > 0 ? 100 - ((leadsData.closed / leadsData.count) * 100) : 100 }
                ]} cx="50%" cy="50%" innerRadius={85} outerRadius={95} dataKey="value" stroke="none" startAngle={90} endAngle={-270}>
                  <Cell fill="#fbbf24" /><Cell fill="transparent" />
                </Pie>

                <Pie data={[{ value: 100 }]} cx="50%" cy="50%" innerRadius={65} outerRadius={75} fill="#f1f5f9" stroke="none" />
                <Pie data={[
                  { value: leadsData.count > 0 ? (leadsData.dead / leadsData.count) * 100 : 0 }, 
                  { value: leadsData.count > 0 ? 100 - ((leadsData.dead / leadsData.count) * 100) : 100 }
                ]} cx="50%" cy="50%" innerRadius={65} outerRadius={75} dataKey="value" stroke="none" startAngle={90} endAngle={-270}>
                  <Cell fill="#06b6d4" /><Cell fill="transparent" />
                </Pie>

                <Pie data={[{ value: 100 }]} cx="50%" cy="50%" innerRadius={45} outerRadius={55} fill="#f1f5f9" stroke="none" />
                <Pie data={[
                  { value: leadsData.count > 0 ? (leadsData.active / leadsData.count) * 100 : 0 }, 
                  { value: leadsData.count > 0 ? 100 - ((leadsData.active / leadsData.count) * 100) : 100 }
                ]} cx="50%" cy="50%" innerRadius={45} outerRadius={55} dataKey="value" stroke="none" startAngle={90} endAngle={-270}>
                  <Cell fill="#3b82f6" /><Cell fill="transparent" />
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center' }}>
              <div style={{ fontSize: '11px', color: '#64748b', fontWeight: 500 }}>Active</div>
              <div style={{ fontSize: '13px', fontWeight: 'bold', color: '#1e293b' }}>
                {leadsData.count > 0 ? ((leadsData.active / leadsData.count) * 100).toFixed(2) : 0}%
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', marginTop: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: '#64748b' }}>
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#fbbf24' }}></div> Closed
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: '#64748b' }}>
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#06b6d4' }}></div> Dead
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: '#64748b' }}>
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#3b82f6' }}></div> Active
            </div>
          </div>
        </div>

      </div>

      {/* Latest EOD Report Section */}
      {user && user.role !== 'Admin' && (
        latestEodReport === 'NONE' ? (
          <div style={{ backgroundColor: '#ffffff', borderRadius: '12px', padding: '32px 24px', border: '1px dashed #cbd5e1', textAlign: 'center', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '50%', backgroundColor: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px auto', color: '#94a3b8' }}>
            <svg style={{ width: '24px', height: '24px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
          </div>
          <h3 style={{ fontSize: '18px', color: '#0f172a', fontWeight: 'bold', margin: '0 0 8px 0' }}>Today's EOD Report</h3>
          <p style={{ color: '#64748b', fontSize: '14px', margin: 0 }}>You haven't submitted your End of Day report for today yet.</p>
        </div>
      ) : latestEodReport ? (
        <div style={{ backgroundColor: '#ffffff', borderRadius: '12px', padding: '24px', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', borderBottom: '1px solid #e2e8f0', paddingBottom: '12px' }}>
            <h3 style={{ fontSize: '16px', color: '#0f172a', fontWeight: 'bold', margin: 0 }}>My Latest EOD Report</h3>
            <span style={{ fontSize: '13px', color: '#64748b', backgroundColor: '#f1f5f9', padding: '4px 12px', borderRadius: '12px' }}>
              {new Date(latestEodReport.created_at).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
            </span>
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px' }}>
            <div>
              <h4 style={{ fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#10b981', fontWeight: 'bold', margin: '0 0 16px 0' }}>Actuals</h4>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div style={{ backgroundColor: '#f8fafc', padding: '12px', borderRadius: '8px' }}>
                  <div style={{ fontSize: '12px', color: '#64748b', marginBottom: '4px' }}>Calls Done</div>
                  <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#1e293b' }}>{latestEodReport.calls_done || '0'}</div>
                </div>
                <div style={{ backgroundColor: '#f8fafc', padding: '12px', borderRadius: '8px' }}>
                  <div style={{ fontSize: '12px', color: '#64748b', marginBottom: '4px' }}>Emails Sent</div>
                  <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#1e293b' }}>{latestEodReport.emails_sent || '0'}</div>
                </div>
                <div style={{ backgroundColor: '#f8fafc', padding: '12px', borderRadius: '8px' }}>
                  <div style={{ fontSize: '12px', color: '#64748b', marginBottom: '4px' }}>Meetings Attended</div>
                  <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#1e293b' }}>{latestEodReport.meetings_attended || '0'}</div>
                </div>
                <div style={{ backgroundColor: '#f8fafc', padding: '12px', borderRadius: '8px' }}>
                  <div style={{ fontSize: '12px', color: '#64748b', marginBottom: '4px' }}>Pipeline Added</div>
                  <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#1e293b' }}>{latestEodReport.pipeline_added || '—'}</div>
                </div>
              </div>
              {latestEodReport.key_highlights && (
                <div style={{ marginTop: '16px' }}>
                  <div style={{ fontSize: '12px', fontWeight: 600, color: '#475569', marginBottom: '4px' }}>Key Highlights:</div>
                  <div style={{ fontSize: '13px', color: '#334155', whiteSpace: 'pre-wrap' }}>{latestEodReport.key_highlights}</div>
                </div>
              )}
            </div>
            
            <div>
              <h4 style={{ fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#3b82f6', fontWeight: 'bold', margin: '0 0 16px 0' }}>Targets</h4>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div style={{ backgroundColor: '#f8fafc', padding: '12px', borderRadius: '8px' }}>
                  <div style={{ fontSize: '12px', color: '#64748b', marginBottom: '4px' }}>Consultative Discussions</div>
                  <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#1e293b' }}>{latestEodReport.target_calls || '0'}</div>
                </div>
                <div style={{ backgroundColor: '#f8fafc', padding: '12px', borderRadius: '8px' }}>
                  <div style={{ fontSize: '12px', color: '#64748b', marginBottom: '4px' }}>Emails</div>
                  <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#1e293b' }}>{latestEodReport.target_emails || '0'}</div>
                </div>
              </div>
              {latestEodReport.key_deals_focus && (
                <div style={{ marginTop: '16px' }}>
                  <div style={{ fontSize: '12px', fontWeight: 600, color: '#475569', marginBottom: '4px' }}>Key Deals Focus:</div>
                  <div style={{ fontSize: '13px', color: '#334155', whiteSpace: 'pre-wrap' }}>{latestEodReport.key_deals_focus}</div>
                </div>
              )}
            </div>
          </div>
        </div>
      ) : null
      )}

    </div>
  );
};

export default Dashboard;
