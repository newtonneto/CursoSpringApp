import React, {
  createContext,
  useContext,
  useRef,
  useEffect,
  useState,
} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { Cart, CartItem } from '../models/cart';

type Props = {
  children: React.ReactNode;
};

type ReturnContext = {
  cart: Cart;
  loadingCart: boolean;
  insertProduct: Function;
  removeProduct: Function;
};

const CartContext = createContext<ReturnContext | undefined>(undefined);

const CartProvider = ({ children }: Props) => {
  const [cart, setCart] = useState<Cart>({} as Cart);
  const [loadingCart, setLoadingCart] = useState<boolean>(false);
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
      }
    };

    loadStorageData();

    return () => {
      isMounted.current = false;
    };
  }, []);

  const insertProduct = async (item: CartItem): Promise<void> => {
    const saved_cart: string | null = await AsyncStorage.getItem('@csa:cart');
    let deserialized_cart: Cart;
    if (saved_cart) {
      deserialized_cart = JSON.parse(saved_cart);
      deserialized_cart.items.push(item);
    } else {
      deserialized_cart = {
        items: [],
      };
      deserialized_cart.items.push(item);
    }

    if (!isMounted.current) {
      return;
    }
    setCart(deserialized_cart);
    await AsyncStorage.setItem('@csa:cart', JSON.stringify(deserialized_cart));
  };

  const removeProduct = async (id: number): Promise<void> => {
    if (id > -1) {
      if (!isMounted.current) {
        return;
      }
      setLoadingCart(true);

      const saved_cart: string | null = await AsyncStorage.getItem('@csa:cart');

      if (saved_cart) {
        const deserialized_cart: Cart = JSON.parse(saved_cart);

        if (deserialized_cart.items[id].quantidade === 1) {
          deserialized_cart.items.splice(id, 1);
        } else {
          deserialized_cart.items[id].quantidade =
            deserialized_cart.items[id].quantidade - 1;
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

      if (!isMounted.current) {
        return;
      }
      setLoadingCart(false);
    }
  };

  return (
    <CartContext.Provider
      value={{ cart, loadingCart, insertProduct, removeProduct }}>
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
