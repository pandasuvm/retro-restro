// pages/MenuPage.jsx
import { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { useNotification } from '../context/NotificationContext';
import { fetchMenuItems } from '../services/api';

const MenuPage = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
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
          { _id: '1', name: 'Classic Burger', description: 'Juicy beef patty with lettuce and tomato', price: 8.99, category: 'Main', available: true },
          { _id: '2', name: 'Cheese Fries', description: 'Crispy fries topped with melted cheese', price: 4.99, category: 'Sides', available: true },
          { _id: '3', name: 'Chocolate Shake', description: 'Creamy chocolate milkshake', price: 3.99, category: 'Beverages', available: true },
          { _id: '4', name: 'Veggie Burger', description: 'Plant-based patty with fresh vegetables', price: 9.99, category: 'Main', available: true },
          { _id: '5', name: 'Onion Rings', description: 'Crispy battered onion rings', price: 3.99, category: 'Sides', available: true },
          { _id: '6', name: 'Vanilla Shake', description: 'Creamy vanilla milkshake', price: 3.99, category: 'Beverages', available: true }
        ]);
        
        setCategories(['All', 'Main', 'Sides', 'Beverages']);
      }
    };
    
    getMenuItems();
  }, []);
  
  const handleAddToCart = (item) => {
    addItem(item);
    addNotification(`Added ${item.name} to cart`, 'success');
  };
  
  const filteredItems = selectedCategory === 'All' 
    ? menuItems 
    : menuItems.filter(item => item.category === selectedCategory);
  
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
        {error}
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4">
      <h1 className="text-3xl font-bold mb-8">Our Menu</h1>
      
      {/* Category Filter */}
      <div className="mb-8 flex flex-wrap gap-2">
        {categories.map(category => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`px-4 py-2 rounded-full ${
              selectedCategory === category 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
            } transition-colors`}
          >
            {category}
          </button>
        ))}
      </div>
      
      {/* Menu Items */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredItems.map(item => (
          <div key={item._id} className="bg-white rounded-lg shadow-md overflow-hidden">
            {item.image && (
              <img 
                src={item.image} 
                alt={item.name} 
                className="w-full h-48 object-cover"
              />
            )}
            <div className="p-6">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-xl font-bold">{item.name}</h3>
                <span className="text-green-600 font-bold">${item.price.toFixed(2)}</span>
              </div>
              <p className="text-gray-600 mb-4">{item.description}</p>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">{item.category}</span>
                <button
                  onClick={() => handleAddToCart(item)}
                  disabled={!item.available}
                  className={`px-4 py-2 rounded ${
                    item.available 
                      ? 'bg-blue-600 text-white hover:bg-blue-700' 
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  } transition-colors`}
                >
                  {item.available ? 'Add to Cart' : 'Unavailable'}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {filteredItems.length === 0 && (
        <div className="bg-yellow-100 text-yellow-800 p-4 rounded-md text-center">
          No items available in this category.
        </div>
      )}
    </div>
  );
};

export default MenuPage;
