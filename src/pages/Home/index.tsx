/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {SafeAreaView, ScrollView, View, Text} from 'react-native';
import {Button} from 'react-native-elements';
import Icon from 'react-native-vector-icons/SimpleLineIcons';

const Home = () => {
  return (
    <SafeAreaView>
      <ScrollView contentInsetAdjustmentBehavior="automatic">
        <View>
          <Text>haushauhsa</Text>
          <Button
            title="Basic Button"
            buttonStyle={{
              backgroundColor: 'rgba(78, 116, 289, 1)',
              borderRadius: 3,
            }}
            containerStyle={{
              width: 200,
              marginHorizontal: 50,
              marginVertical: 10,
            }}
            onPress={() => console.log('???')}
          />
          <Icon name="user" size={50} color={'red'} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Home;
