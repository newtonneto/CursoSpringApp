/* eslint-disable react-native/no-inline-styles */
import React, { useEffect, createRef, useState, useRef } from 'react';
import { ActivityIndicator, Alert } from 'react-native';
import { Button, Input, Image } from 'react-native-elements';
import { SubmitHandler, useForm } from 'react-hook-form';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

import { KeyboardAvoidingView, ScrollView } from '../../template/styles';
import logo from '../../assets/logo.png';
import colors from '../../template/colors';
import { RootStackParamList } from '../../routes/auth.routes';
import auth from '../../service/auth';
import { UseAuth } from '../../hooks/authProvider';
import { ErrorTemplate } from '../../models/error';

const emailRef = createRef<any>();
const passwordRef = createRef<any>();

type Props = NativeStackScreenProps<RootStackParamList, 'SignIn'>;

interface FormData {
  email: string;
  password: string;
}

const SignIn = ({ navigation }: Props): React.ReactElement => {
  const {
    register,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();
  const { handlerToken } = UseAuth();
  const [loading, setLoading] = useState<boolean>(false);
  const isMounted = useRef<boolean>(true);

  useEffect(() => {
    register('email', { required: true });
    register('password', { required: true });

    return () => {
      isMounted.current = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onSubmit: SubmitHandler<FormData> = async (
    formData,
  ): Promise<undefined> => {
    if (!isMounted.current) {
      return;
    }
    setLoading(true);

    try {
      const credentials = {
        email: formData.email,
        senha: formData.password,
      };

      const jwt: any = await auth.post('login', credentials);

      await handlerToken(jwt);
    } catch (err) {
      const error: ErrorTemplate = err as ErrorTemplate;

      Alert.alert(':(', `[${error.status}]: ${error.message}`);
      console.log('onSubmit: ', err);
    } finally {
      if (!isMounted.current) {
        return;
      }
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView>
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        keyboardShouldPersistTaps="always">
        <Image
          source={logo}
          containerStyle={{
            aspectRatio: 1,
            width: '75%',
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
          containerStyle={{
            marginHorizontal: 0,
            paddingHorizontal: 0,
          }}
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
          containerStyle={{
            marginHorizontal: 0,
            paddingHorizontal: 0,
          }}
        />
        {errors.password && errors.password.type && passwordRef.current.shake()}
        <Button
          title="ENTRAR"
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
            marginBottom: 16,
          }}
          onPress={handleSubmit(onSubmit)}
        />
        <Button
          title="ESQUECI MINHA SENHA"
          disabled={loading}
          buttonStyle={{
            borderColor: colors.text,
          }}
          type="outline"
          titleStyle={{ color: colors.text }}
          containerStyle={{
            width: '100%',
            marginVertical: 0,
            marginBottom: 16,
          }}
          onPress={() => navigation.navigate('ResetPassword')}
        />
        <Button
          title="REGISTRAR"
          disabled={loading}
          buttonStyle={{
            borderColor: colors.text,
          }}
          type="outline"
          titleStyle={{ color: colors.text }}
          containerStyle={{
            width: '100%',
            marginVertical: 0,
          }}
          onPress={() => navigation.navigate('SignUp')}
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default SignIn;
