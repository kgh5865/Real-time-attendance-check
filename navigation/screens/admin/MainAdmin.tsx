import React, { useEffect, useState, useRef, useContext } from 'react';
import { View, ScrollView, StyleSheet, Alert, Linking } from 'react-native';
import { Button, ButtonGroup, withTheme, Text } from '@rneui/themed';
import { useNavigation, RouteProp, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import AppContext from '../../../AppContext';

export type RootStackParam = {
  MainAdmin: {
    stu_num: string;
    stu_name: string;
    stu_type: string;
  };
  Main: undefined;
  AdminSettings: undefined;
  Absence: undefined;
  Absence2: undefined;
  AdminChat: undefined;
  AdminSubject: undefined;
};



export const MainAdmin = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParam>>();
  const route = useRoute<RouteProp<RootStackParam, 'MainAdmin'>>();
  const [serverState, setServerState] = useState('Loading...');
  const context = useContext(AppContext);//전역변수

  const webSocket = useRef<WebSocket | null>(null);

  function openExternalLink(url: string) {
    Linking.openURL(url)
      .then(() => console.log(`Opened external link: ${url}`))
      .catch((error) => console.error(`Error opening external link: ${url}`, error));
  }

  const absenceStart = () => {
    if (!context.attendanceStart) {
      let str = JSON.stringify({ message: "출석" });
      webSocket.current?.send(str);
      context.setAttdStart(true);
    }
    else {
      Alert.alert('알림', '현재 강의 진행 중입니다');
    }

    console.log(serverState);
  };
  const absenceFin = () => {
    if (context.attendanceStart) {
      let str = JSON.stringify({ message: "종료" });
      webSocket.current?.send(str);
      context.setAttdStart(false);
    }
    else {
      Alert.alert('알림', '강의가 시작되지 않았습니다.');
    }

  };

  useEffect(() => {
    webSocket.current = new WebSocket(context.apiUrl);

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
    };


    return () => {
      if (webSocket.current) {
        (webSocket.current as WebSocket).close();
      }
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

            onPress={() => navigation.navigate('AdminSubject')}

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
            onPress={() => navigation.navigate('AdminSettings')}
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
            onPress={() => absenceStart()/*navigation.navigate('Absence')*/}
            onPressIn={() => navigation.navigate('Absence')}
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
            onPress={() => absenceFin()/*navigation.navigate('Absence')*/}
            onPressIn={() => navigation.navigate('Absence2')}
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
              backgroundColor: '#FA8258',
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
              backgroundColor: '#F781D8',
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
  }
});