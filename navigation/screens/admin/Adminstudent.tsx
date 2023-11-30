import React, { useEffect, useContext, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from '@rneui/themed';
import { useNavigation, RouteProp, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Auth } from 'aws-amplify';
import axios from 'axios';
import AppContext from '../../../AppContext';

type RootStackParam = {
    Adminstudent: {
    stu_num: string;
    stu_name: string;
    stu_type: string;
  };
  MainAdmin: undefined;
  MainUser: undefined;
  Main: undefined;
};

type SubjectScreenRouteProp = RouteProp<RootStackParam, 'Adminstudent'>;

// UserSubject 타입 재정의
type  Adminstudent = {
  subj_id: string;
  subj_part: number;
  admin_id: string;
  subj_nm: string;
  credit: string;
};

const Adminstudent: React.FC = () => {
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParam>>();
    const route = useRoute<SubjectScreenRouteProp>();
    const context = useContext(AppContext);
  
    const [enrollmentData, setEnrollmentData] = useState< Adminstudent[]>([]);
    const [loading, setLoading] = useState(true);
  
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
  
    const invokeLambdaFunctionSubject = async (user: any): Promise< Adminstudent[]> => {
      try {
        const apiUrl = 'https://7uusyo40h0.execute-api.ap-northeast-2.amazonaws.com/sns-enrollment-stage/getstudent';
        const userEmail = user.attributes?.email;
  
        const response = await axios.post(apiUrl, {
          adminId: context.id,
          subjId: '310037',
          subjPart:'13'
        });
  
        console.log('람다 함수 응답 전체:', response.data);
  
        const responseBody = response.data.body;
  
        // 데이터가 유효한 JSON 형식인지 확인
        if (typeof responseBody === 'string' && responseBody.trim() !== '') {
          try {
            const parsedBody = JSON.parse(responseBody);
  
            // 'enrollment' 키가 있는지 확인
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
        <View style={styles.userDataContainer}>
          {enrollmentData.map((subject, index) => (
            <View key={index}>
              <Text style={styles.userDataText}>학생: {subject.subj_id}</Text>
              <Text style={styles.userDataText}>과목: {subject.subj_nm}</Text>
              <Text style={styles.userDataText}>분반: {subject.subj_part}</Text>
    
              {/* 필요한 다른 과목 정보들도 여기에 추가하세요 */}
            </View>
          ))}
        </View>
      );
    };
    
    const styles = StyleSheet.create({
      userDataContainer: {
        marginTop: 20,
        alignItems: 'center',
      },
      userDataText: {
        fontSize: 16,
        color: 'black',
        marginVertical: 5,
      },
      container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
      },
    });
    
    export default Adminstudent;