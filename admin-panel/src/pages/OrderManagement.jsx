import { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/RetroOrderManagement.css';

const OrderManagement = ({ apiUrl, socket }) => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statusFilter, setStatusFilter] = useState('all');
  const [tableFilter, setTableFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
const [ordersPerPage] = useState(5);
  
  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${apiUrl}/orders`);
      const ordersData = response.data;
      
      // Sort orders by creation date (newest first)
      ordersData.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      
      setOrders(ordersData);
      applyFilters(ordersData, statusFilter, tableFilter);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching orders:', err);
      setError('Failed to load orders');
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchOrders();
    
    // Listen for real-time updates
    socket.on('new_order', () => {
      fetchOrders();
    });
    
    socket.on('status_update', () => {
      fetchOrders();
    });
    
    return () => {
      socket.off('new_order');
      socket.off('status_update');
    };
  }, [apiUrl, socket]);
  
  // Apply filters to orders
  const applyFilters = (ordersData, status, table) => {
    let filtered = ordersData;
    
    if (status !== 'all') {
      filtered = filtered.filter(order => order.status === status);
    }
    
    if (table) {
      filtered = filtered.filter(order => order.tableNumber.toString() === table);
    }
    
    setFilteredOrders(filtered);
  };
  
  // Handle status filter change
  const handleStatusFilterChange = (e) => {
    const status = e.target.value;
    setStatusFilter(status);
    applyFilters(orders, status, tableFilter);
  };
  
  // Handle table filter change
  const handleTableFilterChange = (e) => {
    const table = e.target.value;
    setTableFilter(table);
    applyFilters(orders, statusFilter, table);
  };
  
  // Handle status update
  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      await axios.put(`${apiUrl}/orders/${orderId}/status`, { status: newStatus });
      fetchOrders();
    } catch (err) {
      console.error('Error updating order status:', err);
      setError('Failed to update order status');
    }
  };
  
  // Format date
  const formatDate = (dateString) => {
    const options = { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric', 
      hour: '2-digit', 
      minute: '2-digit' 
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  
  if (loading) return (
    <div className="retro-order-management-container">
      <div className="retro-loading">
        <div className="retro-loading-text">LOADING ORDERS...</div>
        <div className="retro-loading-bar"></div>
      </div>
    </div>
  );
  
  if (error) return (
    <div className="retro-order-management-container">
      <div className="retro-error">
        <div className="retro-error-title">SYSTEM ERROR</div>
        <div className="retro-error-message">{error}</div>
      </div>
    </div>
  );
  
  return (
    <div className="retro-order-management-container">
      <div className="retro-scanlines"></div>
      <div className="retro-flicker"></div>
      
      <div className="retro-order-management-header">
        <h1 className="retro-title">ORDER CONTROL TERMINAL</h1>
        <div className="retro-date">{new Date().toLocaleDateString('en-US', { 
          weekday: 'long', 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric' 
        })}</div>
      </div>
      
      <div className="retro-filter-panel">
        <div className="retro-filter-grid">
          <div className="retro-filter-group">
            <label className="retro-filter-label">STATUS FILTER:</label>
            <select
              value={statusFilter}
              onChange={handleStatusFilterChange}
              className="retro-filter-select"
            >
              <option value="all">ALL ORDERS</option>
              <option value="Pending">PENDING</option>
              <option value="Preparing">PREPARING</option>
              <option value="Ready">READY</option>
              <option value="Served">SERVED</option>
              <option value="Completed">COMPLETED</option>
            </select>
          </div>
          
          <div className="retro-filter-group">
            <label className="retro-filter-label">TABLE FILTER:</label>
            <input
              type="text"
              value={tableFilter}
              onChange={handleTableFilterChange}
              placeholder="ENTER TABLE #"
              className="retro-filter-input"
            />
          </div>
          
          <div className="retro-filter-actions">
            <button
              onClick={fetchOrders}
              className="retro-refresh-button"
            >
              <span className="retro-refresh-icon">↻</span>
              REFRESH DATA
            </button>
          </div>
        </div>
      </div>
      {filteredOrders.length === 0 ? (
  <div className="retro-no-orders">
    <div className="retro-no-orders-text">NO ORDERS FOUND MATCHING FILTERS</div>
  </div>
) : (
  <>
    <div className="retro-table-container">
      <table className="retro-table">
        <thead>
          <tr>
            <th>ORDER ID</th>
            <th>TABLE</th>
            <th>ITEMS</th>
            <th>TOTAL</th>
            <th>STATUS</th>
            <th>TIME</th>
            <th>ACTIONS</th>
          </tr>
        </thead>
        <tbody>
          {filteredOrders
            .slice((currentPage - 1) * ordersPerPage, currentPage * ordersPerPage)
            .map((order) => (
              <tr key={order._id}>
                <td>
                  <div className="retro-order-id">{order._id.substring(0, 8)}</div>
                </td>
                <td>
                  <div className="retro-table-number">TABLE {order.tableNumber}</div>
                </td>
                <td>
                  <div className="retro-items-list">
                    {order.items.map((item, index) => (
                      <div key={index} className="retro-item">
                        {item.quantity} x {(item.menuItem && item.menuItem.name) ? item.menuItem.name : 'UNKNOWN ITEM'}
                      </div>
                    ))}
                  </div>
                </td>
                <td>
                  <div className="retro-total-amount">${order.totalAmount.toFixed(2)}</div>
                  <div className="retro-payment-method">{order.paymentMethod || 'NOT PAID'}</div>
                </td>
                <td>
                  <span className={`retro-status retro-status-${order.status.toLowerCase()}`}>
                    {order.status}
                  </span>
                </td>
                <td>
                  <div className="retro-order-time">{formatDate(order.createdAt)}</div>
                </td>
                <td>
                  <select
                    value={order.status}
                    onChange={(e) => handleStatusUpdate(order._id, e.target.value)}
                    className="retro-status-select"
                  >
                    <option value="Pending">PENDING</option>
                    <option value="Preparing">PREPARING</option>
                    <option value="Ready">READY</option>
                    <option value="Served">SERVED</option>
                    <option value="Completed">COMPLETED</option>
                  </select>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
    
    <div className="retro-pagination">
      <button 
        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
        disabled={currentPage === 1}
        className="retro-pagination-button"
      >
        PREV
      </button>
      
      <div className="retro-page-info">
        PAGE {currentPage} OF {Math.ceil(filteredOrders.length / ordersPerPage)}
      </div>
      
      <button 
        onClick={() => setCurrentPage(prev => Math.min(prev + 1, Math.ceil(filteredOrders.length / ordersPerPage)))}
        disabled={currentPage >= Math.ceil(filteredOrders.length / ordersPerPage)}
        className="retro-pagination-button"
      >
        NEXT
      </button>
    </div>
  </>
)}
      
      <div className="retro-order-management-footer">
        <div className="retro-footer-text">SPACE DINER ORDER MANAGEMENT v1.0</div>
      </div>
    </div>
  );
};

export default OrderManagement;
