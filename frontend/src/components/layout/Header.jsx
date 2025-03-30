// components/layout/Header.jsx
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useCart } from '../../context/CartContext';

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { totalItems } = useCart();
  const location = useLocation();
  
  const navigation = [
    { name: 'Home', href: '/' },
    { name: 'Menu', href: '/menu' },
    { name: 'Cart', href: '/cart' },
    { name: 'Select Table', href: '/table-selection' },
  ];
  
  return (
    <header className="bg-blue-600 text-white">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <Link to="/" className="text-2xl font-bold">Retro Diner</Link>
          
          {/* Mobile menu button */}
          <button 
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          
          {/* Desktop navigation */}
          <nav className="hidden md:flex space-x-6">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`hover:text-blue-200 ${
                  location.pathname === item.href ? 'font-bold' : ''
                }`}
              >
                {item.name}
                {item.name === 'Cart' && totalItems > 0 && (
                  <span className="ml-1 bg-white text-blue-600 px-2 py-1 rounded-full text-xs">
                    {totalItems}
                  </span>
                )}
              </Link>
            ))}
          </nav>
        </div>
        
        {/* Mobile navigation */}
        {mobileMenuOpen && (
          <nav className="md:hidden py-4 border-t border-blue-500">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className="block py-2 hover:bg-blue-700 px-2 rounded"
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.name}
                {item.name === 'Cart' && totalItems > 0 && (
                  <span className="ml-1 bg-white text-blue-600 px-2 py-1 rounded-full text-xs">
                    {totalItems}
                  </span>
                )}
              </Link>
            ))}
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;
