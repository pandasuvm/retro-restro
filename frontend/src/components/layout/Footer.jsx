// components/layout/Footer.jsx
const Footer = () => {
    return (
      <footer className="bg-gray-800 text-white py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <h3 className="text-xl font-bold">Retro Diner</h3>
              <p className="text-gray-400">Experience the taste of nostalgia</p>
            </div>
            
            <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-6">
              <div>
                <h4 className="font-bold mb-2">Hours</h4>
                <p className="text-gray-400">Mon-Fri: 11am - 10pm</p>
                <p className="text-gray-400">Sat-Sun: 10am - 11pm</p>
              </div>
              
              <div>
                <h4 className="font-bold mb-2">Contact</h4>
                <p className="text-gray-400">123 Retro Street</p>
                <p className="text-gray-400">Phone: (555) 123-4567</p>
              </div>
            </div>
          </div>
          
          <div className="mt-8 pt-4 border-t border-gray-700 text-center text-gray-400">
            <p>© {new Date().getFullYear()} Retro Diner. All rights reserved.</p>
          </div>
        </div>
      </footer>
    );
  };
  
  export default Footer;
  