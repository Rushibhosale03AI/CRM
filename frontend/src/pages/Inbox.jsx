import React, { useState, useEffect } from 'react';
import { Search, Filter, MoreVertical, MessageSquare, PhoneCall, Star, Video, Image, Paperclip, Send, Smile } from 'lucide-react';
import apiClient from '../api/apiClient';
import PageSearchBar from '../components/PageSearchBar';
import Loader from '../components/Loader';

const Inbox = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get('messages/');
      setMessages(response.data);
    } catch (error) {
      console.error("Error fetching messages:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loader message="Loading Inbox..." />;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', maxWidth: '100%', margin: '0 auto', gap: '24px' }}>
      
      <div style={{ marginBottom: '-8px' }}>
        <PageSearchBar placeholder="Search inbox..." />
      </div>

      {/* Container */}
      <div style={{ 
        display: 'flex', 
        flex: 1, 
        backgroundColor: '#ffffff', 
        borderRadius: '12px', 
        border: '1px solid #e2e8f0', 
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)', 
        overflow: 'hidden' 
      }}>
        
        {/* Left Sidebar - Contacts */}
        <div style={{ width: '360px', borderRight: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', backgroundColor: '#ffffff', zIndex: 10 }}>
          
          <div style={{ padding: '24px', borderBottom: '1px solid #f1f5f9' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
              <h2 style={{ fontSize: '18px', fontWeight: 'bold', color: '#1e293b', margin: 0 }}>Messages</h2>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button style={{ padding: '8px', borderRadius: '8px', border: '1px solid #e2e8f0', backgroundColor: '#ffffff', color: '#64748b', cursor: 'pointer' }}>
                  <Filter style={{ width: '16px', height: '16px' }} />
                </button>
                <button style={{ padding: '8px', borderRadius: '8px', backgroundColor: '#007bff', color: '#ffffff', border: 'none', cursor: 'pointer' }}>
                  <MessageSquare style={{ width: '16px', height: '16px' }} />
                </button>
              </div>
            </div>
            
            <div style={{ position: 'relative' }}>
              <Search style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8', width: '16px', height: '16px' }} />
              <input 
                type="text" 
                placeholder="Search conversations..." 
                style={{
                  width: '100%',
                  padding: '12px 12px 12px 36px',
                  backgroundColor: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                  fontSize: '14px',
                  color: '#1e293b',
                  outline: 'none',
                  boxSizing: 'border-box',
                  transition: 'border-color 0.2s'
                }}
                onFocus={(e) => e.target.style.borderColor = '#007bff'}
                onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
              />
            </div>
          </div>

          <div style={{ flex: 1, overflowY: 'auto', padding: '8px' }}>
            {messages.map((msg, index) => (
              <div 
                key={msg.id} 
                style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '12px', 
                  padding: '16px', 
                  cursor: 'pointer', 
                  borderRadius: '8px',
                  marginBottom: '4px',
                  backgroundColor: index === 0 ? '#eff6ff' : 'transparent',
                  transition: 'background-color 0.2s'
                }} 
                onMouseEnter={(e) => { if(index !== 0) e.currentTarget.style.backgroundColor = '#f8fafc' }} 
                onMouseLeave={(e) => { if(index !== 0) e.currentTarget.style.backgroundColor = 'transparent' }}
              >
                <div style={{ position: 'relative' }}>
                  <div style={{ 
                    width: '48px', 
                    height: '48px', 
                    borderRadius: '50%', 
                    background: `linear-gradient(135deg, ${index === 0 ? '#2dd4bf, #2563eb' : '#cbd5e1, #94a3b8'})`,
                    color: '#ffffff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '18px',
                    fontWeight: 'bold',
                    flexShrink: 0 
                  }}>
                    {msg.platform ? msg.platform.charAt(0) : 'M'}
                  </div>
                </div>

                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '4px' }}>
                    <h4 style={{ fontSize: '15px', fontWeight: 600, color: '#1e293b', margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{msg.platform}</h4>
                    <span style={{ fontSize: '12px', color: '#94a3b8', fontWeight: 400 }}>{new Date(msg.sent_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <p style={{ fontSize: '13px', color: '#64748b', margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', fontWeight: 400 }}>{msg.message_body}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>


        </div>

        {/* Right Main Area - Chat */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', backgroundColor: '#f8fafc', position: 'relative' }}>
          
          {/* Chat Header */}
          <div style={{ padding: '20px 24px', backgroundColor: '#ffffff', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', zIndex: 10 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{ 
                width: '40px', 
                height: '40px', 
                borderRadius: '50%', 
                background: 'linear-gradient(135deg, #2dd4bf, #2563eb)',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '16px',
                fontWeight: 'bold',
              }}>
                U
              </div>
              <div>
                <h3 style={{ fontSize: '16px', fontWeight: 'bold', color: '#1e293b', margin: '0 0 2px 0' }}>Umesh Jadav</h3>
                <span style={{ fontSize: '13px', color: '#10b981', display: 'flex', alignItems: 'center', gap: '4px' }}><div style={{ width: '6px', height: '6px', backgroundColor: '#10b981', borderRadius: '50%' }}></div> Online</span>
              </div>
            </div>
            
            <div style={{ display: 'flex', gap: '12px' }}>
              <button style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: '#f1f5f9', border: 'none', color: '#64748b', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s' }} onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#e2e8f0'; e.currentTarget.style.color = '#3b82f6' }} onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#f1f5f9'; e.currentTarget.style.color = '#64748b' }}>
                <PhoneCall style={{ width: '18px', height: '18px' }} />
              </button>
              <button style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: '#f1f5f9', border: 'none', color: '#64748b', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s' }} onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#e2e8f0'; e.currentTarget.style.color = '#3b82f6' }} onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#f1f5f9'; e.currentTarget.style.color = '#64748b' }}>
                <Video style={{ width: '18px', height: '18px' }} />
              </button>
              <button style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: '#f1f5f9', border: 'none', color: '#64748b', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s' }} onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#e2e8f0'; e.currentTarget.style.color = '#f59e0b' }} onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#f1f5f9'; e.currentTarget.style.color = '#64748b' }}>
                <Star style={{ width: '18px', height: '18px' }} />
              </button>
              <button style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: '#f1f5f9', border: 'none', color: '#64748b', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#e2e8f0'} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#f1f5f9'}>
                <MoreVertical style={{ width: '18px', height: '18px' }} />
              </button>
            </div>
          </div>

          {/* Chat Messages Area */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '24px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
            
            <div style={{ textAlign: 'center', margin: '16px 0' }}>
              <span style={{ backgroundColor: '#e2e8f0', color: '#64748b', fontSize: '12px', padding: '4px 12px', borderRadius: '12px', fontWeight: 500 }}>Today</span>
            </div>

            {/* Received Message */}
            <div style={{ display: 'flex', gap: '12px', maxWidth: '80%' }}>
              <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'linear-gradient(135deg, #2dd4bf, #2563eb)', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', fontWeight: 'bold', flexShrink: 0 }}>
                U
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <div style={{ backgroundColor: '#ffffff', padding: '12px 16px', borderRadius: '2px 16px 16px 16px', boxShadow: '0 1px 2px rgba(0,0,0,0.05)', color: '#334155', fontSize: '14px', lineHeight: '1.5' }}>
                  Hi, I need quotation for 20 laptops for our new office.
                </div>
                <span style={{ fontSize: '11px', color: '#94a3b8', marginLeft: '4px' }}>10:42 AM</span>
              </div>
            </div>

            {/* Sent Message */}
            <div style={{ display: 'flex', gap: '12px', maxWidth: '80%', alignSelf: 'flex-end', flexDirection: 'row-reverse' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', alignItems: 'flex-end' }}>
                <div style={{ backgroundColor: '#007bff', color: '#ffffff', padding: '12px 16px', borderRadius: '16px 2px 16px 16px', boxShadow: '0 1px 2px rgba(0,0,0,0.05)', fontSize: '14px', lineHeight: '1.5' }}>
                  Hello Umesh! Sure, I will prepare the quotation right away. Do you have any specific brand preferences?
                </div>
                <span style={{ fontSize: '11px', color: '#94a3b8', marginRight: '4px' }}>10:45 AM</span>
              </div>
            </div>

          </div>

          {/* Chat Input */}
          <div style={{ padding: '20px 24px', backgroundColor: '#ffffff', borderTop: '1px solid #e2e8f0', zIndex: 10 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', backgroundColor: '#f8fafc', padding: '8px 16px', borderRadius: '24px', border: '1px solid #e2e8f0' }}>
              <button style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', display: 'flex', alignItems: 'center', padding: '4px' }}>
                <Smile style={{ width: '20px', height: '20px' }} />
              </button>
              <button style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', display: 'flex', alignItems: 'center', padding: '4px' }}>
                <Paperclip style={{ width: '20px', height: '20px' }} />
              </button>
              <button style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', display: 'flex', alignItems: 'center', padding: '4px' }}>
                <Image style={{ width: '20px', height: '20px' }} />
              </button>
              
              <input 
                type="text" 
                placeholder="Type a message..." 
                style={{
                  flex: 1,
                  border: 'none',
                  backgroundColor: 'transparent',
                  fontSize: '15px',
                  color: '#1e293b',
                  outline: 'none',
                  padding: '8px'
                }}
              />
              
              <button style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: '#007bff', color: '#ffffff', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 4px rgba(20, 184, 166, 0.3)', transition: 'transform 0.1s' }} onMouseDown={(e) => e.currentTarget.style.transform = 'scale(0.95)'} onMouseUp={(e) => e.currentTarget.style.transform = 'scale(1)'}>
                <Send style={{ width: '18px', height: '18px', marginLeft: '2px' }} />
              </button>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};

export default Inbox;
