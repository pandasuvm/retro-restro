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

// API base URL
const API_URL = 'http://localhost:3000/api';
// Socket connection
const socket = io('http://localhost:3000');

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
      <div className="flex h-screen bg-gray-100">
        <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
          <main className="flex-1 overflow-y-auto p-4">
            <Routes>
              <Route path="/" element={<Dashboard apiUrl={API_URL} socket={socket} />} />
              <Route path="/menu" element={<MenuManagement apiUrl={API_URL} />} />
              <Route path="/orders" element={<OrderManagement apiUrl={API_URL} socket={socket} />} />
              <Route path="/tables" element={<TableManagement apiUrl={API_URL} />} />
            </Routes>
          </main>
        </div>
      </div>
    </Router>
  );
}

export default App;
