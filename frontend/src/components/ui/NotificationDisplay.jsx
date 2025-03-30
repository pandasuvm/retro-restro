// components/ui/NotificationDisplay.jsx
import { useNotification } from '../../context/NotificationContext';

const NotificationDisplay = () => {
  const { notifications, removeNotification } = useNotification();
  
  if (notifications.length === 0) return null;
  
  return (
    <div className="fixed top-4 right-4 z-50 w-80">
      <div className="space-y-2">
        {notifications.map(notification => (
          <div 
            key={notification.id} 
            className={`p-4 rounded-md shadow-md relative ${
              notification.type === 'success' ? 'bg-green-500' : 
              notification.type === 'error' ? 'bg-red-500' : 
              'bg-blue-500'
            } text-white`}
          >
            <button 
              className="absolute top-2 right-2 text-white hover:text-gray-200"
              onClick={() => removeNotification(notification.id)}
            >
              ×
            </button>
            <p>{notification.message}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NotificationDisplay;
