import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Avatar, Text } from 'react-native-elements';

import { AvatarContainer } from './styles';
import { SafeAreaView, ScrollView } from '../../template/styles';
import { UseAuth } from '../../hooks/authProvider';
import { getByEmail } from '../../service/domain/cliente';
import { ClienteDTO } from '../../models/cliente.dto';
import Loader from '../../components/Loader';
import blank from '../../assets/avatar-blank.png';
import colors from '../../template/colors';

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

      await getUserImage(data?.id);
    };

    getUserData();

    return () => {
      isMounted.current = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getUserImage = async (id: string | undefined) => {
    try {
      await axios.get(
        `https://new2-curso-spring.s3.sa-east-1.amazonaws.com/cp${id}.jpg`,
      );

      setUser(prevState => ({
        ...(prevState as ClienteDTO),
        imageUrl: `https://new2-curso-spring.s3.sa-east-1.amazonaws.com/cp${id}.jpg`,
      }));
    } catch (err) {
      console.log('getUserImage: ', err);
    }
  };

  return (
    <SafeAreaView>
      <ScrollView>
        {loading ? (
          <Loader />
        ) : (
          <AvatarContainer>
            <Avatar
              size={120}
              rounded
              source={user?.imageUrl ? { uri: user?.imageUrl } : blank}
            />
            <Text h3 h3Style={{ color: colors.primary, marginLeft: 16 }}>
              {user?.nome}
            </Text>
          </AvatarContainer>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default Profile;
