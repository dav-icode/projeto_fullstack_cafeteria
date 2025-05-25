import { createContext, useContext, useReducer, useEffect } from 'react';
import toast from 'react-hot-toast';

const CartContext = createContext();

const cartReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_ITEM': {
      const existingItem = state.items.find(item => item.id === action.payload.id);
      
      if (existingItem) {
        const updatedItems = state.items.map(item =>
          item.id === action.payload.id
            ? { ...item, quantidade: item.quantidade + 1 }
            : item
        );
        return { ...state, items: updatedItems };
      } else {
        return {
          ...state,
          items: [...state.items, { ...action.payload, quantidade: 1 }]
        };
      }
    }
    
    case 'REMOVE_ITEM': {
      return {
        ...state,
        items: state.items.filter(item => item.id !== action.payload)
      };
    }
    
    case 'UPDATE_QUANTITY': {
      const updatedItems = state.items.map(item =>
        item.id === action.payload.id
          ? { ...item, quantidade: Math.max(0, action.payload.quantidade) }
          : item
      ).filter(item => item.quantidade > 0);
      
      return { ...state, items: updatedItems };
    }
    
    case 'CLEAR_CART': {
      return { ...state, items: [] };
    }
    
    case 'LOAD_CART': {
      return { ...state, items: action.payload };
    }
    
    default:
      return state;
  }
};

export const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, { items: [] });

  // Carregar carrinho do localStorage ao inicializar
  useEffect(() => {
    const savedCart = localStorage.getItem('cafeteria_cart');
    if (savedCart) {
      try {
        const parsedCart = JSON.parse(savedCart);
        dispatch({ type: 'LOAD_CART', payload: parsedCart });
      } catch (error) {
        console.error('Erro ao carregar carrinho:', error);
      }
    }
  }, []);

  // Salvar carrinho no localStorage sempre que mudar
  useEffect(() => {
    localStorage.setItem('cafeteria_cart', JSON.stringify(state.items));
  }, [state.items]);

  const addItem = (produto) => {
    dispatch({ type: 'ADD_ITEM', payload: produto });
    toast.success(`${produto.nome} adicionado ao carrinho!`);
  };

  const removeItem = (produtoId) => {
    const item = state.items.find(item => item.id === produtoId);
    dispatch({ type: 'REMOVE_ITEM', payload: produtoId });
    if (item) {
      toast.success(`${item.nome} removido do carrinho!`);
    }
  };

  const updateQuantity = (produtoId, quantidade) => {
    dispatch({ 
      type: 'UPDATE_QUANTITY', 
      payload: { id: produtoId, quantidade } 
    });
  };

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
    toast.success('Carrinho limpo!');
  };

  const getCartTotal = () => {
    return state.items.reduce((total, item) => {
      return total + (item.preco * item.quantidade);
    }, 0);
  };

  const getCartItemsCount = () => {
    return state.items.reduce((count, item) => count + item.quantidade, 0);
  };

  const value = {
    items: state.items,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    getCartTotal,
    getCartItemsCount
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart deve ser usado dentro de um CartProvider');
  }
  return context;
};