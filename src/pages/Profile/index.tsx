import React, { useState, useEffect, useRef } from 'react';
import { View, Text } from 'react-native';

import { SafeAreaView, ScrollView } from '../../template/styles';
import { UseAuth } from '../../hooks/authProvider';
import { getByEmail } from '../../service/domain/cliente';
import { ClienteDTO } from '../../models/cliente.dto';
import Loader from '../../components/Loader';

const Profile = (): React.ReactElement => {
  const [user, setUser] = useState<ClienteDTO | null>({} as ClienteDTO);
  const [loading, setLoading] = useState<boolean>(true);
  const { token, email } = UseAuth();
  const isMounted = useRef(true);

  useEffect(() => {
    const getUserData = async (): Promise<void> => {
      const data = await getByEmail(email, token);

      if (!isMounted.current) {
        return;
      }
      setUser(data);
      if (!isMounted.current) {
        return;
      }
      setLoading(false);
    };

    getUserData();

    return () => {
      isMounted.current = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <SafeAreaView>
      <ScrollView>
        {loading ? (
          <Loader />
        ) : (
          <View>
            <Text>{user?.email}</Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default Profile;
