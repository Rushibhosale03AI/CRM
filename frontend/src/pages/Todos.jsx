import React, { useState, useEffect } from 'react';
import DataTable from '../components/DataTable';
import apiClient from '../api/apiClient';
import PageSearchBar from '../components/PageSearchBar';

const Todos = () => {
  const [todos, setTodos] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get('todos/');
      setTodos(response.data);
    } catch (error) {
      console.error("Error fetching todos:", error);
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    { header: 'Title', accessor: 'title' },
    { header: 'To-dos owner', accessor: 'owner' },
    { header: 'Assign To', accessor: 'assigned_to' },
    { header: 'Due Date', accessor: 'due_date', render: (row) => new Date(row.due_date).toLocaleString() },
    { header: 'Reminder', accessor: 'reminder_time', render: (row) => row.reminder_time ? new Date(row.reminder_time).toLocaleString() : '-' },
    { 
      header: 'Priority', 
      accessor: 'priority',
      render: (row) => {
        let color = '#ef4444'; // High (Red)
        let bg = '#fef2f2';
        if (row.priority === 'Medium') {
          color = '#f59e0b'; // Orange
          bg = '#fffbeb';
        } else if (row.priority === 'Low') {
          color = '#10b981'; // Green
          bg = '#ecfdf5';
        }
        return (
          <span style={{ 
            color: color, 
            backgroundColor: bg,
            padding: '4px 8px', 
            borderRadius: '4px', 
            fontWeight: 600, 
            fontSize: '12px' 
          }}>
            {row.priority}
          </span>
        );
      }
    },
    { header: 'Status', accessor: 'status' }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', maxWidth: '100%', margin: '0 auto' }}>
      
      <div style={{ marginBottom: '-8px' }}>
        <PageSearchBar placeholder="Search to-dos..." />
      </div>

      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        fontSize: '14px',
        color: '#64748b',
        backgroundColor: '#ffffff',
        padding: '12px 20px',
        borderRadius: '12px',
        border: '1px solid #e2e8f0',
        boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)'
      }}>
        <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', color: '#334155', fontWeight: 500 }}>
          <input 
            type="checkbox" 
            onChange={(e) => setSelectedIds(e.target.checked ? todos.map(t => t.id) : [])}
            checked={selectedIds.length === todos.length && todos.length > 0}
            style={{ borderRadius: '4px', width: '16px', height: '16px', border: '1px solid #cbd5e1', accentColor: '#0d9488' }} 
          />
          <span>Select all {todos.length} rows</span>
        </label>
        <span style={{ fontWeight: 'bold', color: '#1e293b', marginLeft: '12px' }}>Total Count : {todos.length} records</span>
      </div>

      <div style={{ overflowX: 'auto' }}>
        <DataTable columns={columns} data={todos} selectedIds={selectedIds} onSelectAll={(e) => setSelectedIds(e.target.checked ? todos.map(t => t.id) : [])} />
      </div>
    </div>
  );
};

export default Todos;
