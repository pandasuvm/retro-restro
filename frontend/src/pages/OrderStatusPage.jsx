import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useOrder } from '../context/orderContext';
import { useNotification } from '../context/NotificationContext';
import { getSocket } from '../services/SocketService';

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


  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
        {error}
      </div>
    );
  }

  if (!order) {
    return (
      <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded">
        Order not found
      </div>
    );
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'Pending': return 'bg-yellow-500';
      case 'Preparing': return 'bg-blue-500';
      case 'Ready': return 'bg-green-500';
      case 'Served': return 'bg-purple-500';
      case 'Completed': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Order Status</h1>

      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-2">Order #{order?._id?.substring(0, 8) || 'N/A'}</h2>
          <p className="text-gray-600">Table: {order?.tableNumber || 'N/A'}</p>
          <p className="text-gray-600">Placed: {order?.createdAt ? new Date(order.createdAt).toLocaleString() : 'N/A'}</p>
        </div>

        <div className="mb-6">
          <h3 className="font-semibold mb-2">Status</h3>
          <div className="flex items-center">
            <span className={`inline-block w-3 h-3 rounded-full mr-2 ${getStatusColor(order?.status)}`}></span>
            <span className="font-medium">{order?.status || 'Unknown'}</span>
          </div>
        </div>

        <div className="mb-6">
          <h3 className="font-semibold mb-2">Order Items</h3>
          <ul className="divide-y">
            {(order?.items || []).map((item, index) => (
              <li key={index} className="py-2 flex justify-between">
                <span>{item.quantity}x {item.menuItem?.name || 'Item'}</span>
                <span>${(item.menuItem?.price * item.quantity).toFixed(2) || '0.00'}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="border-t pt-4">
          <div className="flex justify-between font-semibold">
            <span>Total</span>
            <span>${order?.totalAmount?.toFixed(2) || '0.00'}</span>
          </div>
          <p className="text-gray-500 text-sm mt-1">Payment Method: {order?.paymentMethod || 'Not specified'}</p>
        </div>
      </div>
    </div>
  );
};

export default OrderStatusPage;
