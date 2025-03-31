import { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/RetroDashboard.css';

const Dashboard = ({ apiUrl, socket }) => {
  const [stats, setStats] = useState({
    totalOrders: 0,
    revenue: 0,
    pendingOrders: 0,
  });
  const [popularItems, setPopularItems] = useState([]);
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        
        const ordersResponse = await axios.get(`${apiUrl}/orders`);
        const orders = ordersResponse.data;
        
        const totalOrders = orders.length;
        const revenue = orders.reduce((sum, order) => sum + (order.totalAmount || 0), 0);
        const pendingOrders = orders.filter(order => order.status === 'Pending').length;
        
        setStats({
          totalOrders,
          revenue,
          pendingOrders,
        });
        
        const recentOrdersData = orders
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          .slice(0, 5)
          .map(order => ({
            id: order._id || 'N/A',
            tableNumber: order.tableNumber || 'N/A',
            status: order.status || 'Unknown',
            totalAmount: order.totalAmount || 0,
            createdAt: order.createdAt ? new Date(order.createdAt).toLocaleString() : 'N/A',
          }));
        
        setRecentOrders(recentOrdersData);
        
        const itemCounts = {};
        orders.forEach(order => {
          if (Array.isArray(order.items)) {
            order.items.forEach(item => {
              const menuItem = item.menuItem || {};
              const itemId = menuItem._id || 'unknown';
              const itemName = menuItem.name || 'Unknown Item';
              if (!itemCounts[itemId]) {
                itemCounts[itemId] = { name: itemName, count: 0 };
              }
              itemCounts[itemId].count += item.quantity || 1;
            });
          }
        });
        
        const popularItemsData = Object.values(itemCounts)
          .sort((a, b) => b.count - a.count)
          .slice(0, 5);
        
        setPopularItems(popularItemsData);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError('Failed to load dashboard data');
        setLoading(false);
      }
    };
    
    fetchDashboardData();
    socket.on('new_order', fetchDashboardData);
    socket.on('status_update', fetchDashboardData);
    
    return () => {
      socket.off('new_order', fetchDashboardData);
      socket.off('status_update', fetchDashboardData);
    };
  }, [apiUrl, socket]);

  if (loading) return (
    <div className="retro-dashboard-container">
      <div className="retro-loading">
        <div className="retro-loading-text">LOADING DATA...</div>
        <div className="retro-loading-bar"></div>
      </div>
    </div>
  );
  
  if (error) return (
    <div className="retro-dashboard-container">
      <div className="retro-error">
        <div className="retro-error-title">SYSTEM ERROR</div>
        <div className="retro-error-message">{error}</div>
      </div>
    </div>
  );
  
  return (
    <div className="retro-dashboard-container">
      <div className="retro-scanlines"></div>
      <div className="retro-flicker"></div>
      
      <div className="retro-dashboard-header">
        <h1 className="retro-title">COSMIC CONTROL CENTER</h1>
        <div className="retro-date">{new Date().toLocaleDateString('en-US', { 
          weekday: 'long', 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric' 
        })}</div>
      </div>
      
      <div className="retro-stats-grid">
        <div className="retro-stat-card">
          <div className="retro-stat-icon total-orders-icon"></div>
          <div className="retro-stat-content">
            <div className="retro-stat-label">TOTAL ORDERS</div>
            <div className="retro-stat-value">{stats.totalOrders}</div>
          </div>
        </div>
        
        <div className="retro-stat-card">
          <div className="retro-stat-icon revenue-icon"></div>
          <div className="retro-stat-content">
            <div className="retro-stat-label">REVENUE</div>
            <div className="retro-stat-value">${stats.revenue.toFixed(2)}</div>
          </div>
        </div>
        
        <div className="retro-stat-card">
          <div className="retro-stat-icon pending-icon"></div>
          <div className="retro-stat-content">
            <div className="retro-stat-label">PENDING ORDERS</div>
            <div className="retro-stat-value">{stats.pendingOrders}</div>
          </div>
        </div>
      </div>
      
      <div className="retro-dashboard-grid">
        <div className="retro-orders-panel">
          <div className="retro-panel-header">
            <h2 className="retro-panel-title">RECENT ORDERS</h2>
          </div>
          <div className="retro-table-container">
            <table className="retro-table">
              <thead>
                <tr>
                  <th>ORDER ID</th>
                  <th>TABLE</th>
                  <th>STATUS</th>
                  <th>AMOUNT</th>
                  <th>DATE</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order) => (
                  <tr key={order.id}>
                    <td>{order.id.substring(0, 8)}</td>
                    <td>TABLE {order.tableNumber}</td>
                    <td>
                      <span className={`retro-status retro-status-${order.status.toLowerCase()}`}>
                        {order.status}
                      </span>
                    </td>
                    <td>${order.totalAmount.toFixed(2)}</td>
                    <td>{order.createdAt}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        
        <div className="retro-popular-panel">
          <div className="retro-panel-header">
            <h2 className="retro-panel-title">POPULAR ITEMS</h2>
          </div>
          <ul className="retro-popular-list">
            {popularItems.map((item, index) => (
              <li key={index} className="retro-popular-item">
                <div className="retro-popular-rank">{index + 1}</div>
                <div className="retro-popular-name">{item.name}</div>
                <div className="retro-popular-count">{item.count} ORDERS</div>
              </li>
            ))}
          </ul>
        </div>
      </div>
      
      <div className="retro-dashboard-footer">
        <div className="retro-footer-text">SPACE DINER MANAGEMENT SYSTEM v1.0</div>
      </div>
    </div>
  );
};

export default Dashboard;
