// pages/TableSelectionPage.jsx
import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useOrder } from '../context/orderContext';
import { useNotification } from '../context/NotificationContext';
import { 
  joinRestaurant, 
  emitTableSelection, 
  onTableUpdate 
} from '../services/SocketService';
import axios from 'axios';
import '../styles/RetroTableSelection.css';

const TableSelectionPage = () => {
  const [tableNumber, setTableNumber] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [tables, setTables] = useState([]);
  const [error, setError] = useState(null);
  const { setTableInfo } = useOrder();
  const { addNotification } = useNotification();
  const navigate = useNavigate();
  
  // Function to fetch tables from API
// pages/TableSelectionPage.jsx
// Update the fetchTables function

const fetchTables = useCallback(async () => {
  try {
    setLoading(true);
    // Use the complete URL to your backend API
    const response = await axios.get('https://retro-restro.onrender.com/api/tables');
    
    console.log('API Response:', response.data);
    
    // Ensure we have an array of tables
    const tablesData = Array.isArray(response.data) ? response.data : [];
    setTables(tablesData);
    setError(null);
  } catch (error) {
    console.error('Error fetching tables:', error);
    
    // Create dummy tables for development if API fails
    const dummyTables = [
      { _id: '1', tableNumber: 1, capacity: 2, isOccupied: false },
      { _id: '2', tableNumber: 2, capacity: 4, isOccupied: true },
      { _id: '3', tableNumber: 3, capacity: 6, isOccupied: false },
      { _id: '4', tableNumber: 4, capacity: 2, isOccupied: false },
      { _id: '5', tableNumber: 5, capacity: 8, isOccupied: true },
      { _id: '6', tableNumber: 6, capacity: 4, isOccupied: false },
    ];
    
    setTables(dummyTables);
    setError('Using demo data. API connection failed: ' + (error.message || 'Unknown error'));
    addNotification('Using demo tables. API connection failed.', 'warning');
  } finally {
    setLoading(false);
  }
}, [addNotification]);

  useEffect(() => {
    // Initial fetch of tables
    fetchTables();
    
    // Join restaurant room for real-time updates
    joinRestaurant();
    
    // Subscribe to table updates
    const unsubscribe = onTableUpdate((updatedTable) => {
      setTables(prevTables => {
        if (!Array.isArray(prevTables)) return [];
        
        return prevTables.map(table => 
          table.tableNumber === updatedTable.tableNumber 
            ? { ...table, isOccupied: updatedTable.isOccupied } 
            : table
        );
      });
      
      // Show notification for table updates
      addNotification(
        `Table ${updatedTable.tableNumber} is now ${updatedTable.isOccupied ? 'occupied' : 'available'}!`, 
        updatedTable.isOccupied ? 'warning' : 'success'
      );
    });
    
    // Clean up on component unmount
    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [addNotification, fetchTables]);
  
  const handleTableClick = (table) => {
    if (table.isOccupied) {
      addNotification('This table is already occupied!', 'error');
      return;
    }
    
    setTableNumber(table.tableNumber.toString());
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!tableNumber || isNaN(tableNumber) || tableNumber < 1) {
      addNotification('Please select a valid table', 'error');
      return;
    }
    
    setSubmitting(true);
    
    try {
      const tableNum = parseInt(tableNumber);
      
      // Update table status in backend
      try {
        await axios.put(`/api/tables/${tableNum}`, { isOccupied: true });
      } catch (apiError) {
        console.error('API error when updating table:', apiError);
        // Continue with local updates even if API fails
      }
      
      // Update table info in context
      setTableInfo({ tableNumber: tableNum });
      
      // Emit socket event for real-time updates
      emitTableSelection({ tableNumber: tableNum, isOccupied: true });
      
      // Update local state
      setTables(prevTables => {
        if (!Array.isArray(prevTables)) return [];
        
        return prevTables.map(table => 
          table.tableNumber === tableNum 
            ? { ...table, isOccupied: true } 
            : table
        );
      });
      
      addNotification(`Table ${tableNum} selected successfully`, 'success');
      navigate('/menu');
    } catch (error) {
      console.error('Error selecting table:', error);
      addNotification('Failed to select table. Please try again.', 'error');
    } finally {
      setSubmitting(false);
    }
  };
  
  const handleRetry = () => {
    setError(null);
    fetchTables();
  };
  
  // Loading state
  if (loading) {
    return (
      <div className="retro-table-container">
        <div className="retro-crt-effect">
          <div className="retro-loading">
            <div className="retro-loading-text">LOADING TABLES...</div>
            <div className="retro-loading-animation">
              <div className="retro-loading-bar"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="retro-table-container">
      <div className="retro-crt-effect">
        <div className="retro-scanlines"></div>
        <div className="retro-flicker"></div>
        
        {error && (
          <div className="retro-warning">
            <div className="retro-warning-message">{error}</div>
            <button onClick={handleRetry} className="retro-warning-button">RETRY CONNECTION</button>
          </div>
        )}
        
        <div className="retro-header">
          <div className="retro-title-container">
            <h1 className="retro-neon-title">SELECT YOUR TABLE</h1>
          </div>
          <div className="retro-blink-text">CHOOSE AN AVAILABLE TABLE</div>
        </div>
        
        <div className="retro-diner-layout">
          {tables.length === 0 ? (
            <div className="retro-no-tables">NO TABLES AVAILABLE</div>
          ) : (
            <div className="retro-tables-grid">
              {tables.map((table) => (
                <div 
                  key={table._id || table.tableNumber}
                  className={`retro-table ${table.isOccupied ? 'occupied' : 'available'} ${parseInt(tableNumber) === table.tableNumber ? 'selected' : ''}`}
                  onClick={() => handleTableClick(table)}
                >
                  <div className="table-number">{table.tableNumber}</div>
                  <div className="table-capacity">SEATS: {table.capacity || '?'}</div>
                  <div className="table-status">{table.isOccupied ? 'OCCUPIED' : 'AVAILABLE'}</div>
                </div>
              ))}
            </div>
          )}
          
          <div className="retro-legend">
            <div className="legend-item">
              <div className="legend-color available"></div>
              <span>AVAILABLE</span>
            </div>
            <div className="legend-item">
              <div className="legend-color occupied"></div>
              <span>OCCUPIED</span>
            </div>
            <div className="legend-item">
              <div className="legend-color selected"></div>
              <span>SELECTED</span>
            </div>
          </div>
        </div>
        
        <form onSubmit={handleSubmit} className="retro-form">
          <div className="form-group">
            <label htmlFor="tableNumber" className="retro-label">YOUR TABLE #</label>
            <input
              type="number"
              id="tableNumber"
              value={tableNumber}
              onChange={(e) => setTableNumber(e.target.value)}
              className="retro-input"
              placeholder="CLICK A TABLE OR ENTER NUMBER"
              required
              min="1"
              disabled={submitting}
            />
          </div>
          
          <button
            type="submit"
            className={`retro-button ${submitting ? 'disabled' : ''}`}
            disabled={submitting || !tableNumber}
          >
            {submitting ? 'PROCESSING...' : 'CONFIRM TABLE'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default TableSelectionPage;
