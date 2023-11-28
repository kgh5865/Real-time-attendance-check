import React, { useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from '@rneui/themed';
import { useNavigation, RouteProp, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { UserDataType, AdminDataType } from '../../userdata';
import { Auth } from 'aws-amplify';
import axios from 'axios';

type RootStackParam = {
  Subject: {
    stu_num: string;
    stu_name: string;
    stu_type: string;
  };
  MainAdmin: undefined;
  MainUser: undefined;
  Main: undefined;
};

type MainScreenRouteProp = RouteProp<RootStackParam, 'Subject'>;

const Subject: React.FC = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParam>>();
  const route = useRoute<MainScreenRouteProp>();

  const [currentUser, setCurrentUser] = useState<any | null>(null);
  const [lambdaResponse, setLambdaResponse] = useState<string>('');
  const [userData, setUserData] = useState<UserDataType | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchUserAndInvokeLambda = async () => {
    try {
      const user = await Auth.currentAuthenticatedUser();
      setCurrentUser(user);

      // 사용자가 있는 경우에만 람다 함수 호출
      if (user) {
        const response = await invokeLambdaFunctionEnroll(user);
        setLambdaResponse(response);
      }
    } catch (error) {
      console.log('사용자 정보를 가져오지 못했습니다:', error);
      setCurrentUser(null);
    } finally {
      setLoading(false);
    }
  };
  
  const invokeLambdaFunctionEnroll = async (user: any): Promise<string> => {
    try {
      const apiUrl = 'https://7uusyo40h0.execute-api.ap-northeast-2.amazonaws.com/sns-enrollment-stage/enrollment';
      const userEmail = user.attributes?.email;
  
      const response = await axios.post(apiUrl, {
        email: userEmail,
      });
  
      // 람다 함수 응답 확인
      console.log('람다 함수 응답 전체:', response.data);
  
      let responseBody = response.data.body;

      console.log('람다 함수 응답 데이터:', responseBody);
  
      try {
        // 람다 함수 응답이 JSON인 경우 파싱
        const parsedBody = JSON.parse(responseBody);
        const userArray = parsedBody.user;
  
        if (userArray && userArray.length > 0) {
          const firstUser = userArray[0];
          setUserData(firstUser);
        } else {
          console.log('람다 함수 응답에서 유효한 "user" 데이터를 찾을 수 없습니다.');
        }
      } catch (jsonParseError) {
        // JSON 파싱에 실패하면 문자열로 처리
        console.error('람다 함수 응답 JSON 파싱 오류:', jsonParseError);
        console.log('람다 함수 응답을 문자열로 처리합니다.');
        console.log('람다 함수 응답 데이터 (문자열):', responseBody);
      }
  
      return responseBody;
    } catch (error) {
      console.error('람다 함수 호출 중 오류:', error);
      return ''; // 에러가 발생한 경우 빈 문자열 반환
    }
  };
  useEffect(() => {
    //fetchUserAndInvokeLambda();
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
      {userData && (
        <>
          <Text style={styles.userDataText}>학번: {userData.user_id}</Text>
          <Text style={styles.userDataText}>이름: {userData.name}</Text>
          <Text style={styles.userDataText}>학과: {userData.department}</Text>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  contentView: {
    backgroundColor: "#E4E4E4",
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
  responseText: {
    marginTop: 20,
    textAlign: 'center',
    fontSize: 16,
    color: 'black',
  },
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

export default Subject;
