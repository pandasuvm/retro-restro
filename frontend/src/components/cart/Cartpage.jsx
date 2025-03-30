// pages/CartPage.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useOrder } from '../../context/orderContext';
import { useNotification } from '../../context/NotificationContext';
import '../../styles/RetroCart.css';

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
    <div className="retro-cart-container">
      <div className="retro-grid-background"></div>
      
      <div className="retro-cart-content">
        <div className="retro-cart-header">
          <h1 className="retro-cart-title">YOUR CART</h1>
          <div className="retro-cart-subtitle">TOTALLY RADICAL SELECTIONS</div>
        </div>

        {items.length === 0 ? (
          <div className="retro-empty-cart">
            <div className="retro-empty-cart-icon"></div>
            <p className="retro-empty-cart-text">YOUR CART IS EMPTY</p>
            <p className="retro-empty-cart-subtext">Add some awesome food to continue!</p>
            <button 
              onClick={() => navigate('/menu')}
              className="retro-button retro-secondary-button"
            >
              RETURN TO MENU
            </button>
          </div>
        ) : (
          <>
            <div className="retro-cart-items">
              <div className="retro-cart-items-header">
                <div className="retro-cart-item-name">ITEM</div>
                <div className="retro-cart-item-price">PRICE</div>
                <div className="retro-cart-item-action">ACTION</div>
              </div>
              
              {items.map((item) => (
                <div key={item._id} className="retro-cart-item">
                  <div className="retro-cart-item-name">
                    <div className="retro-cart-item-icon"></div>
                    {item.name}
                  </div>
                  <div className="retro-cart-item-price">
                    ${item.price ? item.price.toFixed(2) : '0.00'}
                  </div>
                  <div className="retro-cart-item-action">
                    <button
                      onClick={() => removeItem(item._id)}
                      className="retro-remove-button"
                      aria-label={`Remove ${item.name} from cart`}
                    >
                      REMOVE
                    </button>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="retro-cart-summary">
              <div className="retro-cart-total">
                <div className="retro-cart-total-label">TOTAL:</div>
                <div className="retro-cart-total-amount">${totalAmount.toFixed(2)}</div>
              </div>
              
              <div className="retro-cart-actions">
                <button
                  onClick={() => navigate('/menu')}
                  className="retro-button retro-secondary-button"
                >
                  ADD MORE ITEMS
                </button>
                
                <button
                  onClick={handleCheckout}
                  disabled={isProcessing}
                  className={`retro-button retro-primary-button ${isProcessing ? 'processing' : ''}`}
                >
                  {isProcessing ? 'PROCESSING...' : 'CHECKOUT NOW'}
                </button>
              </div>
            </div>
            
            <div className="retro-cart-note">
              <div className="retro-cart-note-icon">!</div>
              <p>Orders will be prepared for your selected table. Payment will be collected upon delivery.</p>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default CartPage;
