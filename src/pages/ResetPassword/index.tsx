import React, { useState, useRef, useEffect } from 'react';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Alert } from 'react-native';
import { Input, Button } from 'react-native-elements';
import { SubmitHandler, useForm, Controller } from 'react-hook-form';
import Toast from 'react-native-toast-message';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';

import { SafeAreaView, ScrollView, Separator } from '../../template/styles';
import { RootStackParamList } from '../../routes/auth.routes';
import { ApiError } from '../../exceptions/exceptions';
import colors from '../../template/colors';
import { errorToast, successToast } from '../../utils/toasts';
import { UseService } from '../../hooks/serviceProvider';

type Props = NativeStackScreenProps<RootStackParamList, 'ResetPassword'>;

type FormData = {
  email: string;
};

const schema: yup.SchemaOf<FormData> = yup.object().shape({
  email: yup
    .string()
    .required('Prenchimento obrigatorio')
    .email('Email inválido'),
});

const ResetPassword = ({ navigation }: Props): React.ReactElement => {
  const { handleSubmit, control, errors, reset } = useForm<FormData>({
    criteriaMode: 'all',
    resolver: yupResolver(schema),
  });
  const { resetClientPassword } = UseService();
  const [loading, setLoading] = useState<boolean>(false);
  const isMounted = useRef<boolean>(true);

  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);

  const onSubmit: SubmitHandler<FormData> = async (formData): Promise<void> => {
    if (!isMounted.current) {
      return;
    }
    setLoading(true);

    try {
      await resetClientPassword(formData);

      successToast('Senha resetada com sucesso');

      Alert.alert(':)', 'Tudo certo, confira seu email', [
        {
          text: 'OK',
          onPress: () => navigation.navigate('SignIn'),
        },
      ]);
    } catch (err) {
      if (err instanceof ApiError) {
        Alert.alert(':(', `[${err.error.status}]: ${err.error.message}`);
      } else {
        errorToast('Erro de conexão');
      }

      reset(formData);
      console.log('onSubmit: ', err);
    } finally {
      if (!isMounted.current) {
        return;
      }
      setLoading(false);
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
          <Controller
            name="email"
            defaultValue={''}
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
          <Separator />
          <Button
            title="CADASTRAR"
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
        </ScrollView>
      </SafeAreaView>
      <Toast />
    </>
  );
};

export default ResetPassword;
