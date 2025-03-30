// components/ui/NotificationDisplay.jsx
import { useNotification } from '../../context/NotificationContext';
import { useEffect, useState, useRef } from 'react';
import '../../styles/RetroNotification.css';
import notificationSound from '../../assets/retro-noti.mp3'; // If using import approach

const NotificationDisplay = () => {
  const { notifications, removeNotification } = useNotification();
  const [audioEnabled] = useState(true);
  const audioRef = useRef(new Audio('/sounds/retro-noti.mp3')); // If using public folder approach
  // const audioRef = useRef(new Audio(notificationSound)); // If using import approach
  
  // Play sound when notifications array changes length (new notification added)
  useEffect(() => {
    const playNotificationSound = () => {
      if (notifications.length > 0 && audioEnabled) {
        try {
          // Reset the audio to the beginning
          audioRef.current.currentTime = 0;
          audioRef.current.volume = 0.3;
          
          // Play the sound
          const playPromise = audioRef.current.play();
          
          // Handle potential play() promise rejection (happens in some browsers)
          if (playPromise !== undefined) {
            playPromise.catch(error => {
              console.log('Audio play prevented:', error);
            });
          }
        } catch (error) {
          console.error('Error playing notification sound:', error);
        }
      }
    };
    
    playNotificationSound();
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
