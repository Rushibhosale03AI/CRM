import React, { useState } from 'react';
import { 
  ChevronDown, X, Layout, Activity, StickyNote, Paperclip, Contact, Mail, MoreVertical, Calendar, PhoneCall
} from 'lucide-react';
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
  
  if (loading) return <Loader message="Loading CustomerEdit..." />;

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
                onChange({ target: { name, value: opt.value || opt } });
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

const tabs = [
  { id: 'customer-info', label: 'Customer Info.', icon: Layout },
  { id: 'open-activity', label: 'Open Activity', icon: Activity },
  { id: 'close-activity', label: 'Close Activity', icon: Activity },
  { id: 'notes', label: 'Notes', icon: StickyNote },
  { id: 'attachments', label: 'Attachments', icon: Paperclip },
  { id: 'associated-contacts', label: 'Associated Contacts', icon: Contact },
  { id: 'emails', label: 'Emails', icon: Mail }
];

const CustomerEdit = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState('open-activity'); // Default to Open Activity based on screenshot
  const [loading, setLoading] = useState(!!id);
  const [formData, setFormData] = useState({
    customer_owner: '',
    name: '',
    industry: '',
    lead_name: '',
    mobile: '',
    email: '',
    phone: '',
    website: '',
    gst_no: '',
    customer_status: '',
    street: '',
    city: '',
    state: '',
    zip_code: '',
    country: '',
    description: ''
  });

  useEffect(() => {
    if (id) {
      fetchCustomer();
    }
  }, [id]);

  const fetchCustomer = async () => {
    try {
      const response = await apiClient.get(`customers/${id}/`);
      setFormData(response.data);
    } catch (error) {
      console.error("Error fetching customer:", error);
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
        await apiClient.put(`customers/${id}/`, formData);
      } else {
        await apiClient.post('customers/', formData);
      }
      navigate('/customers');
    } catch (error) {
      console.error("Error saving customer:", error);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', maxWidth: '100%', margin: '0 auto' }}>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#ffffff', padding: '16px 24px', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
        <h1 style={{ fontSize: '20px', fontWeight: 'bold', color: '#1e293b', margin: 0 }}>Customer Name</h1>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button 
            onClick={() => navigate('/customers')}
            style={{ padding: '8px 16px', backgroundColor: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '6px', color: '#64748b', fontWeight: 500, cursor: 'pointer' }}>
            Cancel
          </button>
          <button 
            onClick={handleSave}
            style={{ padding: '8px 16px', backgroundColor: '#0f172a', border: 'none', borderRadius: '6px', color: '#ffffff', fontWeight: 500, cursor: 'pointer' }}>
            Save
          </button>
        </div>
      </div>

      {/* Tabs and Content Container */}
      <div style={{ backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', minHeight: '600px' }}>
        
        {/* Tabs Header */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', padding: '0 24px', borderBottom: '1px solid #e2e8f0' }}>
          {tabs.map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '16px 8px',
                  backgroundColor: 'transparent',
                  border: 'none',
                  borderBottom: isActive ? '2px solid #0f172a' : '2px solid transparent',
                  color: isActive ? '#0f172a' : '#64748b',
                  fontSize: '14px',
                  fontWeight: isActive ? 600 : 500,
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  marginBottom: '-1px'
                }}
              >
                <Icon style={{ width: '16px', height: '16px', color: isActive ? '#0f172a' : '#64748b' }} />
                {tab.label}
              </button>
            )
          })}
        </div>

        {/* Tab Content */}
        <div style={{ padding: '32px 24px' }}>
          
          {activeTab === 'customer-info' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '32px', maxWidth: '1000px' }}>
              {/* Customer Information Section */}
              <div>
                <h2 style={{ fontSize: '16px', fontWeight: 600, color: '#334155', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  Customer Information
                </h2>
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                  <CustomSelect 
                    label="Customer Owner" 
                    name="customer_owner"
                    value={formData.customer_owner}
                    onChange={handleChange}
                    options={['Alice Johnson', 'Prem Kumar Gade', 'Akshat Shah']} 
                    isRequired 
                  />
                  <CustomInput label="Customer Name" name="name" value={formData.name} onChange={handleChange} placeholder="Enter customer name" isRequired />
                  <CustomInput label="Industry" name="industry" value={formData.industry} onChange={handleChange} placeholder="Enter industry" />
                  <CustomInput label="Lead Name" name="lead_name" value={formData.lead_name} onChange={handleChange} placeholder="Enter associated lead name" />
                  <CustomInput label="Mobile" name="mobile" value={formData.mobile} onChange={handleChange} placeholder="e.g. +91 9876543210" isRequired />
                  <CustomInput label="Email" name="email" value={formData.email} onChange={handleChange} placeholder="e.g. example@domain.com" />
                  <CustomInput label="Phone" name="phone" value={formData.phone} onChange={handleChange} placeholder="e.g. +91 1234567890" />
                  <CustomInput label="Website" name="website" value={formData.website} onChange={handleChange} placeholder="e.g. www.company.com" />
                  <CustomInput label="GST Number" name="gst_no" value={formData.gst_no} onChange={handleChange} placeholder="Enter GST Number" />
                  <CustomSelect 
                    label="Customer Status" 
                    name="customer_status"
                    value={formData.customer_status}
                    onChange={handleChange}
                    placeholder="-None-" 
                    options={['Active', 'Inactive', 'Closed']} 
                  />
                </div>
              </div>

              {/* Address Information Section */}
              <div>
                <h2 style={{ fontSize: '16px', fontWeight: 600, color: '#334155', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  Address Information
                </h2>
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                  <div style={{ gridColumn: '1 / -1' }}>
                    <CustomInput label="Street" name="street" value={formData.street} onChange={handleChange} placeholder="Enter street address" />
                  </div>
                  <CustomInput label="City" name="city" value={formData.city} onChange={handleChange} placeholder="Enter city" />
                  <CustomInput label="State" name="state" value={formData.state} onChange={handleChange} placeholder="Enter state" />
                  <CustomInput label="Zip Code" name="zip_code" value={formData.zip_code} onChange={handleChange} placeholder="Enter zip code" />
                  <CustomSelect 
                    label="Country" 
                    name="country"
                    value={formData.country}
                    onChange={handleChange}
                    placeholder="-None-" 
                    options={['India', 'USA', 'UK', 'Australia', 'Canada']} 
                  />
                </div>
              </div>

              {/* Description Section */}
              <div>
                <h2 style={{ fontSize: '16px', fontWeight: 600, color: '#334155', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  Description
                </h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <label style={{ fontSize: '14px', fontWeight: 500, color: '#334155' }}>Description</label>
                  <textarea 
                    rows={4}
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Enter customer description..."
                    style={{
                      padding: '12px 14px',
                      border: '1px solid #cbd5e1',
                      borderRadius: '6px',
                      fontSize: '14px',
                      color: '#1e293b',
                      outline: 'none',
                      backgroundColor: '#ffffff',
                      resize: 'vertical'
                    }}
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'open-activity' && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '32px' }}>
               
               {/* Open To-dos */}
               <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', borderBottom: '1px solid #e2e8f0', paddingBottom: '12px' }}>
                     <StickyNote style={{ width: '18px', height: '18px', color: '#64748b' }} />
                     <h3 style={{ fontSize: '15px', fontWeight: 600, color: '#1e293b', margin: 0 }}>Open To-dos</h3>
                     <span style={{ backgroundColor: '#0f172a', color: 'white', fontSize: '12px', padding: '2px 8px', borderRadius: '12px', fontWeight: 'bold' }}>0</span>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px 0', textAlign: 'center' }}>
                     <div style={{ width: '100%', maxWidth: '220px', height: '160px', backgroundColor: '#f8fafc', borderRadius: '12px', marginBottom: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                       <img src="https://ui-avatars.com/api/?name=Todo&background=e2e8f0&color=94a3b8&size=100&font-size=0.33&rounded=true" alt="Illustration" style={{ opacity: 0.5, borderRadius: '50%' }} />
                     </div>
                     <h4 style={{ fontSize: '16px', fontWeight: 'bold', color: '#1e293b', margin: '0 0 8px 0' }}>No open Todo yet?</h4>
                     <p style={{ fontSize: '13px', color: '#64748b', margin: 0, lineHeight: '1.5' }}>Start adding Todo and managing your<br/>workload!</p>
                  </div>
               </div>

               {/* Open Meetings */}
               <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', borderBottom: '1px solid #e2e8f0', paddingBottom: '12px' }}>
                     <Calendar style={{ width: '18px', height: '18px', color: '#64748b' }} />
                     <h3 style={{ fontSize: '15px', fontWeight: 600, color: '#1e293b', margin: 0 }}>Open Meetings</h3>
                     <span style={{ backgroundColor: '#0f172a', color: 'white', fontSize: '12px', padding: '2px 8px', borderRadius: '12px', fontWeight: 'bold' }}>0</span>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px 0', textAlign: 'center' }}>
                     <div style={{ width: '100%', maxWidth: '220px', height: '160px', backgroundColor: '#f8fafc', borderRadius: '12px', marginBottom: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                       <img src="https://ui-avatars.com/api/?name=Meeting&background=e2e8f0&color=94a3b8&size=100&font-size=0.33&rounded=true" alt="Illustration" style={{ opacity: 0.5, borderRadius: '50%' }} />
                     </div>
                     <h4 style={{ fontSize: '16px', fontWeight: 'bold', color: '#1e293b', margin: '0 0 8px 0' }}>No Meetings here yet?</h4>
                     <p style={{ fontSize: '13px', color: '#64748b', margin: 0, lineHeight: '1.5' }}>Start scheduling Meetings for<br/>productive team discussions.</p>
                  </div>
               </div>

               {/* Open Calls */}
               <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', borderBottom: '1px solid #e2e8f0', paddingBottom: '12px' }}>
                     <PhoneCall style={{ width: '18px', height: '18px', color: '#64748b' }} />
                     <h3 style={{ fontSize: '15px', fontWeight: 600, color: '#1e293b', margin: 0 }}>Open Calls</h3>
                     <span style={{ backgroundColor: '#0f172a', color: 'white', fontSize: '12px', padding: '2px 8px', borderRadius: '12px', fontWeight: 'bold' }}>2</span>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', paddingTop: '8px' }}>
                     
                     {/* Call Item 1 */}
                     <div style={{ borderBottom: '1px solid #f1f5f9', paddingBottom: '16px', display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                        <MoreVertical style={{ width: '18px', height: '18px', color: '#94a3b8', cursor: 'pointer', marginTop: '2px' }} />
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                           <span style={{ fontSize: '14px', fontWeight: 600, color: '#0f172a' }}>Call Scheduled with</span>
                           <span style={{ fontSize: '14px', color: '#0f172a', fontWeight: 500 }}>( AAA )</span>
                           <span style={{ fontSize: '13px', color: '#475569' }}>03/06/2026 09:31:11 AM</span>
                           <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: '#64748b', marginTop: '4px' }}>
                              <Contact style={{ width: '14px', height: '14px' }} />
                              Yomesh Modi
                           </div>
                        </div>
                     </div>

                     {/* Call Item 2 */}
                     <div style={{ borderBottom: '1px solid #f1f5f9', paddingBottom: '16px', display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                        <MoreVertical style={{ width: '18px', height: '18px', color: '#94a3b8', cursor: 'pointer', marginTop: '2px' }} />
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                           <span style={{ fontSize: '14px', fontWeight: 600, color: '#0f172a' }}>Call Scheduled with</span>
                           <span style={{ fontSize: '14px', color: '#0f172a', fontWeight: 500 }}>( asdf )</span>
                           <span style={{ fontSize: '13px', color: '#475569' }}>02/06/2026 05:59:49 PM</span>
                           <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: '#64748b', marginTop: '4px' }}>
                              <Contact style={{ width: '14px', height: '14px' }} />
                              Samhitha N
                           </div>
                        </div>
                     </div>

                  </div>
               </div>

            </div>
          )}

          {/* Fallback for other tabs */}
          {['close-activity', 'notes', 'attachments', 'associated-contacts', 'emails'].includes(activeTab) && (
             <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '80px 0', color: '#64748b', backgroundColor: '#f8fafc', borderRadius: '12px' }}>
                <div style={{ marginBottom: '16px' }}>
                  {(() => {
                    const activeTabInfo = tabs.find(t => t.id === activeTab);
                    const Icon = activeTabInfo?.icon || Layout;
                    return <Icon style={{ width: '48px', height: '48px', color: '#cbd5e1' }} />;
                  })()}
                </div>
                <h3 style={{ fontSize: '16px', fontWeight: 600, color: '#334155', marginBottom: '8px' }}>
                  {tabs.find(t => t.id === activeTab)?.label}
                </h3>
                <p style={{ fontSize: '14px' }}>This section is currently under development.</p>
             </div>
          )}

        </div>

      </div>
    </div>
  );
};

export default CustomerEdit;

