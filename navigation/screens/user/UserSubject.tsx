import React, { useEffect, useContext, useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableWithoutFeedback, Alert, TouchableOpacity } from 'react-native';
import { Text, Tab, TabView, ListItem, Icon } from '@rneui/themed';
import { useNavigation, RouteProp, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import axios from 'axios';
import AppContext from '../../../AppContext';
import WifiManager, { WifiEntry } from 'react-native-wifi-reborn';

type RootStackParam = {
  UserSubject: {
    stu_num: string;
    stu_name: string;
    stu_type: string;
  };
  MainAdmin: undefined;
  MainUser: undefined;
  Main: undefined;
};

type SubjectScreenRouteProp = RouteProp<RootStackParam, 'UserSubject'>;

type UserSubject = {
  subj_id: string;
  subj_part: number;
  admin_id: string;
  subj_nm: string;
  credit: string;
};


type UserAttd = {//출석정보 틀
  attd: string;
  period: number;
  week: number;
};

const UserSubject: React.FC = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParam>>();
  const route = useRoute<SubjectScreenRouteProp>();
  const context = useContext(AppContext);

  const [index, setIndex] = useState<number>(0);
  const [expanded, setExpanded] = useState<boolean[]>(Array(8).fill(false));
  const [enrollmentData, setEnrollmentData] = useState<UserSubject[]>([]);//수강정보
  const [attdData, setattdData] = useState<UserAttd[]>([]);//출석정보 배열

  const handleAccordionPress = (week: number) => {
    setExpanded((prevExpanded) => {
      const newExpanded = [...prevExpanded];
      newExpanded[week] = !newExpanded[week];
      return newExpanded;
    });
  };

  const invokeLambdaFunctionSubject = async () => {
    try {
      const apiUrl = 'https://7uusyo40h0.execute-api.ap-northeast-2.amazonaws.com/sns-enrollment-stage/enrollment';

      const response = await axios.post(apiUrl, {
        userId: context.id
      });

      console.log('과목 람다 함수 응답 전체:', response.data);

      const responseBody = response.data.body;

      if (typeof responseBody === 'string' && responseBody.trim() !== '') {
        try {
          const parsedBody = JSON.parse(responseBody);

          if (parsedBody.enrollment) {
            setEnrollmentData(parsedBody.enrollment);
          } else {
            console.log('람다 함수 응답에서 유효한 "enrollment" 데이터를 찾을 수 없습니다.');
          }
        } catch (jsonParseError) {
          console.error('JSON 응답 파싱 오류:', jsonParseError);
        }
      } else {
        console.log('람다 함수 응답이 유효한 JSON 문자열이 아닙니다.');
      }
    } catch (error) {
      console.error('람다 함수 호출 중 오류:', error);
    }
  };


  const invokeLambdaFunctionAttendance = async () => {
    try {
      const apiUrl = 'https://7uusyo40h0.execute-api.ap-northeast-2.amazonaws.com/sns-enrollment-stage/getuserattendance';

      const response = await axios.post(apiUrl, {
        userId: context.id,
        subj_id: context.subj_id,
        subj_part: context.subj_part
      });

      const responseBody = response.data.body;

      if (typeof responseBody === 'string') {
        const parsedBody = JSON.parse(responseBody);

        if (parsedBody && parsedBody.attendance !== undefined) {
          const data = parsedBody.attendance;

          console.log('출석 람다응답:', parsedBody);

          setattdData(data);
        } else {
          console.log('람다 함수 응답에서 "attendance" 데이터를 찾을 수 없습니다.');
        }
      } else {
        console.log('람다 함수 응답이 유효한 JSON 문자열이 아닙니다.');
      }
    } catch (error) {
      console.error('람다 함수 호출 중 오류:', error);
    }
  };

  const scanWifi = async () => {
    try {
      const wifiArray = await WifiManager.loadWifiList();

      for (let i = 0; i < wifiArray.length; i++) {
        if (wifiArray[i].BSSID == "70:5d:cc:d4:f0:5e" || wifiArray[i].BSSID == "90:9f:33:5b:03:da") {
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
    invokeLambdaFunctionSubject();
    invokeLambdaFunctionAttendance();

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
      <Tab
        value={index}
        onChange={setIndex}
        indicatorStyle={{
          backgroundColor: 'white',
          height: 3,
        }}
        variant="primary"
      >
        {enrollmentData.map((subject, i) => (
          <Tab.Item
            key={i}
            title={subject.subj_nm}
            titleStyle={{
              fontSize: 13,
              borderWidth: 7,
              borderColor: "rgba(0,102,255,0)",
              height: 180,
            }}
          />
        ))}
      </Tab>

      <TabView value={index} onChange={setIndex} animationType="spring">
        {enrollmentData.map((subject, i) => (
          <TabView.Item key={i} style={{ backgroundColor: 'primary', width: '70%', flex: 1 }}>
            <ScrollView>
              {[...Array(8).keys()].map((week) => (
                <ListItem.Accordion
                  key={week}
                  content={
                    <>
                      <ListItem.Content>
                        <ListItem.Title>{`${week + 1}주차`}</ListItem.Title>
                      </ListItem.Content>
                    </>
                  }
                  isExpanded={expanded[week]}
                  onPress={() => handleAccordionPress(week)}
                >
                  <ListItem>
                    <ListItem.Content>
                      <ListItem.Title>
                        <View style={{ flexDirection: "column", justifyContent: "flex-start" }}>
                          {attdData.map((attdItem) => {
                            // attdItem에서 week와 현재 주차(week)를 비교
                            if (attdItem.week === week + 1) {
                              return (
                                <View key={`${attdItem.week}-${attdItem.period}`} style={{ flexDirection: "row", justifyContent: "space-between", width: "100%" }}>
                                  <Text style={{ marginRight: 30, fontSize: 17 }}>{attdItem.period + '교시'}</Text>
                                  <TouchableOpacity style={{
                                          backgroundColor: attdItem.attd === "출석" ? 'white' : 'orange',
                                          borderWidth: 1,
                                          borderColor: attdItem.attd === "출석" ? 'blue' : 'rgba(0, 0, 255, 0)',
                                          padding: 10,
                                          borderRadius: 5,
                                          marginBottom: 3,
                                        }}>
                                          <Text style={{ fontSize: 15, color: attdItem.attd === "출석" ? 'black' : 'white' }}>{attdItem.attd}</Text>
                                  </TouchableOpacity>
                                </View>
                              );
                            } else {
                              // 주차가 다르면 빈 컴포넌트 반환s
                              return null;
                            }
                          })}
                        </View>
                      </ListItem.Title>
                    </ListItem.Content>
                  </ListItem>
                </ListItem.Accordion>
              ))}
            </ScrollView>
          </TabView.Item>
        ))}
      </TabView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderBottomWidth: 2,
    borderBottomColor: '#DF0101',
  }
});

export default UserSubject;