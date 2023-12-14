import React, { useEffect, useContext, useState } from 'react';
import { View, StyleSheet, ScrollView, Dimensions, TouchableOpacity, FlatList, TouchableWithoutFeedback } from 'react-native';
import { Text, Tab, TabView, ListItem, Button, Icon } from '@rneui/themed';
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

type StudentInfo = {
  id: string;
  name: string;
};

type AttdInfo = {
  week: number;
  data: {
    period: number;
    data: {
      name: string;
      attd: string;
    }[];
  }[];
};


const AdminSubject: React.FC = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParam>>();
  const route = useRoute<SubjectScreenRouteProp>();
  const context = useContext(AppContext);
  const [index, setIndex] = useState<number>(0);
  const [expanded, setExpanded] = useState<boolean[]>(Array(8).fill(false));
  const [enrollmentData, setEnrollmentData] = useState<AdminSubject[]>([]);//교수 강의과목
  const [attdData, setAttdData] = useState<AttdInfo[]>([]);//학생들 출석정보
  const [student, setStudent] = useState<StudentInfo[]>([]);//강의 학생들 목록
  const screenWidth = Dimensions.get('window').width;//화면 넓이

  const handleAccordionPress = (week: number) => {
    setExpanded((prevExpanded) => {
      const newExpanded = [...prevExpanded];
      newExpanded[week] = !newExpanded[week];
      return newExpanded;
    });
  };

  const invokeLambdaFunctionSubject = async () => {//교수님 담당 강의
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
            console.log('교수 강의 : ' + parsedBody.data);
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

  const invokeLambdaFunctionAttendance = async () => {//강의 학생들 목록 불러오기
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

            const transformedData: StudentInfo[] = (data as Array<{ user_id: string; name: string }>).map((std) => ({
              id: std.user_id,
              name: std.name,
            }));

            console.log('강의 학생들 : ' + transformedData);
            setStudent(transformedData);
            invokeLambdaFuncGetStudentAttd();//각 학생들 출석정보
          } else {
            console.log('람다 함수 응답에서 "getstudent" 데이터를 찾을 수 없습니다.');
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

  const invokeLambdaFuncGetStudentAttd = async () => {//강의 학생들 출석정보 불러오기
    try {
      const apiUrl = 'https://7uusyo40h0.execute-api.ap-northeast-2.amazonaws.com/sns-enrollment-stage/get/studentattendance';

      const response = await axios.post(apiUrl, {
        subj_id: context.subj_id,
        subj_part: context.subj_part
      });

      const responseBody = response.data.body;

      if (typeof responseBody === 'string' && responseBody.trim() !== '') {
        try {
          const parsedBody = JSON.parse(responseBody);

          if (parsedBody.data) {
            console.log('학생들 출석현황');

            parsedBody.data.forEach((std: any)=>{
              std.data.forEach((element: any) => {
                console.log(element.period);
                console.log(element.data);
              });
            });

            setAttdData(parsedBody.data);

          } else {
            console.log('람다 함수 응답에서 유효한 "get/studentattendance"를 찾을 수 없습니다.');
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
      <View style={styles.header2}>
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
              fontSize: 15,
              borderWidth: 7,
              borderColor: 'rgba(0,102,255,0)',
              height: 40,
            }}
          />
        ))}
      </Tab>
      <TabView value={index} onChange={setIndex} animationType="spring">
        {enrollmentData.map((subject, i) => (
          <TabView.Item key={i} style={{ backgroundColor: 'primary', width: '70%', flex: 1 }}>
            <ScrollView style={{ backgroundColor: 'white', }}>
              {[...Array(8).keys()].map((week) => (
                <ListItem.Accordion
                  key={week}
                  content={
                    <ListItem.Content>
                      <ListItem.Title style={{ fontSize: 20, marginLeft: 10 }}>{`${week + 1}주차`}</ListItem.Title>
                    </ListItem.Content>
                  }
                  isExpanded={expanded[week]}
                  onPress={() => handleAccordionPress(week)}
                  style={{ borderBottomWidth: 3, borderBottomColor: 'rgb(200,200,200)', marginBottom: 2, }}
                >
                  <ListItem style={{ borderBottomWidth: 3, borderBottomColor: 'rgb(200,200,200)', }}>
                    <ListItem.Content>
                      <ListItem.Title>
                        <View style={{ flexDirection: 'column', justifyContent: 'flex-start' }}>
                          {attdData.map((attd: any) => {
                            if (attd.week === week + 1) {
                              return attd.data.map((periodInfo: any) => (
                                <View key={`${week + 1}-${periodInfo.period}`} style={{ marginBottom: 50 }}>
                                  <Text style={{ fontSize: 17, margin: 5 }}>{`< ${periodInfo.period}교시 >`}</Text>
                                  <View style={{ flexDirection: 'row', justifyContent: 'flex-start', flexWrap: 'wrap', width: screenWidth }}>
                                    {periodInfo.data.map((studentInfo: any) => (
                                      <View key={`${week + 1}-${periodInfo.period}-${studentInfo.name}`} style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', marginBottom: 10, marginRight: 20 }}>
                                        <Text style={{ fontSize: 15, marginBottom: 10, marginRight: 5 }}>{studentInfo.name}</Text>
                                        <TouchableOpacity style={{
                                          backgroundColor: studentInfo.attd === "출석" ? 'white' : 'orange',
                                          borderWidth: 1,
                                          borderColor: studentInfo.attd === "출석" ? 'blue' : 'rgba(0, 0, 255, 0)',
                                          padding: 10,
                                          borderRadius: 5,
                                        }}>
                                          <Text style={{ fontSize: 15, color: studentInfo.attd === "출석" ? 'black' : 'white' }}>{studentInfo.attd}</Text>
                                        </TouchableOpacity>
                                      </View>
                                    ))}
                                  </View>
                                </View>
                              ));
                            }
                            return null;
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
  header2: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderBottomWidth: 2,
    borderBottomColor: '#2EFEF7',
  },
});

export default AdminSubject;