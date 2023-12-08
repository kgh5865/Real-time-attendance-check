import React, { useEffect, useState, useContext } from 'react';
import { View, StyleSheet, TouchableWithoutFeedback ,Alert} from 'react-native';
import { Text, Icon } from '@rneui/themed';
import { useNavigation, RouteProp, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Auth } from 'aws-amplify';
import axios from 'axios';
import WifiManager, { WifiEntry } from 'react-native-wifi-reborn';
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

  const scanWifi = async () => {
    try {
      const wifiArray = await WifiManager.loadWifiList();

      for (let i = 0; i < wifiArray.length; i++) {
        if (wifiArray[i].SSID == "404A-03" || wifiArray[i].SSID == "n509" ) {
          Alert.alert('알림', '강의실 내에 위치합니다');
          return;
        }
      }
      Alert.alert('경고', '강의실 외부에 있습니다. 강의실로 돌아가세요');
    } catch (error) {
      console.error('Error scanning wifi:', error);
    }
  };

  useEffect(() => {
    // 10초마다 scanWifi 함수 호출
    const intervalId = setInterval(() => {
      //if(context.attendanceStart) scanWifi();//강의가 시작되었을 때 스캔 시작
    }, context.wifiDelay);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <>
      <View style={styles.header}>
        <TouchableWithoutFeedback onPress={() => navigation.goBack()}>
          <Icon name="arrow-left" size={24} />
        </TouchableWithoutFeedback>
      </View>
      <View style={styles.container}>
        <View style={styles.userDataContainer}>
          <Text style={styles.userDataLabel}>학번 / 사번:</Text>
          <Text style={styles.userData}>{context.id}</Text>

          <Text style={styles.userDataLabel}>이름:</Text>
          <Text style={styles.userData}>{context.name}</Text>

          <Text style={styles.userDataLabel}>학과:</Text>
          <Text style={styles.userData}>{context.department}</Text>
        </View>
      </View>
    </>
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderBottomWidth: 2,
    borderBottomColor: '#3ADF00',
  },
});

export default UserInfo;