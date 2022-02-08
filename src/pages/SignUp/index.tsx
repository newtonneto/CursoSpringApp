import React, { useEffect, useRef, useState } from 'react';
import { ToastAndroid } from 'react-native';
import { Input, Button } from 'react-native-elements';
import { SubmitHandler, useForm, Controller } from 'react-hook-form';

import { SafeAreaView, ScrollView } from '../../template/styles';
import colors from '../../template/colors';
import cep from '../../service/viacep';
import { ViaCep } from '../../models/viacep.dto';

type FormData = {
  name: string;
  email: string;
  password: string;
  passwordConfirmation: string;
  cpfOrCnpj: string;
  phone: string;
  zipCode: string;
  street: string;
  number: string;
  complement: string;
  district: string;
};

const SignUp = (): React.ReactElement => {
  const { handleSubmit, control, getValues, setValue } = useForm<FormData>();
  const [loading, setLoading] = useState<boolean>(false);
  const isMounted = useRef<boolean>(true);

  useEffect(() => {
    return (): void => {
      isMounted.current = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onSubmit: SubmitHandler<FormData> = async formData => {
    if (!isMounted.current) {
      return;
    }
    setLoading(true);

    try {
      console.log('data: ', formData);
    } catch (err) {
      console.log('onSubmit: ', err);
    } finally {
      if (!isMounted.current) {
        return;
      }
      setLoading(false);
    }
  };

  const getAddress = async (): Promise<void> => {
    try {
      const { data }: { data: ViaCep } = await cep.get(
        `${getValues().zipCode}/json/`,
      );

      setValue('street', data.logradouro);
      setValue('district', data.bairro);
    } catch (err) {
      ToastAndroid.showWithGravity(
        'CEP inválido',
        ToastAndroid.LONG,
        ToastAndroid.TOP,
      );
    }
  };

  return (
    <SafeAreaView>
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        keyboardShouldPersistTaps="always">
        <Controller
          name="name"
          defaultValue={''}
          control={control}
          render={({ onChange, value }): any => (
            <Input
              placeholder="Nome Completo*"
              autoCompleteType="name"
              onChangeText={onChange}
              value={value}
              placeholderTextColor={colors.disabled}
              selectionColor={colors.text}
              inputStyle={{ color: colors.text }}
              autoCapitalize="none"
            />
          )}
        />
        <Controller
          name="email"
          defaultValue={''}
          control={control}
          render={({ onChange, value }): any => (
            <Input
              placeholder="Email*"
              autoCompleteType="email"
              onChangeText={onChange}
              value={value}
              placeholderTextColor={colors.disabled}
              selectionColor={colors.text}
              inputStyle={{ color: colors.text }}
              autoCapitalize="none"
            />
          )}
        />
        <Controller
          name="password"
          defaultValue={''}
          control={control}
          render={({ onChange, value }): any => (
            <Input
              placeholder="Senha*"
              autoCompleteType="password"
              onChangeText={onChange}
              value={value}
              placeholderTextColor={colors.disabled}
              selectionColor={colors.text}
              inputStyle={{ color: colors.text }}
              autoCapitalize="none"
            />
          )}
        />
        <Controller
          name="passwordConfirmation"
          defaultValue={''}
          control={control}
          render={({ onChange, value }): any => (
            <Input
              placeholder="Confirmação da Senha*"
              autoCompleteType="password"
              onChangeText={onChange}
              value={value}
              placeholderTextColor={colors.disabled}
              selectionColor={colors.text}
              inputStyle={{ color: colors.text }}
              autoCapitalize="none"
            />
          )}
        />
        <Controller
          name="cpfOrCnpj"
          defaultValue={''}
          control={control}
          render={({ onChange, value }): any => (
            <Input
              placeholder="CPF ou CNPJ*"
              autoCompleteType="off"
              onChangeText={onChange}
              value={value}
              placeholderTextColor={colors.disabled}
              selectionColor={colors.text}
              inputStyle={{ color: colors.text }}
              autoCapitalize="none"
            />
          )}
        />
        <Controller
          name="phone"
          defaultValue={''}
          control={control}
          render={({ onChange, value }): any => (
            <Input
              placeholder="Telefone*"
              autoCompleteType="off"
              onChangeText={onChange}
              value={value}
              placeholderTextColor={colors.disabled}
              selectionColor={colors.text}
              inputStyle={{ color: colors.text }}
              autoCapitalize="none"
            />
          )}
        />
        <Controller
          name="zipCode"
          defaultValue={''}
          control={control}
          render={({ onChange, value }): any => (
            <Input
              placeholder="CEP*"
              autoCompleteType="postal-code"
              onChangeText={onChange}
              value={value}
              placeholderTextColor={colors.disabled}
              selectionColor={colors.text}
              inputStyle={{ color: colors.text }}
              autoCapitalize="none"
              onBlur={() => getAddress()}
            />
          )}
        />
        <Controller
          name="street"
          defaultValue={''}
          control={control}
          render={({ onChange, value }): any => (
            <Input
              placeholder="Logradouro"
              autoCompleteType="off"
              onChangeText={onChange}
              value={value}
              placeholderTextColor={colors.disabled}
              selectionColor={colors.text}
              inputStyle={{ color: colors.text }}
              autoCapitalize="none"
              disabled={true}
            />
          )}
        />
        <Controller
          name="number"
          defaultValue={''}
          control={control}
          render={({ onChange, value }): any => (
            <Input
              placeholder="Número*"
              autoCompleteType="off"
              onChangeText={onChange}
              value={value}
              placeholderTextColor={colors.disabled}
              selectionColor={colors.text}
              inputStyle={{ color: colors.text }}
              autoCapitalize="none"
            />
          )}
        />
        <Controller
          name="complement"
          defaultValue={''}
          control={control}
          render={({ onChange, value }): any => (
            <Input
              placeholder="Complemento"
              autoCompleteType="off"
              onChangeText={onChange}
              value={value}
              placeholderTextColor={colors.disabled}
              selectionColor={colors.text}
              inputStyle={{ color: colors.text }}
              autoCapitalize="none"
            />
          )}
        />
        <Controller
          name="district"
          defaultValue={''}
          control={control}
          render={({ onChange, value }): any => (
            <Input
              placeholder="Bairro"
              autoCompleteType="off"
              onChangeText={onChange}
              value={value}
              placeholderTextColor={colors.disabled}
              selectionColor={colors.text}
              inputStyle={{ color: colors.text }}
              autoCapitalize="none"
              disabled={true}
            />
          )}
        />
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
            width: '95%',
            marginVertical: 10,
          }}
          onPress={handleSubmit(onSubmit)}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

export default SignUp;
