import React from 'react';

const Loader = ({ message = "Loading data..." }) => {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100%',
      minHeight: '100px',
      overflow: 'hidden',
      backgroundColor: 'transparent',
      padding: '20px'
    }}>
      
      <div className="book-loader" style={{ transform: 'scale(0.5)', marginBottom: '-35px', marginTop: '-35px' }}>
        <div className="bookshelf">
          <div className="shelf-line"></div>
          <div className="shelf-dotted"></div>
          
          <div className="book book-1"></div>
          <div className="book book-2"></div>
          <div className="book book-3"></div>
          <div className="book book-4"></div>
          <div className="book book-5"></div>
          <div className="book book-6"></div>
          
          <div className="bookend"></div>
        </div>
      </div>

      <style>
        {`
          .book-loader {
            background-color: transparent;
            padding: 50px 60px 40px 60px;
            display: flex;
            align-items: center;
            justify-content: center;
          }

          .bookshelf {
            position: relative;
            width: 160px;
            height: 60px;
          }

          .shelf-line {
            position: absolute;
            bottom: -3px;
            left: -35px;
            width: 195px;
            height: 3px;
            background-color: #2563eb;
            border-radius: 2px;
          }

          .shelf-dotted {
            position: absolute;
            bottom: -10px;
            left: -25px;
            width: 175px;
            border-bottom: 3px dotted rgba(37, 99, 235, 0.5);
          }

          .bookend {
            position: absolute;
            bottom: 0;
            left: 140px;
            width: 14px;
            height: 44px;
            border: 2px solid #2563eb;
            border-radius: 2px;
            background-color: #ffffff;
            z-index: 10;
            box-sizing: border-box;
          }

          .bookend::before, .bookend::after {
            content: '';
            position: absolute;
            left: 50%;
            transform: translateX(-50%);
            width: 4px;
            height: 4px;
            border-radius: 50%;
            background: #2563eb;
          }

          .bookend::before { top: 4px; }
          .bookend::after { bottom: 4px; }

          .book {
            position: absolute;
            bottom: 0;
            left: 0;
            width: 14px;
            height: 54px;
            border: 2px solid #2563eb;
            border-radius: 2px;
            background-color: #ffffff;
            transform-origin: bottom left;
            animation: bookLoop 3s linear infinite;
            box-sizing: border-box;
          }

          .book::before, .book::after {
            content: '';
            position: absolute;
            left: 0;
            width: 100%;
            height: 2px;
            background: #2563eb;
          }

          .book::before { top: 8px; }
          .book::after { bottom: 8px; }

          .book-1 { animation-delay: -2.5s; z-index: 1; }
          .book-2 { animation-delay: -2.0s; z-index: 2; }
          .book-3 { animation-delay: -1.5s; z-index: 3; }
          .book-4 { animation-delay: -1.0s; z-index: 4; }
          .book-5 { animation-delay: -0.5s; z-index: 5; }
          .book-6 { animation-delay: 0s; z-index: 6; }

          @keyframes bookLoop {
            0% { transform: translateX(125px) rotate(0deg); opacity: 0; }
            5% { transform: translateX(125px) rotate(0deg); opacity: 1; }
            16.66% { transform: translateX(100px) rotate(0deg); opacity: 1; }
            33.33% { transform: translateX(75px) rotate(-22deg); opacity: 1; }
            50% { transform: translateX(50px) rotate(-45deg); opacity: 1; }
            66.66% { transform: translateX(25px) rotate(-68deg); opacity: 1; }
            83.33% { transform: translateX(0px) rotate(-90deg); opacity: 1; }
            95% { transform: translateX(-25px) rotate(-90deg); opacity: 1; }
            100% { transform: translateX(-25px) rotate(-90deg); opacity: 0; }
          }

          @keyframes pulseText {
            0% { opacity: 0.6; }
            50% { opacity: 1; }
            100% { opacity: 0.6; }
          }
        `}
      </style>
      
      <div style={{ color: '#475569', fontSize: '15px', fontWeight: '600', letterSpacing: '3px', textTransform: 'uppercase', animation: 'pulseText 2s ease-in-out infinite' }}>
        {message}
      </div>
    </div>
  );
};

export default Loader;
