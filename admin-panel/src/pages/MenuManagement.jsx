import { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/RetroMenuManagement.css';

const MenuManagement = ({ apiUrl }) => {
  const [menuItems, setMenuItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    image: '',
    available: true
  });
  
  // Fetch menu items
  const fetchMenuItems = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${apiUrl}/menu`);
      setMenuItems(response.data);
      
      // Extract unique categories
      const uniqueCategories = [...new Set(response.data.map(item => item.category))];
      setCategories(uniqueCategories);
      
      setLoading(false);
    } catch (err) {
      console.error('Error fetching menu items:', err);
      setError('Failed to load menu items');
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchMenuItems();
  }, [apiUrl]);
  
  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };
  
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const data = {
        ...formData,
        price: parseFloat(formData.price)
      };
      
      if (currentItem) {
        // Update existing item
        await axios.put(`${apiUrl}/menu/${currentItem._id}`, data);
      } else {
        // Create new item
        await axios.post(`${apiUrl}/menu`, data);
      }
      
      // Reset form and fetch updated menu items
      setFormData({
        name: '',
        description: '',
        price: '',
        category: '',
        image: '',
        available: true
      });
      setCurrentItem(null);
      setShowForm(false);
      fetchMenuItems();
    } catch (err) {
      console.error('Error saving menu item:', err);
      setError('Failed to save menu item');
    }
  };
  
  // Handle edit item
  const handleEdit = (item) => {
    setCurrentItem(item);
    setFormData({
      name: item.name,
      description: item.description || '',
      price: item.price.toString(),
      category: item.category,
      image: item.image || '',
      available: item.available
    });
    setShowForm(true);
  };
  
  // Handle delete item
  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      try {
        await axios.delete(`${apiUrl}/menu/${id}`);
        fetchMenuItems();
      } catch (err) {
        console.error('Error deleting menu item:', err);
        setError('Failed to delete menu item');
      }
    }
  };
  
  if (loading) return (
    <div className="retro-menu-management-container">
      <div className="retro-loading">
        <div className="retro-loading-text">LOADING DATA...</div>
        <div className="retro-loading-bar"></div>
      </div>
    </div>
  );
  
  if (error) return (
    <div className="retro-menu-management-container">
      <div className="retro-error">
        <div className="retro-error-title">SYSTEM ERROR</div>
        <div className="retro-error-message">{error}</div>
      </div>
    </div>
  );
  
  return (
    <div className="retro-menu-management-container">
      <div className="retro-scanlines"></div>
      <div className="retro-flicker"></div>
      
      <div className="retro-menu-management-header">
        <h1 className="retro-title">MENU CONTROL PANEL</h1>
        <div className="retro-date">{new Date().toLocaleDateString('en-US', { 
          weekday: 'long', 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric' 
        })}</div>
        
        <button
          onClick={() => {
            setCurrentItem(null);
            setFormData({
              name: '',
              description: '',
              price: '',
              category: '',
              image: '',
              available: true
            });
            setShowForm(!showForm);
          }}
          className="retro-action-button"
        >
          {showForm ? '[ CANCEL ]' : '[ ADD NEW ITEM ]'}
        </button>
      </div>
      
      {showForm && (
        <div className="retro-form-container">
          <div className="retro-form-header">
            <h2 className="retro-form-title">
              {currentItem ? 'EDIT MENU ITEM' : 'ADD NEW MENU ITEM'}
            </h2>
          </div>
          
          <form onSubmit={handleSubmit} className="retro-form">
            <div className="retro-form-grid">
              <div className="retro-form-group">
                <label className="retro-form-label">
                  NAME:
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="retro-form-input"
                />
              </div>
              
              <div className="retro-form-group">
                <label className="retro-form-label">
                  CATEGORY:
                </label>
                <input
                  type="text"
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  required
                  list="categories"
                  className="retro-form-input"
                />
                <datalist id="categories">
                  {categories.map((category, index) => (
                    <option key={index} value={category} />
                  ))}
                </datalist>
              </div>
              
              <div className="retro-form-group">
                <label className="retro-form-label">
                  PRICE ($):
                </label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  required
                  min="0"
                  step="0.01"
                  className="retro-form-input"
                />
              </div>
              
              <div className="retro-form-group">
                <label className="retro-form-label">
                  IMAGE URL:
                </label>
                <input
                  type="text"
                  name="image"
                  value={formData.image}
                  onChange={handleInputChange}
                  className="retro-form-input"
                />
              </div>
              
              <div className="retro-form-group retro-form-full">
                <label className="retro-form-label">
                  DESCRIPTION:
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows="3"
                  className="retro-form-textarea"
                ></textarea>
              </div>
              
              <div className="retro-form-group retro-form-checkbox">
                <label className="retro-checkbox-label">
                  <input
                    type="checkbox"
                    name="available"
                    checked={formData.available}
                    onChange={handleInputChange}
                    className="retro-checkbox"
                  />
                  <span className="retro-checkbox-text">AVAILABLE</span>
                </label>
              </div>
            </div>
            
            <div className="retro-form-actions">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="retro-cancel-button"
              >
                [ CANCEL ]
              </button>
              <button
                type="submit"
                className="retro-submit-button"
              >
                [ {currentItem ? 'UPDATE ITEM' : 'ADD ITEM'} ]
              </button>
            </div>
          </form>
        </div>
      )}
      
      <div className="retro-table-container">
        <table className="retro-table">
          <thead>
            <tr>
              <th>ITEM</th>
              <th>CATEGORY</th>
              <th>PRICE</th>
              <th>STATUS</th>
              <th>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {menuItems.map((item) => (
              <tr key={item._id}>
                <td>
                  <div className="retro-item-cell">
                    {item.image && (
                      <div className="retro-item-image">
                        <img src={item.image} alt={item.name} />
                      </div>
                    )}
                    <div className="retro-item-info">
                      <div className="retro-item-name">{item.name}</div>
                      <div className="retro-item-desc">{item.description?.substring(0, 50)}{item.description?.length > 50 ? '...' : ''}</div>
                    </div>
                  </div>
                </td>
                <td>
                  <div className="retro-category">{item.category}</div>
                </td>
                <td>
                  <div className="retro-price">${item.price.toFixed(2)}</div>
                </td>
                <td>
                  <span className={`retro-status ${item.available ? 'retro-status-available' : 'retro-status-unavailable'}`}>
                    {item.available ? 'AVAILABLE' : 'UNAVAILABLE'}
                  </span>
                </td>
                <td>
                  <div className="retro-actions">
                    <button
                      onClick={() => handleEdit(item)}
                      className="retro-edit-button"
                    >
                      EDIT
                    </button>
                    <button
                      onClick={() => handleDelete(item._id)}
                      className="retro-delete-button"
                    >
                      DELETE
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <div className="retro-menu-management-footer">
        <div className="retro-footer-text">SPACE DINER MENU MANAGEMENT v1.0</div>
      </div>
    </div>
  );
};

export default MenuManagement;
