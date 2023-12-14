import React from 'react';
import { useContext, useEffect } from 'react';
import { View, StyleSheet, Alert, TouchableWithoutFeedback } from 'react-native';
import { Button, Text, Icon } from '@rneui/themed';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import WifiManager, { WifiEntry } from 'react-native-wifi-reborn'; // 와이파이 모듈 추가
import AppContext from '../../../AppContext';


export type RootStackParam = {
  Logout: undefined;
  UserInfo: undefined;
  wifi: undefined;
};

export const UserSettings: React.FC = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParam>>();
  const context = useContext(AppContext);


  const scanWifi = async () => {
    try {
      const wifiArray = await WifiManager.loadWifiList();
      wifiArray.map((wifi: any) => {
        console.log('name : ', wifi.SSID, ' Mac : ', wifi.BSSID);
      });
      for (let i = 0; i < wifiArray.length; i++) {
        if (wifiArray[i].BSSID === "90:9f:33:5b:03:da") {
          Alert.alert('알림', 'Nlab입니다.');
          return;
        } else if (wifiArray[i].BSSID === "70:5d:cc:d4:f0:5e") {
          Alert.alert('알림', `캡스톤디자인 강의실입니다.`);
          return;
        } else if (wifiArray[i].SSID === "iPhone///") {
          Alert.alert('알림', '');
          return;
        }
      }

      Alert.alert('알림', '연결 끊김');
      console.log(wifiArray);
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
        <Text style={styles.headerTitle}>설정</Text>
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
              color: 'black'
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
              color: 'black'
            }}
            containerStyle={{
              height: 100,
              width: 100,
            }}
            onPress={() => navigation.navigate('UserInfo')}
          />
        </View>
        <View style={styles.rowView}>
          <Button
            title="강의실 확인"
            loading={false}
            loadingProps={{ size: 'small', color: 'white' }}
            buttonStyle={{
              backgroundColor: 'rgba(127, 220, 103, 1)',
              borderRadius: 10,
              //marginTop: 20, // 여기에 추가된 부분
            }}
            titleStyle={{
              fontWeight: 'bold',
              fontSize: 15,
              paddingTop: 30,
              paddingBottom: 30,
              color: 'black'
            }}
            containerStyle={{
              height: 100,
              width: 100,
              marginLeft: 75,
              marginVertical: 40, // 버튼 사이의 간격을 벌리기 위해 수정
            }}
            onPress={() => scanWifi()}
          />
          <Button
            title="Wi-Fi 목록"
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
              color: 'black'
            }}
            containerStyle={{
              height: 100,
              width: 100,
              marginRight: 75,
              marginVertical: 40,
            }}
            onPress={() => navigation.navigate('wifi')}
          />
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
    backgroundColor: '#FFFFFF',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderBottomWidth: 2,
    borderBottomColor: '#7401DF',
  },
  rowView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
});

