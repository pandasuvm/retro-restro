import React, { useEffect, useState } from "react";
import axios from "axios";

const Home = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:3000/products").then(res => setProducts(res.data));
  }, []);

  return (
    <div className="bg-yellow-100 min-h-screen p-5">
      <h1 className="text-4xl font-bold text-center">Retro E-Commerce</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-5">
        {products.map(product => (
          <div key={product._id} className="bg-white p-5 rounded shadow-lg">
            <img src={product.image} alt={product.name} className="w-full h-40 object-cover rounded" />
            <h2 className="text-2xl mt-2">{product.name}</h2>
            <p className="text-lg">${product.price}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
