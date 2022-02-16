import React, { useState, useEffect, useRef } from 'react';
import { Alert, Modal } from 'react-native';
import axios from 'axios';
import { Avatar, Text, Button, Input } from 'react-native-elements';
import { SubmitHandler, useForm } from 'react-hook-form';
import Toast from 'react-native-toast-message';

import { AvatarContainer, TitleContainer } from './styles';
import { SafeAreaView, ScrollView } from '../../template/styles';
import { UseService } from '../../hooks/serviceProvider';
import { ClienteDTO } from '../../models/cliente.dto';
import Loader from '../../components/Loader';
import blank from '../../assets/avatar-blank.png';
import colors from '../../template/colors';
import { errorToast, successToast } from '../../utils/toasts';
import { ApiError } from '../../exceptions/exceptions';
import cameraPermission from '../../utils/cameraPermission';
import externalWritePermission from '../../utils/externalWritePermission';
import Camera from '../../components/Camera';
import { RNCamera } from 'react-native-camera';

interface FormData {
  email: string;
}

const Profile = (): React.ReactElement => {
  const { getUserByEmail, uploadAvatar } = UseService();
  const { register, setValue, handleSubmit } = useForm<FormData>();
  const [user, setUser] = useState<ClienteDTO>({} as ClienteDTO);
  const [loading, setLoading] = useState<boolean>(true);
  const [avatarLoading, setAvatarLoading] = useState<boolean>(true);
  const [cameraVisible, setCameraVisible] = useState<boolean>(false);
  const [photo, setPhoto] = useState<string>('');
  const [camera, setCamera] = useState<RNCamera>();
  const isMounted = useRef<boolean>(true);

  useEffect(() => {
    register('email', { required: true });

    const getUserData = async (): Promise<void> => {
      try {
        const data: ClienteDTO = await getUserByEmail();

        if (!isMounted.current) {
          return;
        }
        setUser(data);

        await getUserImage(data.id);
      } catch (err) {
        if (err instanceof ApiError) {
          Alert.alert(':(', `[${err.error.status}]: ${err.error.message}`);
        } else {
          errorToast('Erro de conexão');
        }

        console.log('getUserData: ', err);
      } finally {
        if (!isMounted.current) {
          return;
        }
        setLoading(false);
      }
    };

    getUserData();

    return () => {
      isMounted.current = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (photo) {
      submitAvatar();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [photo]);

  const submitAvatar = async (): Promise<void> => {
    if (!isMounted.current) {
      return;
    }
    setAvatarLoading(true);

    try {
      // const response = await fetch(photo);
      // const blob = await response.blob();
      await uploadAvatar(photo);

      successToast('Avatar atualizado com sucesso');
    } catch (err) {
      Alert.alert(':(', 'Erro no upload da imagem');
      console.log('submitAvatar: ', err);
    } finally {
      if (!isMounted.current) {
        return;
      }
      setAvatarLoading(false);
    }
  };

  const getUserImage = async (id: number): Promise<void> => {
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

  const useCamera = async () => {
    let isCameraPermitted = await cameraPermission();
    let isStoragePermitted = await externalWritePermission();

    if (isCameraPermitted && isStoragePermitted) {
      if (!isMounted.current) {
        return;
      }
      setCameraVisible(true);
    } else {
      Alert.alert(
        ':(',
        'Para usar a função de câmera é necessário aceitar as permissões',
      );
    }
  };

  const onSubmit: SubmitHandler<FormData> = async (formData): Promise<void> => {
    console.log('formData: ', formData);
  };

  return (
    <>
      <SafeAreaView
        style={{
          elevation: -1,
        }}>
        <ScrollView>
          {loading ? (
            <Loader />
          ) : (
            <>
              <Modal
                animationType="slide"
                transparent={false}
                visible={cameraVisible}>
                <Camera
                  camera={camera}
                  setCamera={setCamera}
                  setCameraVisible={setCameraVisible}
                  setPhoto={setPhoto}
                />
              </Modal>
              <AvatarContainer>
                <Avatar
                  onPress={useCamera}
                  size={120}
                  rounded
                  source={user.imageUrl ? { uri: user.imageUrl } : blank}
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
                containerStyle={{
                  marginHorizontal: 0,
                  paddingHorizontal: 0,
                }}
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
                  width: '100%',
                  marginVertical: 0,
                }}
                onPress={handleSubmit(onSubmit)}
              />
            </>
          )}
        </ScrollView>
      </SafeAreaView>
      <Toast />
    </>
  );
};

export default Profile;
