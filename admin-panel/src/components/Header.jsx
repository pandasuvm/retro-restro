import { useState } from 'react';

const Header = ({ sidebarOpen, setSidebarOpen }) => {
  const [notifications, setNotifications] = useState([
    { id: 1, message: 'New order received', time: '2 minutes ago' },
    { id: 2, message: 'Order #1234 is ready', time: '5 minutes ago' },
  ]);
  const [showNotifications, setShowNotifications] = useState(false);
  
  return (
    <header className="bg-white border-b border-gray-200 flex items-center justify-between px-6 py-3">
      <div className="flex items-center">
        <button 
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="text-gray-500 focus:outline-none lg:hidden"
        >
          <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M4 6H20M4 12H20M4 18H11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        <h1 className="text-xl font-semibold text-gray-800 ml-2 lg:ml-0">Restaurant Admin</h1>
      </div>
      
      <div className="flex items-center">
        <div className="relative">
          <button 
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 text-gray-600 hover:text-gray-900 focus:outline-none"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
            {notifications.length > 0 && (
              <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-red-500"></span>
            )}
          </button>
          
          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-white rounded-md shadow-lg overflow-hidden z-20">
              <div className="py-2">
                <div className="px-4 py-2 bg-gray-100 text-gray-800 font-semibold">
                  Notifications
                </div>
                {notifications.length > 0 ? (
                  notifications.map(notification => (
                    <div key={notification.id} className="px-4 py-3 border-b hover:bg-gray-100">
                      <p className="text-gray-800">{notification.message}</p>
                      <p className="text-xs text-gray-500">{notification.time}</p>
                    </div>
                  ))
                ) : (
                  <div className="px-4 py-3 text-gray-500">No new notifications</div>
                )}
                <div className="px-4 py-2 text-sm text-center text-blue-600 hover:text-blue-800 cursor-pointer">
                  Mark all as read
                </div>
              </div>
            </div>
          )}
        </div>
        
        <div className="ml-4 relative">
          <div className="flex items-center cursor-pointer">
            <div className="h-8 w-8 rounded-full bg-gray-300 flex items-center justify-center text-gray-700">
              A
            </div>
            <span className="ml-2 text-gray-700">Admin</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
