import React, { useEffect,useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import { OrderProvider } from './context/orderContext';
import { NotificationProvider } from './context/NotificationContext';
import { initSocket } from './services/SocketService';

// Layout Components
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import NotificationDisplay from './components/ui/NotificationDisplay';

// Page Components
import HomePage from './pages/HomePage';
import MenuPage from './pages/MenuPage';
import CartPage from './components/cart/Cartpage';
import TableSelectionPage from './pages/TableSelectionPage';
import OrderStatusPage from './pages/OrderStatusPage';
import FeedbackPage from './pages/FeedbackPage';
import LoadingScreen from './components/ui/LoadingScreen';

function App() {
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // Initialize socket connection
    const socket = initSocket();
    
    // Join restaurant room for real-time updates
    socket.emit('join_restaurant', 'restaurant');
    
    // Simulate loading screen for retro effect
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);
    
    return () => {
      clearTimeout(timer);
      // Clean up socket connection if needed
    };
  }, []);
  
  if (loading) {
    return <LoadingScreen />;
  }
  
  return (
    <NotificationProvider>
      
        <CartProvider>
        <OrderProvider>
          <Router>
            <div className="flex flex-col min-h-screen bg-gray-100">
              <Header />
              
              <NotificationDisplay />
              
              <main className="flex-grow container mx-auto px-4 py-8">
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/menu" element={<MenuPage />} />
                  <Route path="/cart" element={<CartPage />} />
                  <Route path="/table-selection" element={<TableSelectionPage />} />
                  <Route path="/orders/:orderId" element={<OrderStatusPage />} />

                  <Route path="/feedback/:orderId" element={<FeedbackPage />} />
                </Routes>
              </main>
              
              <Footer />
            </div>
          </Router>
          </OrderProvider>
        </CartProvider>
      
    </NotificationProvider>
  );
}

export default App;
