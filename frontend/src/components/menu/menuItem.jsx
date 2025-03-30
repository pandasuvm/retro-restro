import { useCart } from '../../context/CartContext';

const MenuItem = ({ item }) => {
  const { addItem } = useCart();

  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <h3 className="font-bold text-lg mb-2">{item.name}</h3>
      <p className="text-gray-600 mb-2">{item.description}</p>
      <p className="text-green-600 font-bold mb-4">${item.price.toFixed(2)}</p>
      <button
        onClick={() => addItem(item)}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        Add to Cart
      </button>
    </div>
  );
};

export default MenuItem;
