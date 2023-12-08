import React, { useEffect, useState, useContext, useRef } from 'react';
import { View, ScrollView, StyleSheet, Alert, ImageBackground, Linking } from 'react-native';
import { Button, ButtonGroup, withTheme, Text } from '@rneui/themed';
import AppContext from '../../../AppContext';
import { useNavigation, RouteProp, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import TouchID from 'react-native-touch-id';
import Absence from '../admin/Absence';
import WifiManager, { WifiEntry } from 'react-native-wifi-reborn';


export type RootStackParam = {
  MainUser: {
    stu_num: string;
    stu_name: string;
    stu_type: string;
  };
  List1: undefined;
  UserSubject:undefined;
  UserSettings: undefined;
  UserChat:undefined;
};

let userInWifi=false;


export const MainUser = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParam>>();
  const route = useRoute<RouteProp<RootStackParam, 'MainUser'>>();
  const context = useContext(AppContext);//전역변수
  
  const [serverState, setServerState] = useState('Loading...');
  const [messageText, setMessageText] = useState('아직안받음');
  //const [userInWifi, setUserInWifi] = useState(false);//강의실 내에 위치하면 true

  const webSocket = useRef<WebSocket | null>(null);
  function openExternalLink(url: string) {
    Linking.openURL(url)
      .then(() => console.log(`Opened external link: ${url}`))
      .catch((error) => console.error(`Error opening external link: ${url}`, error));
  }


  function touchFunc(){
    TouchID.isSupported()
        .then((supported) => {
          if (supported) {
            TouchID.authenticate('지문을 스캔해주세요')
              .then((success: boolean) => {
                if (success) {
                  Alert.alert(`지문 인식 성공! ${context.name}`); // 'Alert.alert'를 사용하여 경고 메시지를 표시합니다.
  
                  let str = JSON.stringify({
                    name: context.name,
                    subj_id: "310037",
                    subj_part: "13",

                  });
                  webSocket.current?.send(str);
                } else {
                  Alert.alert('지문 인식 실패!'); // 'Alert.alert'를 사용하여 경고 메시지를 표시합니다.
                }
              })
              .catch((error: Error) => {
                console.log('지문 인식 오류', error);
              });
          } else {
            Alert.alert('이 기기에서는 지문 인식을 지원하지 않습니다.'); // 'Alert.alert'를 사용하여 경고 메시지를 표시합니다.
          }
        });
  }
  const scanWifi = async () => {//와이파이 스캔
    try {
      const wifiArray = await WifiManager.loadWifiList();

      for (let i = 0; i < wifiArray.length; i++) {
        if (wifiArray[i].SSID == "n509") {
          // Alert.alert('알림', '강의실 내에 위치합니다');
          console.log(wifiArray[i].SSID);
          // if(!userInWifi) setUserInWifi(true);
          userInWifi=true;
          console.log(userInWifi);
          return;
        }
      }
      // setUserInWifi(false);
      userInWifi=false;
      Alert.alert('경고', '강의실 외부에 있습니다. 강의실로 돌아가세요');
    } catch (error) {
      console.error('Error scanning wifi:', error);
    }
  };

  const AttdScanWifi = async () => {
    try {
      const wifiArray = await WifiManager.loadWifiList();

      for (let i = 0; i < wifiArray.length; i++) {
        if (wifiArray[i].SSID == "n509"||wifiArray[i].SSID == "404A-03") {
          // Alert.alert('알림', '강의실 내에 위치합니다');
          console.log(wifiArray[i].SSID);
          // if(!userInWifi) setUserInWifi(true);
          userInWifi=true;
          console.log(userInWifi);

          Alert.alert('알림', '출석을 시작합니다', [{ text: '확인', onPress: () => touchFunc()}]);
          return;
        }
      }
      // setUserInWifi(false);
      userInWifi=false;
      Alert.alert('알림', '출석이 시작되었습니다. 강의실로 들어가주세요.');
    } catch (error) {
      console.error('Error scanning wifi:', error);
    }
  };

  const AbsScanWifi = async () => {
    try {
      const wifiArray = await WifiManager.loadWifiList();

      for (let i = 0; i < wifiArray.length; i++) {
        if (wifiArray[i].SSID == "n509" ||wifiArray[i].SSID == "404A-03" ) {
          // Alert.alert('알림', '강의실 내에 위치합니다');
          console.log(wifiArray[i].SSID);
          // if(!userInWifi) setUserInWifi(true);
          userInWifi=true;
          console.log(userInWifi);

          Alert.alert('알림', '강의가 종료되었습니다. 2차 출석을 진행합니다', [{ text: '확인', onPress: () => touchFunc() }]);
          return;
        }
      }
      // setUserInWifi(false);
      userInWifi=false;
      Alert.alert('알림', '강의가 종료되었습니다.');
    } catch (error) {
      console.error('Error scanning wifi:', error);
    }
  };


  useEffect(() => {
    webSocket.current = new WebSocket('http://210.119.103.171:8080');

    // onopen event handler
    webSocket.current.onopen = () => {
      setServerState('Connected to the server');
    };

    // onerror event handler
    webSocket.current.onerror = (e) => {
      setServerState(e.message);
    };

    // onclose event handler
    webSocket.current.onclose = (e) => {
      setServerState('Disconnected. Check internet or server.');
    };

    webSocket.current.onmessage = e => {//값 받기
      let parse = JSON.parse(e.data);
      console.log('출석',parse.message);
      setMessageText(parse.serverMessage);

      if (parse.message === "출석") {
        context.setAttdStart(true);//wifi 실시간 스캔 시작
        AttdScanWifi();
      }
      if (parse.message === "종료") {
        context.setAttdStart(false);//wifi 실시간 스캔 종료
        AbsScanWifi();
      }
    };

    // 10초마다 scanWifi 함수 호출
    const intervalId = setInterval(() => {
      if(context.attendanceStart) scanWifi();//강의가 시작되었을 때 스캔 시작
    }, context.wifiDelay);//5분마다 스캔 반복

    return () => {
      if (webSocket.current) {
        (webSocket.current as WebSocket).close();
      }
      clearInterval(intervalId);
    };
  }, []);
  return (
    <View style={styles.contentView}>
      <Text style={styles.subHeader}>스마트 출석부</Text>
      <View style={styles.buttonsContainer}>
        <View style={styles.rowView}>
          <Button
            title="출석현황"
            loading={false}
            loadingProps={{ size: 'small', color: 'white' }}
            buttonStyle={{
              backgroundColor: 'rgba(111, 202, 186, 1)',
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
              marginLeft: 60,
            }}
            onPress={() => navigation.navigate('UserSubject')}
          />
          <Button
            title="설정"
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
            onPress={() => navigation.navigate('UserSettings')}
          />
        </View>
        <View style={styles.rowView}>
          <Button
            title="출석"
            loading={false}
            loadingProps={{ size: 'small', color: 'white' }}
            buttonStyle={{
              backgroundColor: 'rgba(150, 190, 103, 1)',
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
              marginLeft: 60,
              marginVertical: 40, // 버튼 사이의 간격을 벌리기 위해 수정
            }}
            onPress={() => touchFunc()}
          />
          <Button
            title="종료"
            loading={false}
            loadingProps={{ size: 'small', color: 'white' }}
            buttonStyle={{
              backgroundColor: 'rgba(110, 100, 210, 1)',
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
              marginVertical: 40, // 버튼 사이의 간격을 벌리기 위해 수정
            }}
            onPress={() => touchFunc()}
          />
          </View>
          <View style={styles.rowView}>
          <Button
            title="셔틀 버스"
            loading={false}
            loadingProps={{ size: 'small', color: 'white' }}
            buttonStyle={{
              backgroundColor: '#00BFFF',
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
              marginLeft: 60,
            }}
            onPress={() => openExternalLink('https://lily.sunmoon.ac.kr/Page2/About/About08_04_01.aspx')}
          />
          <Button
            title="포털"
            loading={false}
            loadingProps={{ size: 'small', color: 'white' }}
            buttonStyle={{
              backgroundColor: '#FE2EC8',
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
            onPress={() => openExternalLink('https://lily.sunmoon.ac.kr/Page2/Etc/Login.aspx')}
          />
          </View>
          <View style={styles.rowView}>
          <Button
            title="학사 정보"
            loading={false}
            loadingProps={{ size: 'small', color: 'white' }}
            buttonStyle={{
              backgroundColor: '#BC0303',
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
              marginLeft: 60,
              marginVertical: 40,
            }}
            onPress={() => openExternalLink('https://sws.sunmoon.ac.kr/Login.aspx')}
          />
          <Button
            title="E-강의동"
            loading={false}
            loadingProps={{ size: 'small', color: 'white' }}
            buttonStyle={{
              backgroundColor: '#DBED15',
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
              marginVertical: 40,
            }}
            onPress={() => openExternalLink('https://lms.sunmoon.ac.kr/ilos/m/main/Login_form.acl')}
          />
          </View>
        </View>
      </View>
);
};

const styles = StyleSheet.create({
contentView: {
  backgroundColor: "#FFFFFF",
  flex: 1,
},
subHeader: {
  backgroundColor: "#FFFFFF",
  color: "#2089dc",
  textAlign: "center",
  paddingVertical: 10,
  marginBottom: 10,
  fontSize: 20
},
rowView: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  width: '100%',
},
buttonsContainer: {
  flexWrap: 'wrap',
  justifyContent: 'space-between',
  alignItems: 'center',
  width: '100%',
  marginVertical: 20,
},
header: {
  flexDirection: 'row',
  alignItems: 'center',
  padding: 10,
  borderBottomWidth: 1,
  borderBottomColor: '#ddd',
}
});