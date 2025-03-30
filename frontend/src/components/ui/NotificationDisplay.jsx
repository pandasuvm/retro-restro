// components/ui/NotificationDisplay.jsx
import { useNotification } from '../../context/NotificationContext';
import { useEffect, useState } from 'react';
import '../../styles/RetroNotification.css';


// Then in your component:
{/* <audio src={audioFile} controls /> */}


const NotificationDisplay = () => {
  const { notifications, removeNotification } = useNotification();
  const [audioEnabled] = useState(true);
  
  useEffect(() => {
    // Play notification sound when a new notification appears
    if (notifications.length > 0 && audioEnabled) {
      try {
        audioRef.current.volume = 0.3;
        audioRef.current.play().catch(e => console.log('Audio play prevented:', e));
      } catch (error) {
        console.error('Error playing notification sound:', error);
      }
    }
  }, [notifications.length, audioEnabled]);
  
  if (notifications.length === 0) return null;
  
  const getNotificationClass = (type) => {
    switch (type) {
      case 'success': return 'retro-notification-success';
      case 'error': return 'retro-notification-error';
      case 'warning': return 'retro-notification-warning';
      default: return 'retro-notification-info';
    }
  };
  
  const getNotificationIcon = (type) => {
    switch (type) {
      case 'success': return '✓';
      case 'error': return '✗';
      case 'warning': return '!';
      default: return 'i';
    }
  };
  
  return (
    <div className="retro-notification-container">
      <div className="retro-notification-list">
        {notifications.map(notification => (
          <div 
            key={notification.id} 
            className={`retro-notification ${getNotificationClass(notification.type)}`}
          >
            <div className="retro-notification-content">
              <div className="retro-notification-icon">
                {getNotificationIcon(notification.type)}
              </div>
              <div className="retro-notification-message">
                {notification.message}
                <div className="retro-notification-scanline"></div>
              </div>
            </div>
            <button 
              className="retro-notification-close"
              onClick={() => removeNotification(notification.id)}
              aria-label="Close notification"
            >
              ×
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NotificationDisplay;
