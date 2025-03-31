// pages/MenuPage.jsx
import { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { useNotification } from '../context/NotificationContext';
import { fetchMenuItems } from '../services/api';
import '../styles/RetroMenu.css';
import { Link } from 'react-router-dom';

const MenuPage = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeItem, setActiveItem] = useState(null);
  
  const { addItem } = useCart();
  const { addNotification } = useNotification();
  
  useEffect(() => {
    const getMenuItems = async () => {
      try {
        setLoading(true);
        const data = await fetchMenuItems();
        setMenuItems(data);
        
        // Extract unique categories
        const uniqueCategories = ['All', ...new Set(data.map(item => item.category))];
        setCategories(uniqueCategories);
        
        setLoading(false);
      } catch (error) {
        console.error('Error fetching menu items:', error);
        setError('Failed to load menu items');
        setLoading(false);
        
        // Set dummy data for testing
        setMenuItems([
          { 
            _id: '1', 
            name: 'Classic Burger', 
            description: 'Juicy beef patty with lettuce and tomato', 
            price: 8.99, 
            category: 'Main', 
            available: true,
            image: 'https://i.imgur.com/xSjpEBF.png'
          },
          { 
            _id: '2', 
            name: 'Cheese Fries', 
            description: 'Crispy fries topped with melted cheese', 
            price: 4.99, 
            category: 'Sides', 
            available: true,
            image: 'https://i.imgur.com/KbEwMBD.png'
          },
          { 
            _id: '3', 
            name: 'Chocolate Shake', 
            description: 'Creamy chocolate milkshake', 
            price: 3.99, 
            category: 'Beverages', 
            available: true,
            image: 'https://i.imgur.com/vLaPz8P.png'
          },
          { 
            _id: '4', 
            name: 'Veggie Burger', 
            description: 'Plant-based patty with fresh vegetables', 
            price: 9.99, 
            category: 'Main', 
            available: true,
            image: 'https://i.imgur.com/qRbZwdF.png'
          },
          { 
            _id: '5', 
            name: 'Onion Rings', 
            description: 'Crispy battered onion rings', 
            price: 3.99, 
            category: 'Sides', 
            available: true,
            image: 'https://i.imgur.com/xA8e6Hs.png'
          },
          { 
            _id: '6', 
            name: 'Vanilla Shake', 
            description: 'Creamy vanilla milkshake', 
            price: 3.99, 
            category: 'Beverages', 
            available: true,
            image: 'https://i.imgur.com/jTD5HpF.png'
          }
        ]);
        
        setCategories(['All', 'Main', 'Sides', 'Beverages']);
      }
    };
    
    getMenuItems();
  }, []);
  
  const handleAddToCart = (item) => {
    addItem(item);
    addNotification(`Added ${item.name} to cart`, 'success');
    
    // Visual feedback animation
    const element = document.getElementById(`menu-item-${item._id}`);
    if (element) {
      element.classList.add('retro-menu-item-added');
      setTimeout(() => {
        element.classList.remove('retro-menu-item-added');
      }, 500);
    }
  };
  
  const filteredItems = selectedCategory === 'All' 
    ? menuItems 
    : menuItems.filter(item => item.category === selectedCategory);
  
  if (loading) {
    return (
      <div className="retro-menu-container">
        <div className="retro-crt-effect">
          <div className="retro-scanlines"></div>
          <div className="retro-loading">
            <div className="retro-loading-text">LOADING MENU...</div>
            <div className="retro-loading-animation">
              <div className="retro-loading-bar"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="retro-menu-container">
        <div className="retro-crt-effect">
          <div className="retro-scanlines"></div>
          <div className="retro-error">
            <div className="retro-error-title">SYSTEM ERROR</div>
            <div className="retro-error-message">{error}</div>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="retro-menu-container">
      <div className="retro-crt-effect">
        <div className="retro-scanlines"></div>
        <div className="retro-flicker"></div>
        
        <div className="retro-header">
          <div className="retro-title-container">
            <h1 className="retro-neon-title">SPACE DINER MENU</h1>
          </div>
          <div className="retro-blink-text">SELECT YOUR COSMIC CUISINE</div>
        </div>
        
        {/* Category Selector */}
        <div className="retro-category-selector">
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`retro-category-button ${
                selectedCategory === category ? 'active' : ''
              }`}
            >
              {category.toUpperCase()}
            </button>
          ))}
        </div>
        
        {/* Menu Grid */}
        <div className="retro-menu-grid">
          {filteredItems.length === 0 ? (
            <div className="retro-no-items">
              <div className="retro-no-items-text">NO ITEMS AVAILABLE IN THIS CATEGORY</div>
            </div>
          ) : (
            filteredItems.map(item => (
              <div 
                id={`menu-item-${item._id}`}
                key={item._id} 
                className={`retro-menu-item ${!item.available ? 'unavailable' : ''} ${activeItem === item._id ? 'active' : ''}`}
                onClick={() => setActiveItem(activeItem === item._id ? null : item._id)}
              >
                <div className="retro-menu-item-image-container">
                  {item.image ? (
                    <img 
                      src={item.image} 
                      alt={item.name} 
                      className="retro-menu-item-image" 
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = '/images/default-food.png';
                      }}
                    />
                  ) : (
                    <div className="retro-menu-item-image-placeholder">
                      <span>NO IMAGE</span>
                    </div>
                  )}
                  {!item.available && (
                    <div className="retro-sold-out-overlay">
                      <span>SOLD OUT</span>
                    </div>
                  )}
                </div>
                
                <div className="retro-menu-item-header">
                  <h3 className="retro-menu-item-name">{item.name}</h3>
                  <div className="retro-menu-item-price">${item.price.toFixed(2)}</div>
                </div>
                
                <div className="retro-menu-item-content">
                  <p className="retro-menu-item-description">{item.description}</p>
                  <div className="retro-menu-item-category">{item.category}</div>
                  
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (item.available) handleAddToCart(item);
                    }}
                    disabled={!item.available}
                    className={`retro-add-button ${!item.available ? 'disabled' : ''}`}
                  >
                    {item.available ? 'ADD TO CART' : 'SOLD OUT'}
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="retro-cart-navigation">
          <Link to="/cart" className="retro-cart-button">
            <div className="retro-cart-icon"></div>
            GO TO CART
          </Link>
        </div>
        
        {/* Retro Footer */}
        <div className="retro-menu-footer">
          <div className="retro-menu-footer-text">
            HAPPY TO KILL YOUR HUNGER!
          </div>
        </div>
      </div>
    </div>
  );
};

export default MenuPage;
