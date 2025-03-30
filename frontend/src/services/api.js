import axios from 'axios';

const API_URL = 'http://localhost:3000/api';

export const fetchMenuItems = async () => {
  try {
    const response = await axios.get(`${API_URL}/menu`);
    return response.data;
  } catch (error) {
    console.error('Error fetching menu items:', error.response?.data || error.message);
    throw error;
  }
};

export const createOrder = async (orderData) => {
  try {
    const response = await axios.post(`${API_URL}/orders`, orderData);
    return response.data;
  } catch (error) {
    console.error('Error creating order:', error.response?.data || error.message);
    throw error;
  }
};



export const getOrderById = async (orderId) => {
  try {
    const response = await axios.get(`${API_URL}/orders/${orderId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching order:', error.response?.data || error.message);
    throw error;
  }
};

export const updateOrderStatus = async (orderId, status) => {
  try {
    const response = await axios.put(`${API_URL}/orders/${orderId}/status`, { status });
    return response.data;
  } catch (error) {
    console.error('Error updating order status:', error.response?.data || error.message);
    throw error;
  }
};

export const updateTableStatus = async (tableNumber, isOccupied, currentOrder = null) => {
  try {
    const response = await axios.put(`${API_URL}/tables/${tableNumber}`, { isOccupied, currentOrder });
    return response.data;
  } catch (error) {
    console.error('Error updating table status:', error.response?.data || error.message);
    throw error;
  }
};
