import { createContext, useContext, useReducer, useEffect } from 'react';

const CartContext = createContext();

const initialState = {
  items: [],
  totalAmount: 0,
  totalItems: 0
};

function cartReducer(state, action) {
  switch (action.type) {
    case 'ADD_ITEM': {
      const existingItemIndex = state.items.findIndex(
        item => item._id === action.payload._id
      );
      
      let updatedItems;
      
      if (existingItemIndex >= 0) {
        updatedItems = [...state.items];
        updatedItems[existingItemIndex] = {
          ...updatedItems[existingItemIndex],
          quantity: updatedItems[existingItemIndex].quantity + 1
        };
      } else {
        updatedItems = [...state.items, { ...action.payload, quantity: 1 }];
      }
      
      const totalAmount = updatedItems.reduce(
        (sum, item) => sum + item.price * item.quantity, 
        0
      );
      
      const totalItems = updatedItems.reduce(
        (sum, item) => sum + item.quantity, 
        0
      );
      
      return {
        items: updatedItems,
        totalAmount,
        totalItems
      };
    }
    
    case 'REMOVE_ITEM': {
      const existingItemIndex = state.items.findIndex(
        item => item._id === action.payload
      );
      
      if (existingItemIndex < 0) return state;
      
      let updatedItems;
      
      if (state.items[existingItemIndex].quantity === 1) {
        updatedItems = state.items.filter(item => item._id !== action.payload);
      } else {
        updatedItems = [...state.items];
        updatedItems[existingItemIndex] = {
          ...updatedItems[existingItemIndex],
          quantity: updatedItems[existingItemIndex].quantity - 1
        };
      }
      
      const totalAmount = updatedItems.reduce(
        (sum, item) => sum + item.price * item.quantity, 
        0
      );
      
      const totalItems = updatedItems.reduce(
        (sum, item) => sum + item.quantity, 
        0
      );
      
      return {
        items: updatedItems,
        totalAmount,
        totalItems
      };
    }
    
    case 'CLEAR_CART':
      return initialState;
      
    case 'LOAD_CART':
      return action.payload;
      
    default:
      return state;
  }
}

export function CartProvider({ children }) {
  const [cartState, dispatch] = useReducer(cartReducer, initialState);
  
  useEffect(() => {
    const savedCart = localStorage.getItem('retroRestaurantCart');
    if (savedCart) {
      try {
        const parsedCart = JSON.parse(savedCart);
        dispatch({ type: 'LOAD_CART', payload: parsedCart });
      } catch (error) {
        console.error('Failed to parse saved cart', error);
      }
    }
  }, []);
  
  useEffect(() => {
    localStorage.setItem('retroRestaurantCart', JSON.stringify(cartState));
  }, [cartState]);
  
  const addItem = (item) => {
    dispatch({ type: 'ADD_ITEM', payload: item });
  };
  
  const removeItem = (itemId) => {
    dispatch({ type: 'REMOVE_ITEM', payload: itemId });
  };
  
  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
  };
  
  const value = {
    ...cartState,
    addItem,
    removeItem,
    clearCart
  };
  
  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
