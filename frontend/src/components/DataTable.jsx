import React, { useState } from 'react';
import { Search } from 'lucide-react';

const DataTable = ({ columns, data, onSelectAll, selectedIds }) => {
  const [hoveredRow, setHoveredRow] = useState(null);
  const [focusedSearch, setFocusedSearch] = useState(null);
  const [searchQueries, setSearchQueries] = useState({});

  const handleSearchChange = (accessor, value) => {
    if (!accessor) return;
    setSearchQueries(prev => ({
      ...prev,
      [accessor]: value
    }));
  };

  const filteredData = data.filter(row => {
    return Object.keys(searchQueries).every(accessor => {
      const query = searchQueries[accessor];
      if (!query) return true;
      const rowValue = row[accessor] ? String(row[accessor]).toLowerCase() : '';
      return rowValue.includes(query.toLowerCase());
    });
  });

  return (
    <div style={{
      backgroundColor: '#ffffff',
      border: '1px solid #e2e8f0',
      borderRadius: '12px',
      overflow: 'hidden',
      boxShadow: '0 4px 20px -2px rgba(0, 0, 0, 0.05)'
    }}>
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', textAlign: 'left', fontSize: '14px', whiteSpace: 'nowrap', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ backgroundColor: 'rgba(248, 250, 252, 0.8)', color: '#475569', borderBottom: '1px solid #e2e8f0', fontSize: '13px' }}>

              {columns.map((col, idx) => (
                <th key={idx} style={{ padding: '14px 20px', fontWeight: 600, letterSpacing: '0.025em' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer' }}>
                    {col.header}
                    <svg style={{ width: '16px', height: '16px', color: '#94a3b8' }} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 9l4-4 4 4m0 6l-4 4-4-4"></path></svg>
                  </div>
                </th>
              ))}
            </tr>
            {/* Filter Row */}
            <tr style={{ borderBottom: '1px solid #f1f5f9', backgroundColor: 'rgba(248, 250, 252, 0.3)' }}>

              {columns.map((col, idx) => (
                <th key={idx} style={{ padding: '8px 12px', borderRight: '1px solid rgba(241, 245, 249, 0.5)', fontWeight: 'normal' }}>
                  {col.accessor && (
                    <div style={{ position: 'relative' }}>
                      <Search style={{ 
                        width: '14px', 
                        height: '14px', 
                        color: focusedSearch === idx ? '#14b8a6' : '#94a3b8', 
                        position: 'absolute', 
                        left: '10px', 
                        top: '50%', 
                        transform: 'translateY(-50%)',
                        transition: 'color 0.2s'
                      }} />
                      <input 
                        type="text" 
                        placeholder={`Filter ${col.header}...`}
                        value={searchQueries[col.accessor] || ''}
                        onChange={(e) => handleSearchChange(col.accessor, e.target.value)}
                        onFocus={() => setFocusedSearch(idx)}
                        onBlur={() => setFocusedSearch(null)}
                        style={{
                          width: '100%',
                          backgroundColor: '#ffffff',
                          border: focusedSearch === idx ? '1px solid #14b8a6' : '1px solid #e2e8f0',
                          borderRadius: '6px',
                          fontSize: '12px',
                          padding: '6px 12px 6px 32px',
                          color: '#475569',
                          outline: 'none',
                          boxShadow: focusedSearch === idx ? '0 0 0 2px rgba(20, 184, 166, 0.2)' : '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
                          transition: 'all 0.2s',
                          boxSizing: 'border-box'
                        }} 
                      />
                    </div>
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody style={{ color: '#475569' }}>
            {filteredData.map((row, rowIdx) => {
              const isSelected = selectedIds?.includes(row.id);
              return (
                <tr 
                  key={row.id || rowIdx} 
                  onMouseEnter={() => setHoveredRow(row.id || rowIdx)}
                  onMouseLeave={() => setHoveredRow(null)}
                  style={{
                    backgroundColor: isSelected ? 'rgba(240, 253, 250, 0.6)' : (hoveredRow === (row.id || rowIdx) ? 'rgba(240, 253, 250, 0.4)' : '#ffffff'),
                    transition: 'background-color 0.15s ease',
                    borderBottom: '1px solid #f1f5f9'
                  }}
                >

                  {columns.map((col, colIdx) => (
                    <td key={colIdx} style={{ padding: '12px 20px' }}>
                      {col.render ? col.render(row) : <span style={{ fontWeight: 500, color: '#334155' }}>{row[col.accessor]}</span>}
                    </td>
                  ))}
                </tr>
              )
            })}
            {filteredData.length === 0 && (
              <tr>
                <td colSpan={columns.length + 1} style={{ padding: '48px 20px', textAlign: 'center', color: '#64748b' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                    <Search style={{ width: '32px', height: '32px', color: '#cbd5e1', marginBottom: '8px' }} />
                    <p style={{ fontSize: '14px', fontWeight: 500, margin: 0 }}>No records found</p>
                    <p style={{ fontSize: '12px', color: '#94a3b8', margin: 0 }}>Try adjusting your filters</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <div style={{
        padding: '14px 24px',
        borderTop: '1px solid #e2e8f0',
        backgroundColor: 'rgba(248, 250, 252, 0.8)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        fontSize: '12px',
        color: '#64748b',
        fontWeight: 500
      }}>
        <div>Showing <span style={{ color: '#1e293b' }}>{filteredData.length}</span> records</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <button style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer' }}>Previous</button>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <span style={{ width: '24px', height: '24px', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#0d9488', color: '#ffffff', fontWeight: 600 }}>1</span>
            <span style={{ width: '24px', height: '24px', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>2</span>
            <span style={{ width: '24px', height: '24px', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>3</span>
          </div>
          <button style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer' }}>Next</button>
        </div>
      </div>
    </div>
  );
};

export default DataTable;
