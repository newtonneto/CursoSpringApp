import React, { useEffect, useRef, useState } from 'react';
import { Input, Button } from 'react-native-elements';
import { SubmitHandler, useForm, Controller } from 'react-hook-form';
import Toast from 'react-native-toast-message';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { cpf, cnpj } from 'cpf-cnpj-validator';

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

const schema: any = yup.object().shape({
  name: yup.string().required('Prenchimento obrigatorio'),
  email: yup
    .string()
    .required('Prenchimento obrigatorio')
    .email('Email inválido'),
  password: yup
    .string()
    .required('Prenchimento obrigatorio')
    .min(8, 'A senha precisa ter ao menos 8 dígitos'),
  passwordConfirmation: yup
    .string()
    .required('Prenchimento obrigatorio')
    .min(8, 'A senha precisa ter ao menos 8 dígitos')
    .oneOf([yup.ref('password')], 'Passwords does not match'),
  cpfOrCnpj: yup
    .string()
    .required('Prenchimento obrigatorio')
    .matches(/^[0-9]+$/, 'Apenas números')
    .min(11, 'Mínimo de 11 dígitos')
    .test('len', 'Quantidade de dígitos incorreta', (value): boolean =>
      value?.toString.length === 11
        ? !cpf.isValid(value)
        : !cnpj.isValid(value ? value : '0'),
    ),
  phone: yup
    .string()
    .required('Prenchimento obrigatorio')
    .matches(/^[0-9]+$/, 'Apenas números')
    .test(
      'len',
      'Telefone deve conter 11 dígitos',
      (value): boolean => value?.toString().length === 11,
    ),
  zipCode: yup
    .string()
    .required('Prenchimento obrigatorio')
    .matches(/^[0-9]+$/, 'Apenas números')
    .test(
      'len',
      'Telefone deve conter 11 dígitos',
      (value): boolean => value?.toString().length === 8,
    ),
  street: yup.string().required('Prenchimento obrigatorio'),
  number: yup.string().required('Prenchimento obrigatorio'),
  district: yup.string().required('Prenchimento obrigatorio'),
});

const SignUp = (): React.ReactElement => {
  const { handleSubmit, control, getValues, setValue, errors } =
    useForm<FormData>({
      criteriaMode: 'all',
      resolver: yupResolver(schema),
    });
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
      Toast.show({
        type: 'error',
        text1: ':(',
        text2: 'CEP inválido',
      });
    }
  };

  return (
    <>
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
                errorMessage={errors.name && errors.name.message}
                errorStyle={{ color: colors.danger }}
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
                keyboardType="email-address"
                errorMessage={errors.email && errors.email.message}
                errorStyle={{ color: colors.danger }}
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
                secureTextEntry={true}
                errorMessage={errors.password && errors.password.message}
                errorStyle={{ color: colors.danger }}
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
                secureTextEntry={true}
                errorMessage={
                  errors.passwordConfirmation &&
                  errors.passwordConfirmation.message
                }
                errorStyle={{ color: colors.danger }}
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
                keyboardType="numeric"
                errorMessage={errors.cpfOrCnpj && errors.cpfOrCnpj.message}
                errorStyle={{ color: colors.danger }}
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
                keyboardType="phone-pad"
                errorMessage={errors.phone && errors.phone.message}
                errorStyle={{ color: colors.danger }}
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
                onBlur={() => getAddress()}
                keyboardType="numeric"
                errorMessage={errors.zipCode && errors.zipCode.message}
                errorStyle={{ color: colors.danger }}
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
                disabled={true}
                errorMessage={errors.street && errors.street.message}
                errorStyle={{ color: colors.danger }}
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
                keyboardType="numeric"
                errorMessage={errors.number && errors.number.message}
                errorStyle={{ color: colors.danger }}
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
                errorMessage={errors.complement && errors.complement.message}
                errorStyle={{ color: colors.danger }}
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
                disabled={true}
                errorMessage={errors.district && errors.district.message}
                errorStyle={{ color: colors.danger }}
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
      <Toast />
    </>
  );
};

export default SignUp;
