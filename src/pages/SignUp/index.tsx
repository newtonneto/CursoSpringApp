import React, { useEffect, useRef, useState } from 'react';
import { Alert } from 'react-native';
import { Input, Button } from 'react-native-elements';
import { SubmitHandler, useForm, Controller } from 'react-hook-form';
import Toast from 'react-native-toast-message';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { cpf, cnpj } from 'cpf-cnpj-validator';
import { Picker } from '@react-native-picker/picker';

import { ErrorView, ErrorText } from './styles';
import { SafeAreaView, ScrollView, Separator } from '../../template/styles';
import colors from '../../template/colors';
import cep from '../../service/viacep';
import { ViaCep } from '../../models/viacep.dto';
import { errorToast, successToast } from '../../utils/toasts';
import { UseService } from '../../hooks/serviceProvider';
import { EstadoDTO } from '../../models/estado.dto';
import { CidadeDTO } from '../../models/cidade.dto';
import Loader from '../../components/Loader';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../routes/auth.routes';
import { ApiError } from '../../exceptions/exceptions';

type Props = NativeStackScreenProps<RootStackParamList, 'SignIn'>;

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
  complement?: string;
  district: string;
  state: number;
  city: number;
};

const schema: yup.SchemaOf<FormData> = yup.object().shape({
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
    .test(
      'len',
      'Quantidade de dígitos incorreta',
      (value: string | undefined): boolean =>
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
      (value: string | undefined): boolean => value?.toString().length === 11,
    ),
  zipCode: yup
    .string()
    .required('Prenchimento obrigatorio')
    .matches(/^[0-9]+$/, 'Apenas números')
    .test(
      'len',
      'Telefone deve conter 11 dígitos',
      (value: string | undefined): boolean => value?.toString().length === 8,
    ),
  street: yup.string().required('Prenchimento obrigatorio'),
  number: yup.string().required('Prenchimento obrigatorio'),
  complement: yup.string(),
  district: yup.string().required('Prenchimento obrigatorio'),
  state: yup
    .number()
    .required('Prenchimento obrigatorio')
    .test(
      'value',
      'Selecione uma opção valida',
      (value: number | undefined): boolean => !(value === 0),
    ),
  city: yup
    .number()
    .required('Prenchimento obrigatorio')
    .test(
      'value',
      'Selecione uma opção valida',
      (value: number | undefined): boolean => !(value === 0),
    ),
});

const Error = ({
  message,
}: {
  message: string | undefined;
}): React.ReactElement => (
  <ErrorView>
    <ErrorText>{message}</ErrorText>
  </ErrorView>
);

