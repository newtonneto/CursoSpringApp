import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useRef,
  useCallback,
} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

type Props = {
  children: React.ReactNode;
};

type ReturnContext = {
  token: string;
  setToken: Function;
  handlerToken: Function;
};

//const AuthContext = createContext<ReturnContext>({} as ReturnContext);
const AuthContext = createContext<ReturnContext | undefined>(undefined);

const AuthProvider = ({ children }: Props) => {
  const [token, setToken] = useState<string>('');
  const isMounted = useRef<boolean>(true);

  useEffect(() => {
    const loadStorageData = async () => {
      const jwt: string | null = await AsyncStorage.getItem('@csa:jwt');

      if (jwt) {
        if (!isMounted.current) {
          return;
        }
        setToken(jwt[1]);
      }
    };

    loadStorageData();

    return () => {
      isMounted.current = false;
    };
  }, []);

  const handlerToken = useCallback(async (jwt): Promise<void> => {
    await AsyncStorage.setItem('@csa:jwt', jwt);
  }, []);

  return (
    <AuthContext.Provider value={{ token, setToken, handlerToken }}>
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
