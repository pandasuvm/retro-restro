// pages/TableSelectionPage.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useOrder } from '../context/orderContext';
import { useNotification } from '../context/NotificationContext';
import { emitTableSelection } from '../services/SocketService';

const TableSelectionPage = () => {
  const [tableNumber, setTableNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const { setTableInfo } = useOrder();
  const { addNotification } = useNotification();
  const navigate = useNavigate();
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!tableNumber || isNaN(tableNumber) || tableNumber < 1) {
      addNotification('Please enter a valid table number', 'error');
      return;
    }
    
    setLoading(true);
    
    try {
      const tableNum = parseInt(tableNumber);
      
      // Update table info in context
      setTableInfo({ tableNumber: tableNum });
      
      // Emit socket event for real-time updates
      emitTableSelection({ tableNumber: tableNum });
      
      addNotification(`Table ${tableNum} selected successfully`, 'success');
      navigate('/menu');
    } catch (error) {
      console.error('Error selecting table:', error);
      addNotification('Failed to select table. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-center">Select Your Table</h1>
      
      <div className="bg-white rounded-lg shadow-md p-6">
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="tableNumber" className="block text-gray-700 mb-2">
              Table Number
            </label>
            <input
              type="number"
              id="tableNumber"
              value={tableNumber}
              onChange={(e) => setTableNumber(e.target.value)}
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
              min="1"
              disabled={loading}
            />
          </div>
          
          <button
            type="submit"
            className={`w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition-colors ${
              loading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            disabled={loading}
          >
            {loading ? 'Processing...' : 'Confirm Table'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default TableSelectionPage;
