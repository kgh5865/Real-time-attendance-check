import React, { useEffect, useContext, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Tab, TabView, ListItem } from '@rneui/themed';
import { useNavigation, RouteProp, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Auth } from 'aws-amplify';
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

const UserSubject: React.FC = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParam>>();
  const route = useRoute<SubjectScreenRouteProp>();
  const context = useContext(AppContext);

  const [index, setIndex] = useState<number>(0);
  const [expanded1, setExpanded1] = useState<boolean>(false);
  const [expanded2, setExpanded2] = useState<boolean>(false);
  const [expanded3, setExpanded3] = useState<boolean>(false);

  const [enrollmentData, setEnrollmentData] = useState<UserSubject[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchEnrollmentData = async () => {
    try {
      const user = await Auth.currentAuthenticatedUser();
      if (user) {
        const response = await invokeLambdaFunctionSubject(user);
        setEnrollmentData(response);
      }
    } catch (error) {
      console.log('과목 정보를 가져오지 못했습니다:', error);
    } finally {
      setLoading(false);
    }
  };

  const invokeLambdaFunctionSubject = async (user: any): Promise<UserSubject[]> => {
    try {
      const apiUrl = 'https://7uusyo40h0.execute-api.ap-northeast-2.amazonaws.com/sns-enrollment-stage/enrollment';
      const userEmail = user.attributes?.email;

      const response = await axios.post(apiUrl, {
        userId: context.id,
      });

      console.log('람다 함수 응답 전체:', response.data);

      const responseBody = response.data.body;

      if (typeof responseBody === 'string' && responseBody.trim() !== '') {
        try {
          const parsedBody = JSON.parse(responseBody);

          if (parsedBody.enrollment) {
            return parsedBody.enrollment;
          } else {
            console.log('람다 함수 응답에서 유효한 "enrollment" 데이터를 찾을 수 없습니다.');
          }
        } catch (jsonParseError) {
          console.error('JSON 응답 파싱 오류:', jsonParseError);
        }
      } else {
        console.log('람다 함수 응답이 유효한 JSON 문자열이 아닙니다.');
      }

      return [];
    } catch (error) {
      console.error('람다 함수 호출 중 오류:', error);
      return [];
    }
  };

  useEffect(() => {
    fetchEnrollmentData();
  }, []);

  if (loading) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

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
      fontSize: 13, // 텍스트 크기 조절
      padding: 5, // 패딩 조절
      borderWidth: 5, // 테두리 추가
    }}
  />
))}
    </Tab>

    <TabView value={index} onChange={setIndex} animationType="spring">
      {enrollmentData.map((subject, i) => (
        <TabView.Item key={i} style={{ backgroundColor: 'primary', width: '70%', flex: 1 }}>
          <View style={styles.container}>
            <ListItem.Accordion
              content={
                <>
                  <ListItem.Content>
                    <ListItem.Title>1주차</ListItem.Title>
                  </ListItem.Content>
                </>
              }
              isExpanded={expanded1}
              onPress={() => setExpanded1(!expanded1)}
            >
              <ListItem>
              <ListItem.Content>
                  <ListItem.Title >asdfa</ListItem.Title>
                </ListItem.Content>

              </ListItem>
            </ListItem.Accordion>
          </View>
        </TabView.Item>
      ))}
    </TabView>
  </>
);
};

const styles = StyleSheet.create({
  userDataText: {
    fontSize: 16,
    marginVertical: 5,
    color: 'black', // 텍스트 색상 추가
  },
  container: {
    flex: 1, // 여기를 수정
    justifyContent: 'center',
    alignItems: 'center',
  },
  listItemContent: {
    fontSize: 16, // 여기를 수정
    paddingHorizontal: 16,
  },
  tableRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between', // 여기를 수정
    borderBottomWidth: 1,
    borderBottomColor: 'gray',
    paddingVertical: 8,
  },
  tableCellHeader: {
    fontWeight: 'bold',
    marginRight: 8, // 여기를 수정
    textAlign: 'center',
    fontSize: 14, // 헤더 텍스트 크기 조정
  },
  tableCell: {
    marginRight: 8,
    textAlign: 'center',
    fontSize: 16, // 셀 텍스트 크기 조정
  },
});

export default UserSubject;