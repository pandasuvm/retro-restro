import { useState, useEffect } from 'react';
import { useNotification } from '../../context/NotificationContext';
import { fetchMenuItems } from '../../services/api';
import MenuItem from './MenuItem';

const MenuList = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
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
        addNotification('Failed to load menu items', 'error');
        
        // Set dummy data for testing
        setMenuItems([
          { _id: '1', name: 'Classic Burger', description: 'Juicy beef patty with lettuce and tomato', price: 8.99, category: 'Main', available: true },
          { _id: '2', name: 'Cheese Fries', description: 'Crispy fries topped with melted cheese', price: 4.99, category: 'Sides', available: true },
          { _id: '3', name: 'Chocolate Shake', description: 'Creamy chocolate milkshake', price: 3.99, category: 'Beverages', available: true }
        ]);
        
        setCategories(['All', 'Main', 'Sides', 'Beverages']);
      }
    };
    
    getMenuItems();
  }, [addNotification]);
  
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
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Our Menu</h1>
      
      <div className="mb-6 flex flex-wrap gap-2">
        {categories.map(category => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`px-4 py-2 rounded ${
              selectedCategory === category 
                ? 'bg-blue-500 text-white' 
                : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
            }`}
          >
            {category}
          </button>
        ))}
      </div>
      
      {filteredItems.length === 0 ? (
        <div className="p-4 bg-yellow-100 text-yellow-700 rounded">
          No items available in this category.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredItems.map(item => (
            <MenuItem key={item._id} item={item} />
          ))}
        </div>
      )}
    </div>
  );
};

export default MenuList;
