// pages/HomePage.jsx
import { Link } from 'react-router-dom';

const HomePage = () => {
  return (
    <div className="container mx-auto px-4">
      {/* Hero Section */}
      <section className="py-12 md:py-20">
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">Welcome to Retro Diner</h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Experience the nostalgic flavors of the 80s and 90s in our retro-themed restaurant.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link 
              to="/menu" 
              className="bg-blue-600 text-white px-6 py-3 rounded-md text-lg font-medium hover:bg-blue-700 transition-colors"
            >
              View Menu
            </Link>
            <Link 
              to="/table-selection" 
              className="bg-gray-200 text-gray-800 px-6 py-3 rounded-md text-lg font-medium hover:bg-gray-300 transition-colors"
            >
              Select Table
            </Link>
          </div>
        </div>
      </section>
      
      {/* Featured Items */}
      <section className="py-12 bg-gray-50 rounded-lg my-12">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold">Featured Items</h2>
          <p className="text-gray-600 mt-2">Our most popular dishes that customers love</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              name: 'Classic Burger',
              description: 'Juicy beef patty with lettuce, tomato, and our special sauce',
              price: 8.99,
              image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'
            },
            {
              name: 'Cheese Fries',
              description: 'Crispy fries topped with melted cheese and bacon bits',
              price: 4.99,
              image: 'https://images.unsplash.com/photo-1585109649139-366815a0d713?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'
            },
            {
              name: 'Chocolate Shake',
              description: 'Creamy chocolate milkshake topped with whipped cream',
              price: 3.99,
              image: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'
            }
          ].map((item, index) => (
            <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden">
              <img 
                src={item.image} 
                alt={item.name} 
                className="w-full h-48 object-cover"
              />
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2">{item.name}</h3>
                <p className="text-gray-600 mb-4">{item.description}</p>
                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold">${item.price.toFixed(2)}</span>
                  <Link 
                    to="/menu" 
                    className="text-blue-600 hover:text-blue-800"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
      
      {/* About Section */}
      <section className="py-12 my-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold mb-6">Our Story</h2>
            <p className="text-gray-600 mb-4">
              Retro Diner was founded in 2020 with a simple mission: to bring back the nostalgic flavors and atmosphere of the 80s and 90s diners that we all loved.
            </p>
            <p className="text-gray-600 mb-4">
              Our restaurant combines classic American comfort food with a retro aesthetic that will transport you back in time. From neon lights to vintage arcade games, we've created an immersive experience that celebrates the golden era of diners.
            </p>
            <p className="text-gray-600">
              Whether you're reliving memories or experiencing it for the first time, we welcome you to Retro Diner!
            </p>
          </div>
          <div className="bg-gray-200 h-80 rounded-lg flex items-center justify-center">
            <span className="text-gray-500">Restaurant Image</span>
          </div>
        </div>
      </section>
      
      {/* Hours & Location */}
      <section className="py-12 bg-gray-50 rounded-lg my-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="p-6">
            <h2 className="text-2xl font-bold mb-4">Hours</h2>
            <ul className="space-y-2">
              <li className="flex justify-between">
                <span>Monday - Friday</span>
                <span>11:00 AM - 10:00 PM</span>
              </li>
              <li className="flex justify-between">
                <span>Saturday</span>
                <span>10:00 AM - 11:00 PM</span>
              </li>
              <li className="flex justify-between">
                <span>Sunday</span>
                <span>10:00 AM - 9:00 PM</span>
              </li>
            </ul>
          </div>
          <div className="p-6">
            <h2 className="text-2xl font-bold mb-4">Location</h2>
            <p className="mb-2">123 Retro Street</p>
            <p className="mb-2">Nostalgia City, NC 28801</p>
            <p className="mb-4">Phone: (555) 123-4567</p>
            <button className="text-blue-600 hover:text-blue-800">
              Get Directions
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
