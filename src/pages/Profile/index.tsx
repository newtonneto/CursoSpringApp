import React, { useState, useEffect, useRef } from 'react';
import { ActivityIndicator, Alert, Modal, View } from 'react-native';
import axios from 'axios';
import { Avatar, Text, Button, Input } from 'react-native-elements';
import { SubmitHandler, useForm, Controller } from 'react-hook-form';
import Toast from 'react-native-toast-message';
import Collapsible from 'react-native-collapsible';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';

import {
  AvatarContainer,
  TitleContainer,
  Section,
  SectionTitle,
  SectionContent,
  SectionItem,
} from './styles';
import { SafeAreaView, ScrollView, Separator } from '../../template/styles';
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
import getFileFromStorage from '../../utils/getFileFromStorage';
import { EnderecoDTO } from '../../models/endereco.dto';

interface FormData {
  name: string;
  email: string;
}

const schema: yup.SchemaOf<FormData> = yup.object().shape({
  name: yup.string().required('Prenchimento obrigatorio'),
  email: yup
    .string()
    .required('Prenchimento obrigatorio')
    .email('Email inválido'),
});

const Profile = (): React.ReactElement => {
  const { getUserByEmail, uploadAvatar, updateClient } = UseService();
  const { handleSubmit, control, errors, reset } = useForm<FormData>({
    criteriaMode: 'all',
    resolver: yupResolver(schema),
  });
  const [user, setUser] = useState<ClienteDTO>({} as ClienteDTO);
  const [loading, setLoading] = useState<boolean>(true);
  const [avatarLoading, setAvatarLoading] = useState<boolean>(false);
  const [cameraVisible, setCameraVisible] = useState<boolean>(false);
  const [photo, setPhoto] = useState<string>('');
  const [camera, setCamera] = useState<RNCamera>();
  const [addressAccordion, setAddressAccordion] = useState<number>(-1);
  const [phoneAccordion, setPhoneAccordion] = useState<boolean>(false);
  const isMounted = useRef<boolean>(true);

  useEffect(() => {
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

  const getUserData = async (): Promise<void> => {
    try {
      const data: ClienteDTO = await getUserByEmail();

      if (!isMounted.current) {
        return;
      }
      console.log('data: ', data);
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

      await getUserImage(user.id);
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
    if (!isMounted.current) {
      return;
    }
    setAvatarLoading(true);

    try {
      const image_url = `https://new2-curso-spring.s3.sa-east-1.amazonaws.com/cp${id}.jpg?${new Date()}`;

      await axios.get(image_url);

      setUser(prevState => ({
        ...(prevState as ClienteDTO),
        imageUrl: image_url,
      }));
    } catch (err) {
      console.log('getUserImage: ', err);
    } finally {
      if (!isMounted.current) {
        return;
      }
      setAvatarLoading(false);
    }
  };

  const startCamera = async (): Promise<void> => {
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

  const startStorage = async (): Promise<void> => {
    let isStoragePermitted = await externalWritePermission();

    if (isStoragePermitted) {
      getFileFromStorage(setPhoto);
    } else {
      Alert.alert(
        ':(',
        'Para usar a função de câmera é necessário aceitar as permissões',
      );
    }
  };

  const imageOptions = (): void => {
    Alert.alert(
      '',
      'Selecione um método para submeter uma nova imagem',
      [
        { text: 'Cancelar' },
        { text: 'Selecionar da galeria', onPress: () => startStorage() },
        { text: 'Tirar com a câmera', onPress: () => startCamera() },
      ],
      {
        cancelable: true,
      },
    );
  };

  const onSubmit: SubmitHandler<FormData> = async (formData): Promise<void> => {
    if (!isMounted.current) {
      return;
    }
    setLoading(true);

    try {
      const payload = {
        nome: formData.name,
        email: formData.email,
      };

      await updateClient(user.id, payload);

      successToast('Cliente atualizado com sucesso');

      await getUserData();
    } catch (err) {
      if (err instanceof ApiError) {
        Alert.alert(':(', `[${err.error.status}]: ${err.error.message}`);
      } else {
        errorToast('Erro de conexão');
      }

      reset(formData);
      console.log('onSubmit: ', err);

      if (!isMounted.current) {
        return;
      }
      setLoading(false);
    }
  };

  const handleExpanse = (index: number): void => {
    if (index === addressAccordion) {
      setAddressAccordion(-1);
    } else {
      setAddressAccordion(index);
    }
  };

  return (
    <>
      <SafeAreaView
        style={{
          elevation: -1,
        }}>
        <ScrollView
          contentInsetAdjustmentBehavior="automatic"
          keyboardShouldPersistTaps="always">
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
                {avatarLoading ? (
                  <View
                    style={{
                      width: 120,
                      height: 120,
                      borderWidth: 1,
                      borderColor: 'red',
                      borderRadius: 60,
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                    <ActivityIndicator size="small" color={colors.primary} />
                  </View>
                ) : (
                  <Avatar
                    onPress={imageOptions}
                    size={120}
                    rounded
                    source={user.imageUrl ? { uri: user.imageUrl } : blank}
                  />
                )}
                <TitleContainer>
                  <Text
                    numberOfLines={1}
                    ellipsizeMode="tail"
                    h3
                    h3Style={{ color: colors.text, marginLeft: 16 }}>
                    {user?.nome}
                  </Text>
                </TitleContainer>
              </AvatarContainer>
              <Controller
                name="name"
                defaultValue={user.nome}
                control={control}
                render={({ onChange, value }): any => (
                  <Input
                    placeholder="Nome Completo*"
                    autoCompleteType="name"
                    autoCorrect={false}
                    onChangeText={onChange}
                    value={value}
                    placeholderTextColor={colors.disabled}
                    selectionColor={colors.text}
                    inputStyle={{ color: colors.text }}
                    errorMessage={errors.name && errors.name.message}
                    errorStyle={{ color: colors.danger }}
                    containerStyle={{
                      marginHorizontal: 0,
                      paddingHorizontal: 0,
                    }}
                  />
                )}
              />
              <Controller
                name="email"
                defaultValue={user.email}
                control={control}
                render={({ onChange, value }): any => (
                  <Input
                    placeholder="Email*"
                    autoCompleteType="email"
                    autoCorrect={false}
                    onChangeText={onChange}
                    value={value}
                    placeholderTextColor={colors.disabled}
                    selectionColor={colors.text}
                    inputStyle={{ color: colors.text }}
                    autoCapitalize="none"
                    keyboardType="email-address"
                    errorMessage={errors.email && errors.email.message}
                    errorStyle={{ color: colors.danger }}
                    containerStyle={{
                      marginHorizontal: 0,
                      paddingHorizontal: 0,
                    }}
                  />
                )}
              />
              <Input
                defaultValue={user.cpfOuCnpj}
                placeholder="CPF ou CNPJ"
                autoCompleteType="off"
                placeholderTextColor={colors.text}
                selectionColor={colors.text}
                inputStyle={{ color: colors.text }}
                autoCapitalize="none"
                containerStyle={{
                  marginHorizontal: 0,
                  paddingHorizontal: 0,
                }}
                disabled={true}
              />
              {user.enderecos.map(
                (item: EnderecoDTO, index: number): React.ReactElement => (
                  <View key={index} style={{ width: '100%' }}>
                    <Section
                      onPress={() => handleExpanse(index)}
                      style={{
                        borderBottomLeftRadius:
                          addressAccordion === index ? 0 : 8,
                        borderBottomRightRadius:
                          addressAccordion === index ? 0 : 8,
                      }}>
                      <MaterialCommunityIcons
                        name="home"
                        color={colors.background}
                        size={20}
                      />
                      <SectionTitle>Endereço {index + 1}</SectionTitle>
                    </Section>
                    <Collapsible
                      collapsed={addressAccordion === index ? false : true}>
                      <SectionContent
                        style={{
                          borderTopLeftRadius:
                            addressAccordion === index ? 0 : 8,
                          borderTopRightRadius:
                            addressAccordion === index ? 0 : 8,
                        }}>
                        <SectionItem>
                          {item.logradouro}, {item.numero}
                        </SectionItem>
                        {item.complemento !== '' &&
                          item.complemento !== null &&
                          item.complemento !== undefined && (
                            <SectionItem>{item.complemento}</SectionItem>
                          )}
                        <SectionItem>
                          {item.bairro}, {item.cep}
                        </SectionItem>
                        <SectionItem>
                          {item.cidade.nome}, {item.cidade.estado?.nome}
                        </SectionItem>
                      </SectionContent>
                    </Collapsible>
                    <Separator />
                  </View>
                ),
              )}
              <View style={{ width: '100%' }}>
                <Section
                  onPress={() => setPhoneAccordion(!phoneAccordion)}
                  style={{
                    borderBottomLeftRadius: phoneAccordion === true ? 0 : 8,
                    borderBottomRightRadius: phoneAccordion === true ? 0 : 8,
                  }}>
                  <MaterialCommunityIcons
                    name="phone-classic"
                    color={colors.background}
                    size={20}
                  />
                  <SectionTitle>Telefones</SectionTitle>
                </Section>
                <Collapsible collapsed={phoneAccordion === true ? false : true}>
                  <SectionContent
                    style={{
                      borderTopLeftRadius: phoneAccordion === true ? 0 : 8,
                      borderTopRightRadius: phoneAccordion === true ? 0 : 8,
                    }}>
                    {user.telefones.map(
                      (item: string, index: number): React.ReactElement => (
                        <SectionItem key={index}>{item}</SectionItem>
                      ),
                    )}
                  </SectionContent>
                </Collapsible>
              </View>
              <Separator />
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
