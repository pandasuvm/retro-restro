import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useOrder } from '../../context/orderContext';
import { useNotification } from '../../context/NotificationContext';

const CartPage = () => {
  const { items, totalAmount, removeItem, clearCart } = useCart();
  const { placeOrder } = useOrder();
  const { addNotification } = useNotification();
  const [isProcessing, setIsProcessing] = useState(false);
  const navigate = useNavigate();

  const handleCheckout = async () => {
    if (!items.length) {
      addNotification('Your cart is empty', 'error');
      return;
    }

    setIsProcessing(true);
    try {
      const order = await placeOrder(items, totalAmount);
      clearCart();
      addNotification('Order placed successfully', 'success');
      navigate(`/orders/${order._id}`);
    } catch (error) {
      addNotification('Failed to place order', 'error');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Your Cart</h1>
      {items.length === 0 ? (
        <p className="text-gray-600">Your cart is empty.</p>
      ) : (
        <>
          {items.map((item) => (
            <div key={item._id} className="flex justify-between items-center mb-4 p-4 bg-white rounded-lg shadow">
              <div>
                <h3 className="font-bold">{item.name}</h3>
                <p className="text-gray-600">${item.price ? item.price.toFixed(2) : '0.00'}</p>
              </div>
              <button
                onClick={() => removeItem(item._id)}
                className="text-red-500 hover:text-red-700"
              >
                Remove
              </button>
            </div>
          ))}
          <div className="mt-8">
            <p className="text-xl font-bold">Total: ${totalAmount.toFixed(2)}</p>
            <button
              onClick={handleCheckout}
              disabled={isProcessing}
              aria-disabled={isProcessing}
              className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
            >
              {isProcessing ? 'Processing...' : 'Checkout'}
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default CartPage;
