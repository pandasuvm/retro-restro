// components/layout/Header.jsx
import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import '../../styles/RetroHeader.css';

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { totalItems } = useCart();
  const location = useLocation();
  
  const navigation = [
    { name: 'HOME', href: '/' },
    { name: 'MENU', href: '/menu' },
    { name: 'CART', href: '/cart' },
    { name: 'SELECT TABLE', href: '/table-selection' },
  ];

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  return (
    <header className={`retro-header ${scrolled ? 'scrolled' : ''}`}>
      <div className="retro-header-container">
        <div className="retro-header-content">
          <Link to="/" className="retro-logo">
            <div className="retro-logo-text">RETRO DINER</div>
            <div className="retro-logo-glow"></div>
          </Link>
          
          {/* Mobile menu button */}
          <button 
            className="retro-mobile-menu-button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            <div className={`retro-burger ${mobileMenuOpen ? 'open' : ''}`}>
              <span></span>
              <span></span>
              <span></span>
            </div>
          </button>
          
          {/* Desktop navigation */}
          <nav className="retro-desktop-nav">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`retro-nav-link ${
                  location.pathname === item.href ? 'active' : ''
                }`}
              >
                {item.name}
                {item.name === 'CART' && totalItems > 0 && (
                  <span className="retro-cart-badge">
                    {totalItems}
                  </span>
                )}
              </Link>
            ))}
          </nav>
        </div>
        
        {/* Mobile navigation */}
        <div className={`retro-mobile-nav ${mobileMenuOpen ? 'open' : ''}`}>
          {navigation.map((item) => (
            <Link
              key={item.name}
              to={item.href}
              className={`retro-mobile-nav-link ${
                location.pathname === item.href ? 'active' : ''
              }`}
              onClick={() => setMobileMenuOpen(false)}
            >
              {item.name}
              {item.name === 'CART' && totalItems > 0 && (
                <span className="retro-cart-badge mobile">
                  {totalItems}
                </span>
              )}
            </Link>
          ))}
        </div>
      </div>
    </header>
  );
};

export default Header;