const SignUp = ({ navigation }: Props): React.ReactElement => {
  const { handleSubmit, control, getValues, setValue, errors, reset } =
    useForm<FormData>({
      criteriaMode: 'all',
      resolver: yupResolver(schema),
    });
  const { getStates, getCities, createClient } = UseService();
  const [loading, setLoading] = useState<boolean>(true);
  const [states, setStates] = useState<EstadoDTO[]>([
    { id: 0, nome: 'Selecionar' },
  ]);
  const [cities, setCities] = useState<CidadeDTO[]>([]);
  const [inputLock, setInputLock] = useState<boolean>(true);
  const isMounted = useRef<boolean>(true);

  useEffect(() => {
    getStatesData();

    return (): void => {
      isMounted.current = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getStatesData = async (): Promise<void> => {
    try {
      const data: EstadoDTO[] = await getStates();

      setStates([...states, ...data]);
    } catch (err) {
      if (err instanceof ApiError) {
        Alert.alert(':(', `[${err.error.status}]: ${err.error.message}`);
      } else {
        errorToast('Erro de conexão');
      }

      console.log('getStatesData: ', err);
    } finally {
      if (!isMounted.current) {
        return;
      }
      setLoading(false);
    }
  };

  const getCitiesData = async (): Promise<void> => {
    const code: number = getValues().state;

    try {
      const data: CidadeDTO[] = await getCities(code.toString());

      setCities([{ id: 0, nome: 'Selecionar' }, ...data]);
    } catch (err) {
      if (err instanceof ApiError) {
        Alert.alert(':(', `[${err.error.status}]: ${err.error.message}`);
      } else {
        errorToast('Erro de conexão');
      }

      console.log('getCities: ', err);
    }
  };

  const onSubmit: SubmitHandler<FormData> = async formData => {
    if (!isMounted.current) {
      return;
    }
    setLoading(true);

    try {
      const payload = {
        nome: formData.name,
        email: formData.email,
        senha: formData.password,
        cpfOuCnpj: formData.cpfOrCnpj,
        tipo: formData.cpfOrCnpj.length === 11 ? 1 : 2,
        telefone1: formData.phone,
        logradouro: formData.street,
        numero: formData.number,
        complemento: formData.complement,
        cep: formData.zipCode,
        cidadeId: formData.city,
      };

      await createClient(payload);

      successToast('Cliente cadastrado com sucesso');

      Alert.alert(':)', "Tudo certo, clique em 'OK' para voltar", [
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

  const getAddress = async (): Promise<void> => {
    const code: string = getValues().zipCode;

    if (code.length != 8) {
      errorToast('CEP inválido');
    } else {
      try {
        const { data }: { data: ViaCep } = await cep.get(
          `${getValues().zipCode}/json/`,
        );

        if (data?.erro) {
          errorToast('CEP inválido');
        } else {
          if (!data.logradouro || !data.bairro) {
            if (!isMounted.current) {
              return;
            }
            setInputLock(false);
          } else {
            if (!isMounted.current) {
              return;
            }
            setInputLock(true);
            if (!isMounted.current) {
              return;
            }
            setValue('street', data.logradouro);
            if (!isMounted.current) {
              return;
            }
            setValue('district', data.bairro);
          }
        }
      } catch (err) {
        errorToast('Erro de conexão');
      }
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
              <Controller
                name="name"
                defaultValue={''}
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
              <Controller
                name="password"
                defaultValue={''}
                control={control}
                render={({ onChange, value }): any => (
                  <Input
                    placeholder="Senha*"
                    autoCompleteType="password"
                    autoCorrect={false}
                    onChangeText={onChange}
                    value={value}
                    placeholderTextColor={colors.disabled}
                    selectionColor={colors.text}
                    inputStyle={{ color: colors.text }}
                    autoCapitalize="none"
                    secureTextEntry={true}
                    errorMessage={errors.password && errors.password.message}
                    errorStyle={{ color: colors.danger }}
                    containerStyle={{
                      marginHorizontal: 0,
                      paddingHorizontal: 0,
                    }}
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
                    autoCorrect={false}
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
                    containerStyle={{
                      marginHorizontal: 0,
                      paddingHorizontal: 0,
                    }}
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
                    autoCorrect={false}
                    onChangeText={onChange}
                    value={value}
                    placeholderTextColor={colors.disabled}
                    selectionColor={colors.text}
                    inputStyle={{ color: colors.text }}
                    keyboardType="numeric"
                    errorMessage={errors.cpfOrCnpj && errors.cpfOrCnpj.message}
                    errorStyle={{ color: colors.danger }}
                    containerStyle={{
                      marginHorizontal: 0,
                      paddingHorizontal: 0,
                    }}
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
                    autoCorrect={false}
                    onChangeText={onChange}
                    value={value}
                    placeholderTextColor={colors.disabled}
                    selectionColor={colors.text}
                    inputStyle={{ color: colors.text }}
                    keyboardType="phone-pad"
                    errorMessage={errors.phone && errors.phone.message}
                    errorStyle={{ color: colors.danger }}
                    containerStyle={{
                      marginHorizontal: 0,
                      paddingHorizontal: 0,
                    }}
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
                    autoCorrect={false}
                    onChangeText={onChange}
                    value={value}
                    placeholderTextColor={colors.disabled}
                    selectionColor={colors.text}
                    inputStyle={{ color: colors.text }}
                    onBlur={() => getAddress()}
                    keyboardType="numeric"
                    errorMessage={errors.zipCode && errors.zipCode.message}
                    errorStyle={{ color: colors.danger }}
                    containerStyle={{
                      marginHorizontal: 0,
                      paddingHorizontal: 0,
                    }}
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
                    autoCorrect={false}
                    onChangeText={onChange}
                    value={value}
                    placeholderTextColor={colors.disabled}
                    selectionColor={colors.text}
                    inputStyle={{ color: colors.text }}
                    disabled={inputLock}
                    errorMessage={errors.street && errors.street.message}
                    errorStyle={{ color: colors.danger }}
                    containerStyle={{
                      marginHorizontal: 0,
                      paddingHorizontal: 0,
                    }}
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
                    autoCorrect={false}
                    onChangeText={onChange}
                    value={value}
                    placeholderTextColor={colors.disabled}
                    selectionColor={colors.text}
                    inputStyle={{ color: colors.text }}
                    keyboardType="numeric"
                    errorMessage={errors.number && errors.number.message}
                    errorStyle={{ color: colors.danger }}
                    containerStyle={{
                      marginHorizontal: 0,
                      paddingHorizontal: 0,
                    }}
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
                    autoCorrect={false}
                    onChangeText={onChange}
                    value={value}
                    placeholderTextColor={colors.disabled}
                    selectionColor={colors.text}
                    inputStyle={{ color: colors.text }}
                    errorMessage={
                      errors.complement && errors.complement.message
                    }
                    errorStyle={{ color: colors.danger }}
                    containerStyle={{
                      marginHorizontal: 0,
                      paddingHorizontal: 0,
                    }}
                  />
                )}
              />
              <Controller
                name="district"
                defaultValue={''}
                control={control}
                render={({
                  onChange,
                  value,
                }: {
                  onChange: any;
                  value: string;
                }): any => (
                  <Input
                    placeholder="Bairro"
                    autoCompleteType="off"
                    autoCorrect={false}
                    onChangeText={onChange}
                    value={value}
                    placeholderTextColor={colors.disabled}
                    selectionColor={colors.text}
                    inputStyle={{ color: colors.text }}
                    disabled={inputLock}
                    errorMessage={errors.district && errors.district.message}
                    errorStyle={{ color: colors.danger }}
                    containerStyle={{
                      marginHorizontal: 0,
                      paddingHorizontal: 0,
                    }}
                  />
                )}
              />
              <Controller
                name="state"
                defaultValue={0}
                control={control}
                render={({ onChange, value }) => (
                  <>
                    <Picker
                      selectedValue={value}
                      onValueChange={item => {
                        onChange(item);
                        getCitiesData();
                        setValue('city', 0);
                      }}
                      style={{ flex: 1, width: '100%', color: colors.text }}>
                      {states.map((item: EstadoDTO) => (
                        <Picker.Item
                          label={item.nome}
                          value={item.id}
                          key={item.id}
                          color={colors.background}
                        />
                      ))}
                    </Picker>
                    {errors.state && <Error message={errors.state.message} />}
                  </>
                )}
              />
              <Controller
                name="city"
                defaultValue={0}
                control={control}
                render={({ onChange, value }) => (
                  <>
                    <Picker
                      selectedValue={value}
                      onValueChange={onChange}
                      style={{ flex: 1, width: '100%', color: colors.text }}>
                      {cities.map((item: CidadeDTO) => (
                        <Picker.Item
                          label={item.nome}
                          value={item.id}
                          key={item.id}
                          color={colors.background}
                        />
                      ))}
                    </Picker>
                    {errors.city && <Error message={errors.city.message} />}
                  </>
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
            </>
          )}
        </ScrollView>
      </SafeAreaView>
      <Toast />
    </>
  );
};

export default SignUp;
