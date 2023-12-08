import React from 'react';
import { View, StyleSheet,Alert } from 'react-native';
import { Button, Text } from '@rneui/themed';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';


export type RootStackParam = {
  Logout: undefined;
  UserInfo: undefined;
  wifi:undefined;
};

export const AdminSettings: React.FC = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParam>>();
  
  return (
    <View style={styles.container}>
      <Text style={styles.header}>설정</Text>
      <View style={styles.buttonsContainer}>
     
      <Button
  title="로그아웃"
  loading={false}
  loadingProps={{ size: 'small', color: 'white' }}
  buttonStyle={{
    backgroundColor: 'rgba(127, 220, 103, 1)',
    borderRadius: 10,
  }}
  titleStyle={{
    fontWeight: 'bold',
    fontSize: 15,
    paddingTop: 30,
    paddingBottom: 30,
  }}
  containerStyle={{
    height: 100,
    width: 100,
    marginRight: 60,
  }}
  onPress={() => navigation.navigate('Logout')}
/>
<Button
  title="개인 정보"
  loading={false}
  loadingProps={{ size: 'small', color: 'white' }}
  buttonStyle={{
    backgroundColor: 'rgba(127, 220, 103, 1)',
    borderRadius: 10,
  }}
  titleStyle={{
    fontWeight: 'bold',
    fontSize: 15,
    paddingTop: 30,
    paddingBottom: 30,
  }}
  containerStyle={{
    height: 100,
    width: 100,
  }}
  onPress={() => navigation.navigate('UserInfo')}
/>
</View>

    </View>
    
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  rowView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
});