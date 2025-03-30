import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useOrder } from '../../context/orderContextrderContext';
import { useNotification } from '../../context/NotificationContext';
import { emitTableSelection } from '../../services/SocketService';
import { updateTableStatus } from '../../services/api';

const TableSelection = () => {
  const [tableNum, setTableNum] = useState('');
  const [loading, setLoading] = useState(false);
  const { setTableInfo } = useOrder();
  const { addNotification } = useNotification();
  const navigate = useNavigate();
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!tableNum || isNaN(tableNum) || tableNum < 1) {
      addNotification('Please enter a valid table number', 'error');
      return;
    }
    
    setLoading(true);
    
    try {
      const tableNumber = parseInt(tableNum);
      
      // Update table status in database
      await updateTableStatus(tableNumber, true);
      
      // Emit socket event for real-time updates
      emitTableSelection({ tableNumber });
      
      // Update local state
      setTableInfo({ tableNumber });
      
      addNotification(`Table ${tableNumber} selected successfully`, 'success');
      navigate('/menu');
    } catch (error) {
      console.error('Error selecting table:', error);
      addNotification('Failed to select table. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Select Your Table</h1>
      <form onSubmit={handleSubmit} className="max-w-md">
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Table Number</label>
          <input 
            type="number" 
            value={tableNum} 
            onChange={(e) => setTableNum(e.target.value)}
            className="w-full p-2 border rounded"
            required
            min="1"
            disabled={loading}
          />
        </div>
        <button 
          type="submit"
          className={`bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
          disabled={loading}
        >
          {loading ? 'Processing...' : 'Confirm Table'}
        </button>
      </form>
    </div>
  );
};

export default TableSelection;
