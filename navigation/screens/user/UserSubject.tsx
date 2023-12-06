import React, { useEffect, useContext, useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableWithoutFeedback } from 'react-native';
import { Text, Tab, TabView, ListItem } from '@rneui/themed';
import { useNavigation, RouteProp, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import axios from 'axios';
import AppContext from '../../../AppContext';

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
  
  
  useEffect(() => {
    invokeLambdaFunctionSubject();
    invokeLambdaFunctionAttendance();
  }, []);

  return (
    <>
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
                  console.log('정보확인'+attdItem.week);
                  return (
                    <View key={`${attdItem.week}-${attdItem.period}`} style={{ flexDirection: "row", justifyContent: "space-between", width: "100%" }}>
                      <Text>{attdItem.period+'교시'}</Text>
                      <Text>{attdItem.attd}</Text>
                    </View>
                  );
                } else {
                  // 주차가 다르면 빈 컴포넌트 반환
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
});

export default UserSubject;