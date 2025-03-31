import { useState } from 'react';
import '../styles/RetroHeader.css';

const Header = ({ sidebarOpen, setSidebarOpen }) => {
  const [notifications, setNotifications] = useState([
    { id: 1, message: 'New order received', time: '2 minutes ago' },
    { id: 2, message: 'Order #1234 is ready', time: '5 minutes ago' },
  ]);
  const [showNotifications, setShowNotifications] = useState(false);
  
  return (
    <header className="retro-header">
      <div className="retro-scanlines"></div>
      <div className="retro-flicker"></div>
      
      <div className="retro-header-content">
        <div className="retro-header-left">
          <button 
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="retro-menu-toggle"
            aria-label="Toggle menu"
          >
            <span className="retro-menu-icon">≡</span>
          </button>
          <h1 className="retro-title">Welcome</h1>
        </div>
        
        <div className="retro-header-right">
          <div className="retro-notification-container hide-on-mobile">
            <button 
              onClick={() => setShowNotifications(!showNotifications)}
              className="retro-notification-button"
            >
              <span className="retro-icon">!</span>
              {notifications.length > 0 && (
                <span className="retro-notification-badge">{notifications.length}</span>
              )}
            </button>
            
            {showNotifications && (
              <div className="retro-notification-panel">
                <div className="retro-notification-header">
                  INCOMING TRANSMISSIONS
                </div>
                {notifications.length > 0 ? (
                  notifications.map(notification => (
                    <div key={notification.id} className="retro-notification-item">
                      <p className="retro-notification-message">{notification.message}</p>
                      <p className="retro-notification-time">{notification.time}</p>
                    </div>
                  ))
                ) : (
                  <div className="retro-notification-empty">NO NEW MESSAGES</div>
                )}
                <div className="retro-notification-action">
                  CLEAR ALL
                </div>
              </div>
            )}
          </div>
          
          <div className="retro-user">
            <div className="retro-user-avatar">
              A
            </div>
            <span className="retro-user-name hide-on-mobile">ADMIN</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
