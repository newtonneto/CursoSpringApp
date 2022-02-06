import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useRef,
  useCallback,
} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import jwt_decode from 'jwt-decode';

type Props = {
  children: React.ReactNode;
};

type ReturnContext = {
  token: string;
  setToken: Function;
  email: string;
  handlerToken: Function;
  logout: Function;
};

type Token = {
  sub: string;
  exp: string;
};

//const AuthContext = createContext<ReturnContext>({} as ReturnContext);
const AuthContext = createContext<ReturnContext | undefined>(undefined);

const AuthProvider = ({ children }: Props) => {
  const [token, setToken] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const isMounted = useRef<boolean>(true);

  useEffect(() => {
    const loadStorageData = async () => {
      const saved_token: string | null = await AsyncStorage.getItem('@csa:jwt');
      const saved_email: string | null = await AsyncStorage.getItem(
        '@csa:email',
      );

      if (saved_token && saved_email) {
        if (!isMounted.current) {
          return;
        }
        setToken(saved_token);
        if (!isMounted.current) {
          return;
        }
        setEmail(saved_email);
      }
    };

    loadStorageData();

    return () => {
      isMounted.current = false;
    };
  }, []);

  const handlerToken = useCallback(async (jwt): Promise<void> => {
    if (jwt === null) {
      await AsyncStorage.removeItem('@csa:jwt');
      await AsyncStorage.removeItem('@csa:email');
    } else {
      const extracted_token = jwt.substring(7);
      const decoded_token: Token = jwt_decode(extracted_token);

      await AsyncStorage.multiSet([
        ['@csa:jwt', extracted_token],
        ['@csa:email', decoded_token.sub],
      ]);
    }
  }, []);

  const logout = async (): Promise<void> => {
    console.log('HAUSHAUHSUAHSUA');

    const keys: string[] = await AsyncStorage.getAllKeys();
    await AsyncStorage.multiRemove(keys);

    if (!isMounted.current) {
      return;
    }
    setToken('');
    if (!isMounted.current) {
      return;
    }
    setEmail('');
  };

  return (
    <AuthContext.Provider
      value={{ token, setToken, email, handlerToken, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

const UseAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('UseAuth: No AuthContext');
  }

  return context;
};

export { AuthProvider, UseAuth };
