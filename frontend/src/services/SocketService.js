import { io } from 'socket.io-client';

let socket;

export const initializeSocket = () => {
  socket = io('http://localhost:3000', {
    transports: ['websocket', 'polling'],
    withCredentials: true
  });
  

  socket.on('connect', () => {
    console.log('Connected to socket server');
  });

  socket.on('connect_error', (error) => {
    console.error('Socket connection error:', error);
  });

  return socket;
};


export const initSocket = () => {
  socket = io('http://localhost:3000', {
    transports: ['websocket', 'polling'],
    withCredentials: true
  });
  

  socket.on('connect', () => {
    console.log('Connected to socket server');
  });

  socket.on('connect_error', (error) => {
    console.error('Socket connection error:', error);
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
