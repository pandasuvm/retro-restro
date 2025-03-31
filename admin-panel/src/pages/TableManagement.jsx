import { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/RetroTableManagement.css';

const TableManagement = ({ apiUrl }) => {
  const [tables, setTables] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    tableNumber: '',
    capacity: ''
  });
  
  const fetchTables = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${apiUrl}/tables`);
      
      // Sort tables by table number
      const tablesData = response.data.sort((a, b) => a.tableNumber - b.tableNumber);
      
      setTables(tablesData);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching tables:', err);
      setError('Failed to load tables');
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchTables();
  }, [apiUrl]);
  
  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };
  
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const data = {
        tableNumber: parseInt(formData.tableNumber),
        capacity: parseInt(formData.capacity)
      };
      
      await axios.post(`${apiUrl}/tables`, data);
      
      // Reset form and fetch updated tables
      setFormData({
        tableNumber: '',
        capacity: ''
      });
      setShowForm(false);
      fetchTables();
    } catch (err) {
      console.error('Error creating table:', err);
      setError('Failed to create table');
    }
  };
  
  // Handle table status update
  const handleStatusUpdate = async (tableNumber, isOccupied) => {
    try {
      await axios.put(`${apiUrl}/tables/${tableNumber}`, { isOccupied });
      fetchTables();
    } catch (err) {
      console.error('Error updating table status:', err);
      setError('Failed to update table status');
    }
  };
  
  if (loading) return (
    <div className="retro-table-management-container">
      <div className="retro-loading">
        <div className="retro-loading-text">LOADING TABLES...</div>
        <div className="retro-loading-bar"></div>
      </div>
    </div>
  );
  
  if (error) return (
    <div className="retro-table-management-container">
      <div className="retro-error">
        <div className="retro-error-title">SYSTEM ERROR</div>
        <div className="retro-error-message">{error}</div>
      </div>
    </div>
  );
  
  return (
    <div className="retro-table-management-container">
      <div className="retro-scanlines"></div>
      <div className="retro-flicker"></div>
      
      <div className="retro-table-management-header">
        <h1 className="retro-title">TABLE CONFIGURATION TERMINAL</h1>
        <div className="retro-date">{new Date().toLocaleDateString('en-US', { 
          weekday: 'long', 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric' 
        })}</div>
        
        <button
          onClick={() => setShowForm(!showForm)}
          className="retro-action-button"
        >
          {showForm ? '[ CANCEL ]' : '[ ADD NEW TABLE ]'}
        </button>
      </div>
      
      {showForm && (
        <div className="retro-form-container">
          <div className="retro-form-header">
            <h2 className="retro-form-title">ADD NEW TABLE</h2>
          </div>
          
          <form onSubmit={handleSubmit} className="retro-form">
            <div className="retro-form-grid">
              <div className="retro-form-group">
                <label className="retro-form-label">
                  TABLE NUMBER:
                </label>
                <input
                  type="number"
                  name="tableNumber"
                  value={formData.tableNumber}
                  onChange={handleInputChange}
                  required
                  min="1"
                  className="retro-form-input"
                />
              </div>
              
              <div className="retro-form-group">
                <label className="retro-form-label">
                  CAPACITY:
                </label>
                <input
                  type="number"
                  name="capacity"
                  value={formData.capacity}
                  onChange={handleInputChange}
                  required
                  min="1"
                  className="retro-form-input"
                />
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
                [ ADD TABLE ]
              </button>
            </div>
          </form>
        </div>
      )}
      
      <div className="retro-tables-grid">
        {tables.map((table) => (
          <div 
            key={table._id} 
            className={`retro-table-card ${table.isOccupied ? 'occupied' : 'available'}`}
          >
            <div className="retro-table-header">
              <div className="retro-table-number">TABLE {table.tableNumber}</div>
              <div className={`retro-table-status ${table.isOccupied ? 'occupied' : 'available'}`}>
                {table.isOccupied ? 'OCCUPIED' : 'AVAILABLE'}
              </div>
            </div>
            
            <div className="retro-table-content">
              <div className="retro-table-capacity">
                <span className="retro-capacity-label">CAPACITY:</span>
                <span className="retro-capacity-value">{table.capacity} PEOPLE</span>
              </div>
              
              {table.currentOrder && (
                <div className="retro-table-order">
                  <span className="retro-order-label">CURRENT ORDER:</span>
                  <span className="retro-order-value">
                    {table.currentOrder._id ? table.currentOrder._id.substring(0, 8) : 'N/A'}
                  </span>
                </div>
              )}
              
              <div className="retro-table-controls">
                <select
                  value={table.isOccupied ? 'occupied' : 'available'}
                  onChange={(e) => handleStatusUpdate(table.tableNumber, e.target.value === 'occupied')}
                  className="retro-status-select"
                >
                  <option value="available">AVAILABLE</option>
                  <option value="occupied">OCCUPIED</option>
                </select>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="retro-table-management-footer">
        <div className="retro-footer-text">SPACE DINER TABLE MANAGEMENT v1.0</div>
      </div>
    </div>
  );
};

export default TableManagement;
