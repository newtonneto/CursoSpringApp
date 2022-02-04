/* eslint-disable react-native/no-inline-styles */
import React, { useEffect, createRef } from 'react';
import { ActivityIndicator } from 'react-native';
import { Button, Input, Image } from 'react-native-elements';
import { useForm } from 'react-hook-form';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

import { Title } from './styles';
import { KeyboardAvoidingView, ScrollView } from '../../template/styles';
import logo from '../../assets/logo.png';
import colors from '../../template/colors';
import { RootStackParamList } from '../../routes';
import auth from '../../service/auth';

const emailRef = createRef<any>();
const passwordRef = createRef<any>();

type Props = NativeStackScreenProps<RootStackParamList, 'SignIn'>;

const SignIn = ({ navigation }: Props) => {
  const {
    register,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = (data: any) => {
    console.log('data: ', data);
    navigation.navigate('AppRoutes');
  };

  useEffect(() => {
    register('email', { required: true });
    register('password', { required: true });

    login();
  }, [register]);

  async function login() {
    try {
      const credentials = {
        email: 'solid.snake@gmail.com',
        senha: 'batata',
      };

      await auth.post('login', credentials);
    } catch (err) {
      console.log('login: ', err);
    }
  }

  return (
    <KeyboardAvoidingView>
      <ScrollView contentInsetAdjustmentBehavior="automatic">
        <Title>Sistema de pedidos</Title>
        <Image
          source={logo}
          containerStyle={{
            aspectRatio: 1,
            width: '100%',
            flex: 1,
          }}
          PlaceholderContent={<ActivityIndicator />}
        />
        <Input
          ref={emailRef}
          placeholder="email"
          leftIcon={{
            type: 'materialcommunityicons',
            name: 'email',
            color: colors.text,
          }}
          autoCompleteType="email"
          onChangeText={(text: any) => setValue('email', text)}
          placeholderTextColor={colors.text}
          selectionColor={colors.text}
          inputStyle={{ color: colors.text }}
          errorMessage={
            errors.email && errors.email.type ? 'Prenchimento obrigatorio' : ''
          }
          errorStyle={{ color: colors.danger }}
          autoCapitalize="none"
        />
        {errors.email && errors.email.type && emailRef.current.shake()}
        <Input
          ref={passwordRef}
          placeholder="password"
          leftIcon={{
            type: 'materialcommunityicons',
            name: 'lock',
            color: colors.text,
          }}
          autoCompleteType="password"
          onChangeText={(text: any) => setValue('password', text)}
          placeholderTextColor={colors.text}
          selectionColor={colors.text}
          inputStyle={{ color: colors.text }}
          errorMessage={
            errors.password && errors.password.type
              ? 'Prenchimento obrigatorio'
              : ''
          }
          errorStyle={{ color: colors.danger }}
          autoCapitalize="none"
          secureTextEntry={true}
        />
        {errors.password && errors.password.type && passwordRef.current.shake()}
        <Button
          title="ENTRAR"
          loading={false}
          loadingProps={{ size: 'small', color: 'white' }}
          buttonStyle={{
            backgroundColor: colors.success,
            borderRadius: 5,
          }}
          titleStyle={{ fontWeight: 'bold', fontSize: 23 }}
          containerStyle={{
            height: 50,
            width: '95%',
            marginVertical: 10,
          }}
          onPress={handleSubmit(onSubmit)}
        />
        <Button
          title="REGISTRAR"
          buttonStyle={{
            borderColor: colors.text,
          }}
          type="outline"
          titleStyle={{ color: colors.text }}
          containerStyle={{
            height: 50,
            width: '95%',
          }}
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default SignIn;
