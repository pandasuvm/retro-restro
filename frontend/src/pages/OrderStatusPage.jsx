// pages/OrderStatusPage.jsx
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useOrder } from '../context/orderContext';
import { useNotification } from '../context/NotificationContext';
import { getSocket } from '../services/SocketService';
import '../styles/RetroOrderStatus.css';

const OrderStatusPage = () => {
  const { orderId } = useParams();
  const { getOrderStatus } = useOrder();
  const { addNotification } = useNotification();
  
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Fetch order data initially
  useEffect(() => {
    const fetchOrder = async () => {
      try {
        setLoading(true);
        const orderData = await getOrderStatus(orderId);
        setOrder(orderData);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching order:', err);
        setError('Failed to load order details');
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId, getOrderStatus]);

  // Set up socket listeners separately
  useEffect(() => {
    const socket = getSocket();
    
    // Listen for both event types your backend might emit
    const handleOrderUpdate = (updatedOrder) => {
      console.log('Received order_update:', updatedOrder);
      if (updatedOrder._id === orderId) {
        setOrder(updatedOrder);
        addNotification(`Order status updated to: ${updatedOrder.status}`, 'info');
      }
    };
    
    const handleStatusUpdate = (updatedOrder) => {
      console.log('Received status_update:', updatedOrder);
      if (updatedOrder._id === orderId) {
        setOrder(updatedOrder);
        addNotification(`Order status updated to: ${updatedOrder.status}`, 'info');
      }
    };
    
    // Join a room specific to this order
    socket.emit('join_order', orderId);
    
    // Register both event listeners
    socket.on('order_update', handleOrderUpdate);
    socket.on('status_update', handleStatusUpdate);
    
    return () => {
      // Clean up listeners when component unmounts
      socket.off('order_update', handleOrderUpdate);
      socket.off('status_update', handleStatusUpdate);
      socket.emit('leave_order', orderId);
    };
  }, [orderId, addNotification]);

  const getStatusClass = (status) => {
    switch (status) {
      case 'Pending': return 'status-pending';
      case 'Preparing': return 'status-preparing';
      case 'Ready': return 'status-ready';
      case 'Served': return 'status-served';
      case 'Completed': return 'status-completed';
      default: return 'status-unknown';
    }
  };

  if (loading) {
    return (
      <div className="retro-order-container">
        <div className="retro-crt-effect">
          <div className="retro-scanlines"></div>
          <div className="retro-loading">
            <div className="retro-loading-text">LOADING ORDER DATA...</div>
            <div className="retro-loading-animation">
              <div className="retro-loading-bar"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="retro-order-container">
        <div className="retro-crt-effect">
          <div className="retro-scanlines"></div>
          <div className="retro-error">
            <div className="retro-error-title">SYSTEM ERROR</div>
            <div className="retro-error-message">{error}</div>
          </div>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="retro-order-container">
        <div className="retro-crt-effect">
          <div className="retro-scanlines"></div>
          <div className="retro-not-found">
            <div className="retro-not-found-title">ORDER NOT FOUND</div>
            <div className="retro-not-found-message">The requested order could not be located in our system.</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="retro-order-container">
      <div className="retro-crt-effect">
        <div className="retro-scanlines"></div>
        <div className="retro-flicker"></div>
        
        <div className="retro-header">
          <div className="retro-title-container">
            <h1 className="retro-neon-title">ORDER STATUS</h1>
          </div>
        </div>
        
        <div className="retro-order-card">
          <div className="retro-order-header">
            <div className="retro-order-id">ORDER #{order?._id?.substring(0, 8) || 'N/A'}</div>
            <div className="retro-order-details">
              <div className="retro-order-detail">TABLE: {order?.tableNumber || 'N/A'}</div>
              <div className="retro-order-detail">PLACED: {order?.createdAt ? new Date(order.createdAt).toLocaleString() : 'N/A'}</div>
            </div>
          </div>
          
          <div className="retro-status-section">
            <div className="retro-section-title">STATUS</div>
            <div className={`retro-status-indicator ${getStatusClass(order?.status)}`}>
              <div className="retro-status-dot"></div>
              <div className="retro-status-text">{order?.status || 'Unknown'}</div>
            </div>
          </div>
          
          <div className="retro-items-section">
            <div className="retro-section-title">ORDER ITEMS</div>
            <div className="retro-items-list">
              <div className="retro-items-header">
                <div className="retro-item-qty">QTY</div>
                <div className="retro-item-name">ITEM</div>
                <div className="retro-item-price">PRICE</div>
              </div>
              {(order?.items || []).map((item, index) => (
                <div key={index} className="retro-item-row">
                  <div className="retro-item-qty">{item.quantity}x</div>
                  <div className="retro-item-name">{item.menuItem?.name || 'Item'}</div>
                  <div className="retro-item-price">${(item.menuItem?.price * item.quantity).toFixed(2) || '0.00'}</div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="retro-total-section">
            <div className="retro-total-row">
              <div className="retro-total-label">TOTAL</div>
              <div className="retro-total-amount">${order?.totalAmount?.toFixed(2) || '0.00'}</div>
            </div>
            <div className="retro-payment-method">PAYMENT: {order?.paymentMethod || 'Not specified'}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderStatusPage;
