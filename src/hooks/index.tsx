import React from 'react';

import { AuthProvider } from './authProvider';
import { ServiceProvider } from './serviceProvider';

type Props = {
  children: React.ReactNode;
};

const AppProvider = ({ children }: Props) => {
  return (
    <AuthProvider>
      <ServiceProvider>{children}</ServiceProvider>
    </AuthProvider>
  );
};

export default AppProvider;
