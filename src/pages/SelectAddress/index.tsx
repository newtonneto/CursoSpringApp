import React, { useState, useEffect, useRef } from 'react';
import { FlatList, ListRenderItem, Alert } from 'react-native';
import Toast from 'react-native-toast-message';

import { SafeAreaView, Separator } from '../../template/styles';
import Loader from '../../components/Loader';
import { EnderecoDTO } from '../../models/endereco.dto';
import Address from '../../components/Address';
import { errorToast } from '../../utils/toasts';
import { ApiError } from '../../exceptions/exceptions';
import { UseService } from '../../hooks/serviceProvider';
import { ClienteDTO } from '../../models/cliente.dto';

const SelectAddress = (): React.ReactElement => {
  const { getUserByEmail } = UseService();
  const [addresses, setAddresses] = useState<EnderecoDTO[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const isMounted = useRef<boolean>(true);
  const client_id = useRef<number>(0);

  useEffect(() => {
    const getUserData = async (): Promise<void> => {
      try {
        const data: ClienteDTO = await getUserByEmail();

        if (!isMounted.current) {
          return;
        }

        if (!isMounted.current) {
          return;
        }
        setAddresses(data.enderecos);
        client_id.current = data.id;
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

  const renderItem: ListRenderItem<EnderecoDTO> = ({ item }) => (
    <Address item={item} client_id={client_id.current} />
  );

  return (
    <>
      <SafeAreaView
        style={{
          elevation: -1,
        }}>
        {loading ? (
          <Loader />
        ) : (
          <FlatList
            data={addresses}
            keyExtractor={(item, index) => index.toString()}
            renderItem={renderItem}
            contentContainerStyle={{
              paddingHorizontal: 24,
              paddingVertical: 32,
            }}
            ItemSeparatorComponent={Separator}
          />
        )}
      </SafeAreaView>
      <Toast />
    </>
  );
};

export default SelectAddress;
