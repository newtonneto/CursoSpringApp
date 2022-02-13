import React from 'react';

import { AuthProvider } from './authProvider';
import { ServiceProvider } from './serviceProvider';
import { CartProvider } from './cartProvider';

type Props = {
  children: React.ReactNode;
};

const AppProvider = ({ children }: Props) => {
  return (
    <AuthProvider>
      <ServiceProvider>
        <CartProvider>{children}</CartProvider>
      </ServiceProvider>
    </AuthProvider>
  );
};

export default AppProvider;
