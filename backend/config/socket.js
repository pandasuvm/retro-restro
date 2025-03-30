const socketIO = require('socket.io');

const configureSocket = (server) => {
  const io = socketIO(server, {
    cors: {
      origin: ['http://localhost:5173', 'http://localhost:5174'],
      methods: ['GET', 'POST'],
      credentials: true
    }
  });

  io.on('connection', (socket) => {
    console.log('New client connected');
    
    socket.on('join_restaurant', (restaurantId) => {
      socket.join(restaurantId);
    });
    
    socket.on('new_order', (data) => {
      io.to(data.restaurantId).emit('order_update', data);
    });
    
    socket.on('update_order_status', (data) => {
      io.to(data.restaurantId).emit('status_update', data);
    });
    
    socket.on('disconnect', () => {
      console.log('Client disconnected');
    });
  });

  return io;
};

module.exports = configureSocket;
