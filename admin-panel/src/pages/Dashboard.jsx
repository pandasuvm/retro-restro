import { useState, useEffect } from 'react';
import axios from 'axios';

const Dashboard = ({ apiUrl, socket }) => {
  const [stats, setStats] = useState({
    totalOrders: 0,
    revenue: 0,
    pendingOrders: 0,
  });
  const [popularItems, setPopularItems] = useState([]);
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        
        // Fetch all orders
        const ordersResponse = await axios.get(`${apiUrl}/orders`);
        const orders = ordersResponse.data;
        
        // Calculate stats
        const totalOrders = orders.length;
        const revenue = orders.reduce((sum, order) => sum + order.totalAmount, 0);
        const pendingOrders = orders.filter(order => order.status === 'Pending').length;
        
        setStats({
          totalOrders,
          revenue,
          pendingOrders,
        });
        
        // Get recent orders
        const recentOrdersData = orders
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          .slice(0, 5)
          .map(order => ({
            id: order._id,
            tableNumber: order.tableNumber,
            status: order.status,
            totalAmount: order.totalAmount,
            createdAt: new Date(order.createdAt).toLocaleString(),
          }));
        
        setRecentOrders(recentOrdersData);
        
        // Calculate popular items
        const itemCounts = {};
        orders.forEach(order => {
          order.items.forEach(item => {
            const itemId = item.menuItem._id || item.menuItem;
            const itemName = item.menuItem.name || 'Unknown Item';
            if (!itemCounts[itemId]) {
              itemCounts[itemId] = { name: itemName, count: 0 };
            }
            itemCounts[itemId].count += item.quantity;
          });
        });
        
        const popularItemsData = Object.values(itemCounts)
          .sort((a, b) => b.count - a.count)
          .slice(0, 5);
        
        setPopularItems(popularItemsData);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError('Failed to load dashboard data');
        setLoading(false);
      }
    };
    
    fetchDashboardData();
    
    // Listen for real-time updates
    socket.on('new_order', () => {
      fetchDashboardData();
    });
    
    socket.on('status_update', () => {
      fetchDashboardData();
    });
    
    return () => {
      socket.off('new_order');
      socket.off('status_update');
    };
  }, [apiUrl, socket]);
  
  if (loading) return <div className="flex justify-center items-center h-full">Loading...</div>;
  if (error) return <div className="text-red-500">{error}</div>;
  
  return (
    <div className="container mx-auto px-4">
      <h1 className="text-2xl font-semibold text-gray-800 mb-6">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100 text-blue-500">
              <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path>
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-500">Total Orders</p>
              <p className="text-2xl font-semibold text-gray-800">{stats.totalOrders}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100 text-green-500">
              <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-500">Revenue</p>
              <p className="text-2xl font-semibold text-gray-800">${stats.revenue.toFixed(2)}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-yellow-100 text-yellow-500">
              <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-500">Pending Orders</p>
              <p className="text-2xl font-semibold text-gray-800">{stats.pendingOrders}</p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="bg-white rounded-lg shadow lg:col-span-2">
          <div className="px-6 py-4 border-b">
            <h2 className="text-lg font-semibold text-gray-800">Recent Orders</h2>
          </div>
          <div className="p-4 overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Table</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
  {recentOrders.map((order) => (
    <tr key={order.id}>
      <td className="px-4 py-3 whitespace-nowrap">
        <div className="text-sm text-gray-900">{order.id.substring(0, 8)}</div>
      </td>
      <td className="px-4 py-3 whitespace-nowrap">
        <div className="text-sm text-gray-900">Table {order.tableNumber}</div>
      </td>
      <td className="px-4 py-3 whitespace-nowrap">
        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full 
          ${order.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' : 
            order.status === 'Preparing' ? 'bg-blue-100 text-blue-800' : 
            order.status === 'Ready' ? 'bg-green-100 text-green-800' : 
            order.status === 'Served' ? 'bg-purple-100 text-purple-800' : 
            'bg-gray-100 text-gray-800'}`}
        >
          {order.status}
        </span>
      </td>
      <td className="px-4 py-3 whitespace-nowrap">
        <div className="text-sm text-gray-900">${order.totalAmount.toFixed(2)}</div>
      </td>
      <td className="px-4 py-3 whitespace-nowrap">
        <div className="text-sm text-gray-500">{order.createdAt}</div>
      </td>
    </tr>
  ))}
</tbody>
              </table>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b">
              <h2 className="text-lg font-semibold text-gray-800">Popular Items</h2>
            </div>
            <div className="p-4">
              <ul className="divide-y divide-gray-200">
                {popularItems.map((item, index) => (
                  <li key={index} className="py-3 flex justify-between items-center">
                    <div className="flex items-center">
                      <span className="text-gray-800">{index + 1}.</span>
                      <span className="ml-2 text-gray-800">{item.name}</span>
                    </div>
                    <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded">
                      {item.count} orders
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      
    </div>
  );
};

export default Dashboard;

   