import React from 'react';

import { UseAuth } from '../hooks/authProvider';
import AppRoutes from './app.routes';
import AuthRoutes from './auth.routes';

const Routes = () => {
  const { email } = UseAuth();

  return email ? <AppRoutes /> : <AuthRoutes />;
};

export default Routes;
