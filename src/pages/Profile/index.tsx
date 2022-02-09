import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Avatar, Text, Button, Input } from 'react-native-elements';
import { SubmitHandler, useForm } from 'react-hook-form';

import { AvatarContainer, TitleContainer } from './styles';
import { SafeAreaView, ScrollView } from '../../template/styles';
import { UseService } from '../../hooks/serviceProvider';
import { ClienteDTO } from '../../models/cliente.dto';
import Loader from '../../components/Loader';
import blank from '../../assets/avatar-blank.png';
import colors from '../../template/colors';

interface FormData {
  email: string;
}

const Profile = (): React.ReactElement => {
  const { getUserByEmail } = UseService();
  const { register, setValue, handleSubmit } = useForm<FormData>();
  const [user, setUser] = useState<ClienteDTO | null>({} as ClienteDTO);
  const [loading, setLoading] = useState<boolean>(true);
  const isMounted = useRef(true);

  useEffect(() => {
    register('email', { required: true });

    const getUserData = async (): Promise<void> => {
      const data = await getUserByEmail();

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

  const getUserImage = async (id: string | undefined): Promise<void> => {
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

  const onSubmit: SubmitHandler<FormData> = async (formData): Promise<void> => {
    console.log('formData: ', formData);
  };

  return (
    <SafeAreaView>
      <ScrollView>
        {loading ? (
          <Loader />
        ) : (
          <>
            <AvatarContainer>
              <Avatar
                size={120}
                rounded
                source={user?.imageUrl ? { uri: user?.imageUrl } : blank}
              />
              <TitleContainer>
                <Text h3 h3Style={{ color: colors.primary, marginLeft: 16 }}>
                  {user?.nome}
                </Text>
              </TitleContainer>
            </AvatarContainer>
            <Input
              defaultValue={user?.email}
              placeholder="email"
              autoCompleteType="email"
              onChangeText={(text: any) => setValue('email', text)}
              placeholderTextColor={colors.text}
              selectionColor={colors.text}
              inputStyle={{ color: colors.text }}
              autoCapitalize="none"
            />
            <Button
              title="ATUALIZAR"
              loading={loading}
              disabled={loading}
              loadingProps={{ size: 'small', color: 'white' }}
              buttonStyle={{
                backgroundColor: colors.success,
                borderRadius: 5,
              }}
              titleStyle={{ fontWeight: 'bold' }}
              containerStyle={{
                width: '95%',
                marginVertical: 10,
              }}
              onPress={handleSubmit(onSubmit)}
            />
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default Profile;
