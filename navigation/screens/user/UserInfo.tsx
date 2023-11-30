import React, { useEffect, useState, useContext } from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from '@rneui/themed';
import { useNavigation, RouteProp, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Auth } from 'aws-amplify';
import axios from 'axios';
import AppContext from '../../../AppContext';

type RootStackParam = {
  Userinfo: undefined;
  MainAdmin: undefined;
  MainUser: undefined;
  List1: undefined;
  Main2: undefined;
};

type MainScreenRouteProp = RouteProp<RootStackParam, 'Userinfo'>;

type UserDataType = {
  user_id: string;
  name: string;
  department: string;
};

const UserInfo: React.FC = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParam>>();
  const route = useRoute<MainScreenRouteProp>();

  const context = useContext(AppContext);//전역변수

  useEffect(() => {
  }, []);

  return (
    <View style={styles.container}>
        <View style={styles.userDataContainer}>
          <Text style={styles.userDataLabel}>학번:</Text>
          <Text style={styles.userData}>{context.id}</Text>

          <Text style={styles.userDataLabel}>이름:</Text>
          <Text style={styles.userData}>{context.name}</Text>

          <Text style={styles.userDataLabel}>학과:</Text>
          <Text style={styles.userData}>{context.department}</Text>
        </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  userDataContainer: {
    padding: 20,
    borderRadius: 10,
    backgroundColor: '#f0f0f0',
    elevation: 3,
  },
  userDataLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  userData: {
    fontSize: 16,
    marginBottom: 10,
  },
});

export default UserInfo;