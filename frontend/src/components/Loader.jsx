import React from 'react';
import { TrendingUp } from 'lucide-react';

const Loader = ({ message = "Loading data..." }) => {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '40px',
      height: '100%',
      minHeight: '200px'
    }}>
      <div style={{ position: 'relative', width: '64px', height: '64px', marginBottom: '16px' }}>
        {/* Animated Bar Chart */}
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', height: '100%', width: '100%', padding: '8px' }}>
          <div className="loader-bar" style={{ width: '12px', backgroundColor: '#3b82f6', borderRadius: '4px', animation: 'barGrow 1s ease-in-out infinite' }}></div>
          <div className="loader-bar" style={{ width: '12px', backgroundColor: '#2563eb', borderRadius: '4px', animation: 'barGrow 1s ease-in-out 0.2s infinite' }}></div>
          <div className="loader-bar" style={{ width: '12px', backgroundColor: '#0f172a', borderRadius: '4px', animation: 'barGrow 1s ease-in-out 0.4s infinite' }}></div>
        </div>
        <TrendingUp 
          style={{ 
            position: 'absolute', 
            top: '-8px', 
            right: '-12px', 
            color: '#10b981', 
            width: '28px', 
            height: '28px',
            animation: 'pulse 2s infinite',
            filter: 'drop-shadow(0 2px 4px rgba(16, 185, 129, 0.4))'
          }} 
        />
      </div>
      <style>
        {`
          @keyframes barGrow {
            0%, 100% { height: 30%; }
            50% { height: 100%; }
          }
          @keyframes pulse {
            0% { transform: scale(1); opacity: 0.8; }
            50% { transform: scale(1.1); opacity: 1; }
            100% { transform: scale(1); opacity: 0.8; }
          }
        `}
      </style>
      <div style={{ color: '#475569', fontSize: '15px', fontWeight: '500', animation: 'pulse 2s infinite' }}>
        {message}
      </div>
    </div>
  );
};

export default Loader;
