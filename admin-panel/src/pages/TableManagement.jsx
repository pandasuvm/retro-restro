import { useState, useEffect } from 'react';
import axios from 'axios';

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
  
  if (loading) return <div className="flex justify-center items-center h-full">Loading...</div>;
  if (error) return <div className="text-red-500">{error}</div>;
  
  return (
    <div className="container mx-auto px-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-800">Table Management</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
        >
          {showForm ? 'Cancel' : 'Add New Table'}
        </button>
      </div>
      
      {showForm && (
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Add New Table</h2>
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Table Number
                </label>
                <input
                  type="number"
                  name="tableNumber"
                  value={formData.tableNumber}
                  onChange={handleInputChange}
                  required
                  min="1"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Capacity
                </label>
                <input
                  type="number"
                  name="capacity"
                  value={formData.capacity}
                  onChange={handleInputChange}
                  required
                  min="1"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
            
            <div className="mt-6 flex justify-end">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="bg-gray-200 text-gray-700 px-4 py-2 rounded mr-2"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
              >
                Add Table
              </button>
            </div>
          </form>
        </div>
      )}
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {tables.map((table) => (
          <div key={table._id} className={`bg-white rounded-lg shadow p-4 border-l-4 ${table.isOccupied ? 'border-red-500' : 'border-green-500'}`}>
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-semibold text-gray-800">Table {table.tableNumber}</h3>
                <p className="text-sm text-gray-600">Capacity: {table.capacity} people</p>
                <p className={`text-sm font-medium ${table.isOccupied ? 'text-red-600' : 'text-green-600'}`}>
                  {table.isOccupied ? 'Occupied' : 'Available'}
                </p>
                {table.currentOrder && (
  <p className="text-sm text-gray-600 mt-1">
    Current Order: {table.currentOrder._id ? table.currentOrder._id.substring(0, 8) : 'N/A'}
  </p>
)}

              </div>
              
              <div>
                <select
                  value={table.isOccupied ? 'occupied' : 'available'}
                  onChange={(e) => handleStatusUpdate(table.tableNumber, e.target.value === 'occupied')}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="available">Available</option>
                  <option value="occupied">Occupied</option>
                </select>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TableManagement;
