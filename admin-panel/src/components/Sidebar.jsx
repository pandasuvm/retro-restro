import { Link, useLocation } from 'react-router-dom';
import '../styles/RetroSidebar.css';

const RetroSidebar = ({ sidebarOpen, setSidebarOpen }) => {
  const location = useLocation();
  
  const navigation = [
    { name: 'DASHBOARD', href: '/', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
    { name: 'MENU ITEMS', href: '/menu', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01' },
    { name: 'ORDERS', href: '/orders', icon: 'M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z' },
    { name: 'TABLES', href: '/tables', icon: 'M4 6h16M4 10h16M4 14h16M4 18h16' },
  ];
  
  return (
    <>
      <div 
        className={`retro-overlay ${sidebarOpen ? 'active' : ''}`} 
        onClick={() => setSidebarOpen(false)}
      ></div>
      
      <div className={`retro-sidebar ${sidebarOpen ? 'active' : ''}`}>
        <div className="retro-scanlines"></div>
        
        <div className="retro-sidebar-header">
          <div className="retro-logo">
            <span className="retro-logo-text">SPACE DINER</span>
          </div>
        </div>
        
        <div className="retro-sidebar-date">
          {new Date().toLocaleDateString('en-US', { 
            month: 'short', 
            day: 'numeric', 
            year: 'numeric' 
          })}
        </div>
        
        <nav className="retro-nav">
          {navigation.map((item) => (
            <Link
              key={item.name}
              to={item.href}
              className={`retro-nav-item ${
                location.pathname === item.href ? 'active' : ''
              }`}
            >
              <div className="retro-nav-icon">
                <svg className="retro-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={item.icon}></path>
                </svg>
              </div>
              <span className="retro-nav-text">{item.name}</span>
            </Link>
          ))}
        </nav>
        
        <div className="retro-sidebar-footer">
          <div className="retro-version">v1.0.25</div>
        </div>
      </div>
    </>
  );
};

export default RetroSidebar;
