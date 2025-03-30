import { io } from 'socket.io-client';

let socket;

export const initializeSocket = () => {
  if (socket) return socket;
  
  socket = io('http://localhost:3000', {
    transports: ['websocket', 'polling'],
    withCredentials: true,
    reconnection: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 1000
  });

  

  socket.on('connect', () => {
    console.log('Connected to socket server');
  });

  socket.on('connect_error', (error) => {
    console.error('Socket connection error:', error);
  });
  
  socket.on('reconnect', (attemptNumber) => {
    console.log(`Reconnected after ${attemptNumber} attempts`);
  });
  
  socket.on('reconnect_error', (error) => {
    console.error('Socket reconnection error:', error);
  });

  return socket;
};

export const getSocket = () => {
  if (!socket) {
    return initializeSocket();
  }
  return socket;
};

export const joinRestaurant = () => {
  const socket = getSocket();
  socket.emit('join_restaurant', 'restaurant');
};

export const emitTableSelection = (tableData) => {
  const socket = getSocket();
  socket.emit('select_table', tableData);
};

export const emitTableRelease = (tableData) => {
  const socket = getSocket();
  socket.emit('release_table', tableData);
};

export const emitNewOrder = (orderData) => {
  const socket = getSocket();
  socket.emit('new_order', orderData);
};

export const onOrderUpdate = (callback) => {
  const socket = getSocket();
  socket.on('order_update', callback);
  return () => socket.off('order_update');
};

export const onTableUpdate = (callback) => {
  const socket = getSocket();
  socket.on('table_updated', callback);
  return () => socket.off('table_updated');
};

export const onOrderReady = (callback) => {
  const socket = getSocket();
  socket.on('order_ready', callback);
  return () => socket.off('order_ready');
};

export const onNotification = (callback) => {
  const socket = getSocket();
  socket.on('notification', callback);
  return () => socket.off('notification');
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};
