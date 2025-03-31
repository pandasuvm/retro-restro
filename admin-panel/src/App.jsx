import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Dashboard from './pages/Dashboard';
import MenuManagement from './pages/MenuManagement';
import OrderManagement from './pages/OrderManagement';
import TableManagement from './pages/TableManagement';
import axios from 'axios';
import { io } from 'socket.io-client';
import './styles/RetroApp.css';

// API base URL
const API_URL = 'https://retro-restro.onrender.com/api';
// Socket connection
const socket = io('https://retro-restro.onrender.com');

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  useEffect(() => {
    // Join restaurant room for real-time updates
    socket.emit('join_restaurant', 'restaurant');
    
    // Listen for new orders
    socket.on('new_order', (data) => {
      console.log('New order received:', data);
      // You can add notification logic here
    });
    
    // Listen for order status updates
    socket.on('status_update', (data) => {
      console.log('Order status updated:', data);
      // You can add notification logic here
    });
    
    return () => {
      socket.off('new_order');
      socket.off('status_update');
    };
  }, []);
  
  return (
    <Router>
      <div className="retro-app">
        <div className="retro-scanlines"></div>
        <div className="retro-flicker"></div>
        <div className="retro-content">
          <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
          <div className="retro-main">
            <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
            <main className="retro-main-content">
              <Routes>
                <Route path="/" element={<Dashboard apiUrl={API_URL} socket={socket} />} />
                <Route path="/menu" element={<MenuManagement apiUrl={API_URL} />} />
                <Route path="/orders" element={<OrderManagement apiUrl={API_URL} socket={socket} />} />
                <Route path="/tables" element={<TableManagement apiUrl={API_URL} />} />
              </Routes>
            </main>
          </div>
        </div>
      </div>
    </Router>
  );
}

export default App;
