const express = require('express');
const cors = require('cors');
const http = require('http');
const connectDB = require('./config/db');
const configureSocket = require('./config/socket');
require('dotenv').config();

// Import routes
const menuRoutes = require('./routes/menuRoutes');
const orderRoutes = require('./routes/orderRoutes');
const tableRoutes = require('./routes/tableRoutes');

// Connect to MongoDB
connectDB();

const app = express();
const server = http.createServer(app);
const io = configureSocket(server);

// Middleware
app.use(cors());
app.use(express.json());

// Add io to request object for socket access in controllers
app.use((req, res, next) => {
  req.io = io;
  next();
});

// Routes
app.use('/api/menu', menuRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/tables', tableRoutes);

// Basic route
app.get('/', (req, res) => {
  res.send('Restaurant API is running');
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
