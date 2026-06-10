import React, { useState, useRef, useEffect } from 'react';
import { Search, ChevronDown } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';

const PageSearchBar = ({ placeholder = "Search...", searchOptions = [] }) => {
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const dropdownRef = useRef(null);
  
  const searchQuery = searchParams.get('q') || '';
  const searchField = searchParams.get('field') || 'all';

  const handleSearchChange = (e) => {
    const val = e.target.value;
    const newParams = new URLSearchParams(searchParams);
    if (val) {
      newParams.set('q', val);
    } else {
      newParams.delete('q');
    }
    setSearchParams(newParams);
  };

  const handleFieldChange = (val) => {
    const newParams = new URLSearchParams(searchParams);
    if (val && val !== 'all') {
      newParams.set('field', val);
    } else {
      newParams.delete('field');
    }
    setSearchParams(newParams);
    setIsDropdownOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selectedOptionLabel = searchField === 'all' 
    ? 'All Columns' 
    : searchOptions.find(o => o.value === searchField)?.label || 'All Columns';

  const dynamicPlaceholder = searchOptions.length > 0 && searchField !== 'all'
    ? `Search in ${selectedOptionLabel}...`
    : placeholder;

  return (
    <div 
      style={{ 
        position: 'relative', 
        width: '100%', 
        maxWidth: '650px', 
        display: 'flex', 
        alignItems: 'center',
        backgroundColor: isSearchFocused ? '#ffffff' : '#f8fafc',
        border: `1px solid ${isSearchFocused ? '#14b8a6' : '#e2e8f0'}`,
        borderRadius: '8px',
        boxShadow: isSearchFocused ? '0 0 0 2px rgba(20, 184, 166, 0.1)' : 'inset 0 1px 2px rgba(0, 0, 0, 0.05)',
        transition: 'all 0.2s',
      }}
    >
      <div style={{ paddingLeft: '14px', display: 'flex', alignItems: 'center' }}>
        <Search style={{
          width: '16px',
          height: '16px',
          color: isSearchFocused ? '#14b8a6' : '#94a3b8',
          transition: 'color 0.2s'
        }} />
      </div>
      
      <input
        type="text"
        value={searchQuery}
        onChange={handleSearchChange}
        placeholder={dynamicPlaceholder}
        onFocus={() => setIsSearchFocused(true)}
        onBlur={() => setIsSearchFocused(false)}
        style={{
          flex: 1,
          padding: '8px 12px 8px 10px',
          backgroundColor: 'transparent',
          border: 'none',
          fontSize: '14px',
          fontFamily: 'inherit',
          outline: 'none',
          color: '#334155',
          width: '100%'
        }}
      />
      
      {searchOptions.length > 0 && (
        <div ref={dropdownRef} style={{ position: 'relative', display: 'flex', alignItems: 'center', height: '100%' }}>
          <div style={{ width: '1px', height: '20px', backgroundColor: '#e2e8f0' }} />
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            style={{
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              padding: '0 14px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              color: searchField !== 'all' ? '#0f766e' : '#475569',
              fontSize: '14px',
              fontFamily: 'inherit',
              fontWeight: 500,
              height: '100%',
              minHeight: '36px',
            }}
          >
            <span style={{ whiteSpace: 'nowrap' }}>{selectedOptionLabel}</span>
            <ChevronDown style={{ width: '14px', height: '14px' }} />
          </button>

          {isDropdownOpen && (
            <div style={{
              position: 'absolute',
              top: 'calc(100% + 4px)',
              right: 0,
              backgroundColor: '#ffffff',
              border: '1px solid #e2e8f0',
              borderRadius: '8px',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
              width: '180px',
              padding: '4px',
              zIndex: 50
            }}>
              <div 
                onClick={() => handleFieldChange('all')}
                style={{
                  padding: '8px 12px',
                  fontSize: '14px',
                  fontFamily: 'inherit',
                  cursor: 'pointer',
                  borderRadius: '4px',
                  backgroundColor: searchField === 'all' ? '#f0fdfa' : 'transparent',
                  color: searchField === 'all' ? '#0f766e' : '#334155',
                  fontWeight: searchField === 'all' ? 600 : 400,
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = searchField === 'all' ? '#f0fdfa' : '#f8fafc'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = searchField === 'all' ? '#f0fdfa' : 'transparent'}
              >
                All Columns
              </div>
              {searchOptions.map((opt, idx) => (
                <div 
                  key={idx}
                  onClick={() => handleFieldChange(opt.value)}
                  style={{
                    padding: '8px 12px',
                    fontSize: '14px',
                    fontFamily: 'inherit',
                    cursor: 'pointer',
                    borderRadius: '4px',
                    backgroundColor: searchField === opt.value ? '#f0fdfa' : 'transparent',
                    color: searchField === opt.value ? '#0f766e' : '#334155',
                    fontWeight: searchField === opt.value ? 600 : 400,
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = searchField === opt.value ? '#f0fdfa' : '#f8fafc'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = searchField === opt.value ? '#f0fdfa' : 'transparent'}
                >
                  {opt.label}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default PageSearchBar;
