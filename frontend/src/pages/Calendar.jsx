import React, { useState, useEffect, useContext } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalIcon, Plus } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import apiClient from '../api/apiClient';
import AddEventModal from '../components/AddEventModal';
import PageSearchBar from '../components/PageSearchBar';

const Calendar = () => {
  const { user } = useContext(AuthContext);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [currentView, setCurrentView] = useState('Month');
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedDateForAdd, setSelectedDateForAdd] = useState(null);

  const fetchEvents = async () => {
    try {
      setLoading(true);
        const [callsRes, meetingsRes, todosRes] = await Promise.all([
          apiClient.get('/calls/'),
          apiClient.get('/meetings/'),
          apiClient.get('/todos/')
        ]);
        
        const allEvents = [];
        
        const getLocalYYYYMMDD = (isoString) => {
           if (!isoString) return null;
           const d = new Date(isoString);
           return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
        };

        (callsRes.data || []).forEach(c => {
          if (c.start_date) {
            allEvents.push({ ...c, eventType: 'call', displayTitle: c.title || 'Call', dateStr: getLocalYYYYMMDD(c.start_date), clickable: true });
          }
        });
        
        (meetingsRes.data || []).forEach(m => {
          if (m.from_date) {
            allEvents.push({ ...m, eventType: 'meeting', displayTitle: m.title || 'Meeting', dateStr: getLocalYYYYMMDD(m.from_date), clickable: true });
          }
        });
        
        (todosRes.data || []).forEach(t => {
          if (t.due_date) {
            allEvents.push({ ...t, eventType: 'todo', displayTitle: t.title || 'To-do', dateStr: getLocalYYYYMMDD(t.due_date), clickable: true });
          }
        });
        
        setEvents(allEvents);
      } catch (err) {
        console.error("Error fetching events", err);
      } finally {
        setLoading(false);
      }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const getMonthYearString = () => {
    return currentDate.toLocaleString('default', { month: 'long', year: 'numeric' });
  };

  const renderEmptyState = () => (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', textAlign: 'center', padding: '32px' }}>
      <div style={{ width: '160px', height: '160px', backgroundColor: '#f1f5f9', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '24px' }}>
        <CalIcon style={{ width: '64px', height: '64px', color: '#cbd5e1' }} strokeWidth={1} />
      </div>
      <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: '#1e293b', margin: 0 }}>Click on the day to<br/>see the breakdown</h3>
    </div>
  );

  const renderEventDetails = () => (
    <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', height: '100%' }}>
      <h3 style={{ fontSize: '16px', fontWeight: 'bold', color: '#1e293b', margin: '0 0 24px 0', borderBottom: '1px solid #e2e8f0', paddingBottom: '12px' }}>Meeting Information</h3>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <div style={{ display: 'flex', gap: '16px' }}>
          <span style={{ width: '100px', fontSize: '14px', color: '#64748b', fontWeight: 500 }}>Title</span>
          <span style={{ flex: 1, fontSize: '14px', color: '#1e293b', fontWeight: 600 }}>-Reschedule: Virtual Demo</span>
        </div>
        
        <div style={{ display: 'flex', gap: '16px' }}>
          <span style={{ width: '100px', fontSize: '14px', color: '#64748b', fontWeight: 500 }}>From Date</span>
          <span style={{ flex: 1, fontSize: '14px', color: '#1e293b', fontWeight: 500 }}>08/06/2026<br/>01:00:00 PM</span>
        </div>
        
        <div style={{ display: 'flex', gap: '16px' }}>
          <span style={{ width: '100px', fontSize: '14px', color: '#64748b', fontWeight: 500 }}>To Date</span>
          <span style={{ flex: 1, fontSize: '14px', color: '#1e293b', fontWeight: 500 }}>08/06/2026<br/>02:00:00 PM</span>
        </div>
        
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
          <span style={{ width: '100px', fontSize: '14px', color: '#64748b', fontWeight: 500 }}>Meeting Owner</span>
          <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: '#e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b', fontWeight: 600, fontSize: '14px' }}>
            {user?.name?.[0]?.toUpperCase() || user?.username?.[0]?.toUpperCase() || 'U'}
          </div>
          <span style={{ flex: 1, fontSize: '14px', color: '#1e293b', fontWeight: 500 }}>{user?.name || user?.username || 'User'}</span>
        </div>
        
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
          <span style={{ width: '100px', fontSize: '14px', color: '#64748b', fontWeight: 500 }}>Type</span>
          <span style={{ padding: '4px 12px', backgroundColor: '#e0f2fe', color: '#0056b3', borderRadius: '4px', fontSize: '12px', fontWeight: 600 }}>Virtual</span>
        </div>
        
        <div style={{ display: 'flex', gap: '16px' }}>
          <span style={{ width: '100px', fontSize: '14px', color: '#64748b', fontWeight: 500 }}>Meeting Link</span>
          <span style={{ flex: 1, fontSize: '14px', color: '#1e293b', fontWeight: 500 }}>-</span>
        </div>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '12px' }}>
          <span style={{ fontSize: '14px', color: '#64748b', fontWeight: 500 }}>Lead</span>
          <div style={{ padding: '12px', border: '1px solid #e0f2fe', borderRadius: '8px', backgroundColor: '#f0f9ff' }}>
            <span style={{ color: '#0056b3', fontWeight: 600, fontSize: '14px' }}>Jignesh Patel</span>
          </div>
        </div>
      </div>
    </div>
  );

  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  
  const generateGrid = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const daysInPrevMonth = new Date(year, month, 0).getDate();

    const grid = [];
    let currentDay = 1;
    let nextMonthDay = 1;
    
    for (let row = 0; row < 6; row++) {
      const days = [];
      for (let col = 0; col < 7; col++) {
        if (row === 0 && col < firstDay) {
          days.push({ date: daysInPrevMonth - firstDay + col + 1, isPrevMonth: true });
        } else if (currentDay <= daysInMonth) {
          days.push({ date: currentDay, isPrevMonth: false });
          currentDay++;
        } else {
          days.push({ date: nextMonthDay, isPrevMonth: true });
          nextMonthDay++;
        }
      }
      grid.push(days);
      if (currentDay > daysInMonth && row >= 4) break;
    }
    return grid;
  };

  const getEventsForDate = (date) => {
    const targetD = new Date(currentDate.getFullYear(), currentDate.getMonth(), date);
    const targetDateStr = `${targetD.getFullYear()}-${String(targetD.getMonth() + 1).padStart(2, '0')}-${String(targetD.getDate()).padStart(2, '0')}`;
    
    const dayEvents = events.filter(e => e.dateStr === targetDateStr);
    if (dayEvents.length > 3) {
       return [
         ...dayEvents.slice(0, 2),
         { type: 'more', label: `+${dayEvents.length - 2} more` }
       ];
    }
    return dayEvents;
  };

  const grid = generateGrid();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', maxWidth: '100%', margin: '0 auto', height: '100%' }}>
      
      <div style={{ marginBottom: '-8px' }}>
        <PageSearchBar placeholder="Search events..." />
      </div>

      <div style={{ display: 'flex', height: '100%', gap: '24px', maxWidth: '100%', margin: '0 auto' }}>
      
      {/* Main Calendar Area */}
      <div style={{ flex: 1, backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        
        {/* Toolbar */}
        <div style={{ padding: '24px', borderBottom: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          
          <div style={{ display: 'flex', gap: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', fontWeight: 600, color: '#475569' }}>
              <div style={{ width: '12px', height: '12px', backgroundColor: '#8b5cf6', borderRadius: '2px' }}></div> Meeting
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', fontWeight: 600, color: '#475569' }}>
              <div style={{ width: '12px', height: '12px', backgroundColor: '#22c55e', borderRadius: '2px' }}></div> Call
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', fontWeight: 600, color: '#475569' }}>
              <div style={{ width: '12px', height: '12px', backgroundColor: '#007bff', borderRadius: '2px' }}></div> To-dos
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <ChevronLeft onClick={handlePrevMonth} style={{ width: '20px', height: '20px', color: '#64748b', cursor: 'pointer' }} />
              <ChevronRight onClick={handleNextMonth} style={{ width: '20px', height: '20px', color: '#64748b', cursor: 'pointer' }} />
              <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: '#1e293b', margin: 0, minWidth: '220px', textAlign: 'center' }}>
                {getMonthYearString()}
              </h2>
            </div>
          </div>

          <div style={{ display: 'flex', backgroundColor: '#ffffff', borderRadius: '6px', border: '1px solid #cbd5e1', overflow: 'hidden' }}>
            {['Month', 'Week', 'Day', 'List'].map(view => (
              <button 
                key={view}
                onClick={() => setCurrentView(view)}
                style={{ 
                  padding: '8px 16px', 
                  border: 'none', 
                  borderRight: view !== 'List' ? '1px solid #cbd5e1' : 'none', 
                  backgroundColor: currentView === view ? '#e0f2fe' : 'transparent',
                  color: currentView === view ? '#0369a1' : '#64748b',
                  fontSize: '14px',
                  fontWeight: 500,
                  cursor: 'pointer'
                }}
              >
                {view}
              </button>
            ))}
          </div>

        </div>

        {/* Views */}
        {loading ? (
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b' }}>Loading...</div>
        ) : currentView === 'Month' ? (
          <>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', borderBottom: '1px solid #e2e8f0', backgroundColor: '#f8fafc' }}>
              {daysOfWeek.map(day => (
                <div key={day} style={{ padding: '12px', textAlign: 'center', fontSize: '13px', fontWeight: 600, color: '#475569' }}>
                  {day}
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
              {grid.map((row, rowIdx) => (
                <div key={rowIdx} style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', flex: 1, borderBottom: rowIdx !== grid.length - 1 ? '1px solid #e2e8f0' : 'none' }}>
                  {row.map((day, colIdx) => {
                    const events = day.isPrevMonth ? [] : getEventsForDate(day.date);
                    return (
                      <div 
                        key={colIdx} 
                        onClick={() => {
                          if (!day.isPrevMonth) {
                            const targetD = new Date(currentDate.getFullYear(), currentDate.getMonth(), day.date);
                            setSelectedDateForAdd(`${targetD.getFullYear()}-${String(targetD.getMonth() + 1).padStart(2, '0')}-${String(targetD.getDate()).padStart(2, '0')}`);
                            setIsAddModalOpen(true);
                          }
                        }}
                        style={{ borderRight: colIdx !== 6 ? '1px solid #e2e8f0' : 'none', padding: '8px', display: 'flex', flexDirection: 'column', gap: '4px', minHeight: '120px', cursor: day.isPrevMonth ? 'default' : 'pointer' }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                          <span style={{ fontSize: '14px', fontWeight: 500, color: day.isPrevMonth ? '#cbd5e1' : '#1e293b' }}>
                            {day.date}
                          </span>
                          {!day.isPrevMonth && (
                            <div style={{ padding: '2px', backgroundColor: '#f1f5f9', borderRadius: '4px', color: '#94a3b8' }}>
                              <Plus style={{ width: '12px', height: '12px' }} />
                            </div>
                          )}
                        </div>
                        
                        {events.map((evt, i) => {
                          if (evt.type === 'more') {
                            return <span key={i} style={{ fontSize: '11px', color: '#94a3b8', fontWeight: 500, padding: '2px 4px' }}>{evt.label}</span>;
                          }
                          
                          let bg = '#ffffff';
                          let color = '#ffffff';
                          if (evt.eventType === 'call') { bg = '#dcfce7'; color = '#16a34a'; }
                          if (evt.eventType === 'meeting') { bg = '#ede9fe'; color = '#7c3aed'; }
                          if (evt.eventType === 'todo') { bg = '#e0f2fe'; color = '#0056b3'; }

                          return (
                            <div 
                              key={i} 
                              onClick={(e) => { e.stopPropagation(); if(evt.clickable) setSelectedEvent(evt); }}
                              style={{ 
                                padding: '4px 6px', 
                                backgroundColor: bg, 
                                color: color, 
                                borderRadius: '4px', 
                                fontSize: '11px', 
                                fontWeight: 600,
                                whiteSpace: 'nowrap',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                cursor: evt.clickable ? 'pointer' : 'default',
                                boxShadow: evt.clickable && selectedEvent?.id === evt.id ? `0 0 0 2px ${color}40` : 'none'
                              }}
                            >
                              {evt.displayTitle}
                            </div>
                          );
                        })}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </>
        ) : currentView === 'Week' ? (
          <div style={{ flex: 1, padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {grid.filter(row => row.some(d => !d.isPrevMonth && d.date === currentDate.getDate())).map((row, rowIdx) => (
              <div key={rowIdx} style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '16px', flex: 1 }}>
                {row.map((day, colIdx) => {
                  const targetDStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day.date).padStart(2, '0')}`;
                  const dayEvents = day.isPrevMonth ? [] : events.filter(e => e.dateStr === targetDStr);
                  return (
                    <div 
                      key={colIdx} 
                      onClick={() => {
                        if (!day.isPrevMonth) {
                          setSelectedDateForAdd(targetDStr);
                          setIsAddModalOpen(true);
                        }
                      }}
                      style={{ backgroundColor: '#f8fafc', borderRadius: '8px', padding: '12px', border: '1px solid #e2e8f0', cursor: day.isPrevMonth ? 'default' : 'pointer' }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                        <div style={{ fontSize: '14px', fontWeight: 'bold', color: '#334155' }}>
                          {daysOfWeek[colIdx]} {day.date}
                        </div>
                        {!day.isPrevMonth && <Plus style={{ width: '14px', height: '14px', color: '#94a3b8' }} />}
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        {dayEvents.map((evt, i) => {
                          let bg = '#ffffff'; let color = '#ffffff';
                          if (evt.eventType === 'call') { bg = '#dcfce7'; color = '#16a34a'; }
                          if (evt.eventType === 'meeting') { bg = '#ede9fe'; color = '#7c3aed'; }
                          if (evt.eventType === 'todo') { bg = '#e0f2fe'; color = '#0056b3'; }
                          return (
                            <div key={i} onClick={(e) => { e.stopPropagation(); setSelectedEvent(evt); }} style={{ padding: '8px', backgroundColor: bg, color: color, borderRadius: '6px', fontSize: '12px', fontWeight: 600, cursor: 'pointer' }}>
                              {evt.displayTitle}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        ) : currentView === 'Day' ? (
          <div style={{ flex: 1, padding: '24px', display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h3 style={{ fontSize: '20px', fontWeight: 'bold', color: '#1e293b', margin: 0 }}>
                {currentDate.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
              </h3>
              <button 
                onClick={() => {
                  setSelectedDateForAdd(`${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(currentDate.getDate()).padStart(2, '0')}`);
                  setIsAddModalOpen(true);
                }}
                style={{ padding: '8px 16px', backgroundColor: '#007bff', color: '#ffffff', border: 'none', borderRadius: '8px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}
              >
                <Plus style={{ width: '16px', height: '16px' }} /> Add Event
              </button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {events.filter(e => e.dateStr === `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(currentDate.getDate()).padStart(2, '0')}`).map((evt, i) => {
                let bg = '#ffffff'; let color = '#ffffff';
                if (evt.eventType === 'call') { bg = '#dcfce7'; color = '#16a34a'; }
                if (evt.eventType === 'meeting') { bg = '#ede9fe'; color = '#7c3aed'; }
                if (evt.eventType === 'todo') { bg = '#e0f2fe'; color = '#0056b3'; }
                return (
                  <div key={i} onClick={() => setSelectedEvent(evt)} style={{ padding: '16px', backgroundColor: bg, color: color, borderRadius: '8px', fontSize: '14px', fontWeight: 600, cursor: 'pointer', border: `1px solid ${color}40` }}>
                    {evt.displayTitle}
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <div style={{ flex: 1, padding: '24px', overflowY: 'auto' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {events.slice().sort((a, b) => new Date(a.dateStr) - new Date(b.dateStr)).map((evt, i) => {
                let bg = '#ffffff'; let color = '#ffffff';
                if (evt.eventType === 'call') { bg = '#dcfce7'; color = '#16a34a'; }
                if (evt.eventType === 'meeting') { bg = '#ede9fe'; color = '#7c3aed'; }
                if (evt.eventType === 'todo') { bg = '#e0f2fe'; color = '#0056b3'; }
                return (
                  <div key={i} onClick={() => setSelectedEvent(evt)} style={{ padding: '16px', backgroundColor: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: '16px', cursor: 'pointer' }}>
                    <div style={{ padding: '4px 8px', backgroundColor: bg, color: color, borderRadius: '4px', fontSize: '12px', fontWeight: 'bold' }}>{evt.eventType.toUpperCase()}</div>
                    <div style={{ flex: 1, fontSize: '15px', fontWeight: 600, color: '#1e293b' }}>{evt.displayTitle}</div>
                    <div style={{ fontSize: '13px', color: '#64748b', fontWeight: 500 }}>{new Date(evt.dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
        
        <AddEventModal 
        isOpen={isAddModalOpen} 
        onClose={() => setIsAddModalOpen(false)} 
        defaultDate={selectedDateForAdd}
        onSuccess={() => fetchEvents()}
      />

    </div>

      {/* Right Details Panel */}
      <div style={{ width: '320px', backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)', flexShrink: 0 }}>
        {selectedEvent ? renderEventDetails() : renderEmptyState()}
      </div>

      </div>
    </div>
  );
};

export default Calendar;
