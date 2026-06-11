import React, { useState, useEffect } from 'react';
import { Search } from 'lucide-react';

const DataTable = ({ columns, data, onSelectAll, selectedIds }) => {
  const [hoveredRow, setHoveredRow] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;

  useEffect(() => {
    setCurrentPage(1);
  }, [data]);

  const totalPages = Math.ceil(data.length / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const currentData = data.slice(startIndex, startIndex + rowsPerPage);

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage(p => p + 1);
  };
  
  const handlePrev = () => {
    if (currentPage > 1) setCurrentPage(p => p - 1);
  };

  const getPageNumbers = () => {
    let pages = [];
    for (let i = 1; i <= totalPages; i++) {
      if (i === 1 || i === totalPages || (i >= currentPage - 1 && i <= currentPage + 1)) {
        pages.push(i);
      } else if (i === currentPage - 2 || i === currentPage + 2) {
        pages.push('...');
      }
    }
    return pages.filter((p, index) => p !== '...' || pages[index - 1] !== '...');
  };

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
          </thead>
          <tbody style={{ color: '#475569' }}>
            {currentData.map((row, rowIdx) => {
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
                      {col.render ? col.render(row, startIndex + rowIdx) : <span style={{ fontWeight: 500, color: '#334155' }}>{row[col.accessor]}</span>}
                    </td>
                  ))}
                </tr>
              )
            })}
            {data.length === 0 && (
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
      
      {data.length > 0 && (
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
          <div>
            Showing <span style={{ color: '#1e293b' }}>{Math.min(startIndex + 1, data.length)}</span> to <span style={{ color: '#1e293b' }}>{Math.min(startIndex + rowsPerPage, data.length)}</span> of <span style={{ color: '#1e293b' }}>{data.length}</span> records
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <button 
              onClick={handlePrev}
              disabled={currentPage === 1}
              style={{ 
                background: 'none', 
                border: 'none', 
                color: currentPage === 1 ? '#cbd5e1' : '#64748b', 
                cursor: currentPage === 1 ? 'not-allowed' : 'pointer' 
              }}
            >
              Previous
            </button>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              {getPageNumbers().map((page, idx) => (
                page === '...' ? (
                  <span key={`dots-${idx}`} style={{ padding: '0 4px', color: '#94a3b8' }}>...</span>
                ) : (
                  <span 
                    key={idx}
                    onClick={() => setCurrentPage(page)}
                    style={{ 
                      width: '24px', 
                      height: '24px', 
                      borderRadius: '4px', 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center', 
                      backgroundColor: currentPage === page ? '#0d9488' : 'transparent', 
                      color: currentPage === page ? '#ffffff' : '#475569', 
                      fontWeight: currentPage === page ? 600 : 400,
                      cursor: 'pointer' 
                    }}
                  >
                    {page}
                  </span>
                )
              ))}
            </div>

            <button 
              onClick={handleNext}
              disabled={currentPage === totalPages}
              style={{ 
                background: 'none', 
                border: 'none', 
                color: currentPage === totalPages ? '#cbd5e1' : '#64748b', 
                cursor: currentPage === totalPages ? 'not-allowed' : 'pointer' 
              }}
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DataTable;
