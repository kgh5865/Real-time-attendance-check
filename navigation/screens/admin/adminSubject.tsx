import React, { useEffect, useContext, useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, Tab, TabView, ListItem } from '@rneui/themed';
import { useNavigation, RouteProp, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import axios from 'axios';
import AppContext from '../../../AppContext';

type RootStackParam = {
  AdminSubject: {
    stu_num: string;
    stu_name: string;
    stu_type: string;
  };
  MainAdmin: undefined;
  MainUser: undefined;
  Main: undefined;
};

type SubjectScreenRouteProp = RouteProp<RootStackParam, 'AdminSubject'>;

type AdminSubject = {
  subj_id: string;
  subj_part: number;
  admin_id: string;
  subj_nm: string;
  credit: string;
};

type UserAttd = {
  attd: string;
  period: number;
  week: number;
};

const AdminSubject: React.FC = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParam>>();
  const route = useRoute<SubjectScreenRouteProp>();
  const context = useContext(AppContext);
  const { id: contextId } = useContext(AppContext);
  const [index, setIndex] = useState<number>(0);
  const [expanded, setExpanded] = useState<boolean[]>(Array(8).fill(false));
  const [enrollmentData, setEnrollmentData] = useState<AdminSubject[]>([]);
  const [attdData, setAttdData] = useState<UserAttd[]>([]);
  const [id, setIdState] = useState<string[]>([
    '2019225104',
    '2021380092',
    '2019225146',
    '2019225015',
    '2019225141',
    '2019225111',
  ]);
  const handleAccordionPress = (week: number) => {
    setExpanded((prevExpanded) => {
      const newExpanded = [...prevExpanded];
      newExpanded[week] = !newExpanded[week];
      return newExpanded;
    });
  };

  const invokeLambdaFunctionSubject = async () => {
    try {
      const apiUrl = 'https://7uusyo40h0.execute-api.ap-northeast-2.amazonaws.com/sns-enrollment-stage/enrollment/admin';

      const response = await axios.post(apiUrl, {
        adminId: context.id,
      });

      const responseBody = response.data.body;

      if (typeof responseBody === 'string' && responseBody.trim() !== '') {
        try {
          const parsedBody = JSON.parse(responseBody);

          if (parsedBody.data) {
            console.log(parsedBody.data);
            setEnrollmentData(parsedBody.data);
          } else {
            console.log('람다 함수 응답에서 유효한 "data"를 찾을 수 없습니다.');
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
      const apiUrl = 'https://7uusyo40h0.execute-api.ap-northeast-2.amazonaws.com/sns-enrollment-stage/getstudent';

      const response = await axios.post(apiUrl, {
        adminId: context.id,
        subjId: context.subj_id,
        subjPart: context.subj_part
      });
      console.log(context.id, context.subj_id, context.subj_part);

      const responseBody = response.data.body;

      if (responseBody) {
        try {
          const parsedBody = JSON.parse(responseBody);

          if (parsedBody.data && parsedBody.data !== undefined) {
            const data = parsedBody.data;
            
            console.log(parsedBody.data);
            console.log('출석 람다응답:', parsedBody);

            setAttdData(data);
          } else {
            console.log('람다 함수 응답에서 "attendance" 데이터를 찾을 수 없습니다.');
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
              borderColor: 'rgba(0,102,255,0)',
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
                  <View style={{ flexDirection: 'column', justifyContent: 'flex-start' }}>
                    {attdData.map((attdItem) => {
                      if (attdItem.week === week + 1) {
                        console.log('정보확인' + attdItem.week);
                        return (
                          <View
                            key={`${attdItem.week}-${attdItem.period}`}
                            style={{ flexDirection: 'row', justifyContent: 'space-between', width: '100%' }}
                          >
                            <Text>{attdItem.period + '교시'}</Text>
                            <Text>{attdItem.attd}</Text>
                          </View>
                        );
                      } else {
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

export default AdminSubject;