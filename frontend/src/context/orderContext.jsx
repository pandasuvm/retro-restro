import { createContext, useContext, useState, useCallback,useEffect } from 'react';
import { createOrder, getOrderById, updateOrderStatus } from '../services/api';
import { emitNewOrder, getSocket } from '../services/SocketService';
import { useCart } from './CartContext';

const OrderContext = createContext();

export function OrderProvider({ children }) {
  const [tableInfo, setTableInfo] = useState(null);
  const [currentOrder, setCurrentOrder] = useState(null);
  const [orderStatus, setOrderStatus] = useState(null);
  const { clearCart } = useCart();
  
  const placeOrder = useCallback(async (orderData) => {
    if (!tableInfo) {
      throw new Error('Table information is required to place an order');
    }
    
    try {
      // Format the order data correctly
      const completeOrderData = {
        tableNumber: tableInfo.tableNumber,
        items: Array.isArray(orderData) 
          ? orderData.map(item => ({
              menuItem: item._id,
              quantity: item.quantity || 1
            }))
          : orderData.items,
        totalAmount: typeof orderData.totalAmount === 'number' 
          ? orderData.totalAmount 
          : Array.isArray(orderData) 
            ? orderData.reduce((sum, item) => sum + (item.price * (item.quantity || 1)), 0)
            : 0,
        paymentMethod: orderData.paymentMethod || 'Cash'
      };
      
      console.log('Sending order data:', completeOrderData);
      
      const newOrder = await createOrder(completeOrderData);
      setCurrentOrder(newOrder);
      setOrderStatus(newOrder.status);
      
      // Emit socket event for real-time updates
      emitNewOrder(newOrder);
      
      return newOrder;
    } catch (error) {
      console.error('Error placing order:', error);
      throw error;
    }
  }, [tableInfo]);
  
  // Rename this to match your API service function
  const getOrderStatus = useCallback(async (orderId) => {
    try {
      const order = await getOrderById(orderId);
      setCurrentOrder(order);
      setOrderStatus(order.status);
      return order;
    } catch (error) {
      console.error('Error getting order status:', error);
      throw error;
    }
  }, []);
  
  const updateOrder = useCallback(async (orderId, status) => {
    try {
      const updatedOrder = await updateOrderStatus(orderId, status);
      setCurrentOrder(updatedOrder);
      setOrderStatus(updatedOrder.status);
      return updatedOrder;
    } catch (error) {
      console.error('Error updating order:', error);
      throw error;
    }
  }, []);
  
  const cancelOrder = useCallback(async () => {
    if (!currentOrder) return;
    
    try {
      // Implement cancel order API call if needed
      setCurrentOrder(null);
      setOrderStatus(null);
      clearCart();
    } catch (error) {
      console.error('Error canceling order:', error);
      throw error;
    }
  }, [currentOrder, clearCart]);
  
  // Listen for order status updates - use useEffect instead of useState
  useEffect(() => {
    if (!currentOrder) return;
    
    const socket = getSocket();
    
    const handleStatusUpdate = (data) => {
      console.log('Received status update:', data);
      if (data._id === currentOrder._id) {
        setOrderStatus(data.status);
        setCurrentOrder(data);
      }
    };
    
    socket.on('status_update', handleStatusUpdate);
    
    return () => {
      socket.off('status_update', handleStatusUpdate);
    };
  }, [currentOrder]);
  
  const value = {
    tableInfo,
    setTableInfo,
    currentOrder,
    orderStatus,
    placeOrder,
    getOrderStatus,
    updateOrder,
    cancelOrder
  };
  
  return <OrderContext.Provider value={value}>{children}</OrderContext.Provider>;
}

export const useOrder = () => {
  const context = useContext(OrderContext);
  if (context === undefined) {
    throw new Error('useOrder must be used within an OrderProvider');
  }
  return context;
};
