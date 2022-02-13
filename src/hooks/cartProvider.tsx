import React, {
  createContext,
  useContext,
  useRef,
  useEffect,
  useState,
} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { Cart } from '../models/cart';
import { ProdutoDTO } from '../models/produto.dto';

type Props = {
  children: React.ReactNode;
};

type ReturnContext = {
  cart: Cart;
  insertProduct: Function;
  removeProduct: Function;
  totalRemove: Function;
  createOrClearCart: Function;
};

const CartContext = createContext<ReturnContext | undefined>(undefined);

const CartProvider = ({ children }: Props) => {
  const [cart, setCart] = useState<Cart>({ items: [] });
  const isMounted = useRef<boolean>(true);

  useEffect(() => {
    const loadStorageData = async (): Promise<void> => {
      const saved_cart: string | null = await AsyncStorage.getItem('@csa:cart');

      if (saved_cart) {
        const deserialized_cart: Cart = JSON.parse(saved_cart);
        if (!isMounted.current) {
          return;
        }
        setCart(deserialized_cart);
      } else {
        createOrClearCart();
      }
    };

    loadStorageData();

    return () => {
      isMounted.current = false;
    };
  }, []);

  const insertProduct = async (product: ProdutoDTO): Promise<void> => {
    const saved_cart: string | null = await AsyncStorage.getItem('@csa:cart');
    let deserialized_cart: Cart;

    if (saved_cart) {
      deserialized_cart = JSON.parse(saved_cart);

      const index = deserialized_cart.items.findIndex(
        item => item.produto.id === product.id,
      );

      if (index === -1) {
        deserialized_cart.items.push({ quantidade: 1, produto: product });
      } else {
        deserialized_cart.items[index].quantidade =
          deserialized_cart.items[index].quantidade + 1;
      }
    } else {
      deserialized_cart = {
        items: [],
      };
      deserialized_cart.items.push({ quantidade: 1, produto: product });
    }

    if (!isMounted.current) {
      return;
    }
    setCart(deserialized_cart);
    await AsyncStorage.setItem('@csa:cart', JSON.stringify(deserialized_cart));
  };

  const removeProduct = async (product: ProdutoDTO): Promise<void> => {
    const saved_cart: string | null = await AsyncStorage.getItem('@csa:cart');
    let deserialized_cart: Cart;

    if (saved_cart) {
      deserialized_cart = JSON.parse(saved_cart);

      const index = deserialized_cart.items.findIndex(
        item => item.produto.id === product.id,
      );

      if (index > -1) {
        if (deserialized_cart.items[index].quantidade === 1) {
          deserialized_cart.items.splice(index, 1);
        } else {
          deserialized_cart.items[index].quantidade =
            deserialized_cart.items[index].quantidade - 1;
        }

        if (!isMounted.current) {
          return;
        }
        setCart(deserialized_cart);
        await AsyncStorage.setItem(
          '@csa:cart',
          JSON.stringify(deserialized_cart),
        );
      }
    }
  };

  const totalRemove = async (product: ProdutoDTO): Promise<void> => {
    const saved_cart: string | null = await AsyncStorage.getItem('@csa:cart');
    let deserialized_cart: Cart;

    if (saved_cart) {
      deserialized_cart = JSON.parse(saved_cart);

      const index = deserialized_cart.items.findIndex(
        item => item.produto.id === product.id,
      );

      if (index > -1) {
        deserialized_cart.items.splice(index, 1);

        if (!isMounted.current) {
          return;
        }
        setCart(deserialized_cart);
        await AsyncStorage.setItem(
          '@csa:cart',
          JSON.stringify(deserialized_cart),
        );
      }
    }
  };

  const createOrClearCart = async (): Promise<void> => {
    if (!isMounted.current) {
      return;
    }
    const deserialized_cart: Cart = { items: [] };

    setCart(deserialized_cart);
    await AsyncStorage.setItem('@csa:cart', JSON.stringify(deserialized_cart));
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        insertProduct,
        removeProduct,
        totalRemove,
        createOrClearCart,
      }}>
      {children}
    </CartContext.Provider>
  );
};

const UseCart = () => {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error('UseCart: No AuthContext');
  }

  return context;
};

export { CartProvider, UseCart };
