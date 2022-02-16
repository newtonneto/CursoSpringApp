import React, { useState } from 'react';
import { Alert } from 'react-native';
import { RNCamera } from 'react-native-camera';
import Icon from 'react-native-vector-icons/MaterialIcons';
import colors from '../../template/colors';

import { TakePicture, CloseCamera, ChangeCamera } from './styles';

type Props = {
  camera: any;
  setCamera: Function;
  setCameraVisible: Function;
  setPhoto: Function;
};

const Camera = ({ camera, setCamera, setCameraVisible, setPhoto }: Props) => {
  const [type, setType] = useState<boolean>(true);

  const onTakePicture = async (): Promise<void> => {
    try {
      const { uri }: { uri: string } = await camera.takePictureAsync({
        quality: 0.5,
        forceUpOrientation: true,
        fixOrientation: true,
        skipProcessing: true,
      });

      setPhoto(uri);
    } catch (error) {
      console.log('onTakePicture: ', error);
      Alert.alert(':(', 'Houve um erro ao tirar a foto.');
    } finally {
      setCameraVisible(false);
    }
  };

  return (
    <RNCamera
      ref={ref => setCamera(ref)}
      style={{ flex: 1 }}
      type={type ? RNCamera.Constants.Type.front : RNCamera.Constants.Type.back}
      autoFocus={RNCamera.Constants.AutoFocus.on}
      flashMode={RNCamera.Constants.FlashMode.off}
      captureAudio={false}
      ratio="1:1">
      <TakePicture>
        <Icon
          name="photo-camera"
          size={55}
          color={colors.text}
          onPress={onTakePicture}
        />
      </TakePicture>
      <CloseCamera>
        <Icon
          name="close"
          size={40}
          color={colors.text}
          onPress={() => setCameraVisible(false)}
        />
      </CloseCamera>
      <ChangeCamera>
        <Icon
          name="flip-camera-android"
          size={40}
          color={colors.text}
          onPress={() => setType(!type)}
        />
      </ChangeCamera>
    </RNCamera>
  );
};

export default Camera;
