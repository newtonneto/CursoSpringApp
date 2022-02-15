import React from 'react';
import { View, ActivityIndicator, Text } from 'react-native';

import { UseAuth } from '../hooks/authProvider';
import { UseService } from '../hooks/serviceProvider';
import colors from '../template/colors';
import AppRoutes from './app.routes';
import AuthRoutes from './auth.routes';

const Routes = () => {
  const { email } = UseAuth();
  const { sessionLoading } = UseService();

  if (sessionLoading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: colors.background,
        }}>
        <ActivityIndicator size="small" color={colors.text} />
        <Text style={{ color: colors.text }}>
          Verificando a sessão do usuário
        </Text>
      </View>
    );
  }

  return email ? <AppRoutes /> : <AuthRoutes />;
};

export default Routes;
