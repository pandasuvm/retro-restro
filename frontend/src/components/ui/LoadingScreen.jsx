// components/ui/LoadingScreen.jsx
import React from 'react';

const LoadingScreen = () => {
  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center z-50" style={{
      background: 'linear-gradient(to right, #800080, #008080)',
      fontFamily: "'VT323', 'Press Start 2P', monospace"
    }}>
      <div className="text-6xl font-bold mb-8" style={{
        color: '#ffff00',
        textShadow: '4px 4px 0 #ff00ff, -4px -4px 0 #00ffff',
        animation: 'textGlow 2s infinite alternate'
      }}>
        Retro Diner
      </div>
      
      <div className="w-64 h-8 bg-black border-4 border-white rounded-sm overflow-hidden relative" style={{
        boxShadow: '0 0 10px #00ffff, 0 0 20px #ff00ff'
      }}>
        <div 
          className="h-full bg-gradient-to-r from-cyan-400 to-purple-500 relative"
          style={{ 
            width: '75%',
            animation: 'loadingBar 3s infinite alternate'
          }}
        >
          <div className="absolute inset-0" style={{
            background: 'repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(0,0,0,0.2) 10px, rgba(0,0,0,0.2) 20px)'
          }}></div>
        </div>
      </div>
      
      <div className="mt-6 text-2xl font-bold" style={{
        color: '#ffffff',
        textShadow: '2px 2px 0 #000000',
        animation: 'blink 1s infinite'
      }}>
        NOW LOADING...
      </div>

      <style jsx>{`
        @keyframes textGlow {
          0% { text-shadow: 4px 4px 0 #ff00ff, -4px -4px 0 #00ffff; }
          100% { text-shadow: 4px 4px 0 #00ffff, -4px -4px 0 #ff00ff, 0 0 20px #ffffff; }
        }
        
        @keyframes loadingBar {
          0% { width: 10%; }
          50% { width: 75%; }
          100% { width: 95%; }
        }
        
        @keyframes blink {
          0%, 49% { opacity: 1; }
          50%, 100% { opacity: 0; }
        }
      `}</style>
    </div>
  );
};

export default LoadingScreen;
