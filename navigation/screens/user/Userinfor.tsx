import React, { useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from '@rneui/themed';
import { useNavigation, RouteProp, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Auth } from 'aws-amplify';
import axios from 'axios';

type RootStackParam = {
  Userinfor: {
    stu_num: string;
    stu_name: string;
    stu_type: string;
  };
  MainAdmin: undefined;
  MainUser: undefined;
  List1: undefined;
  Main2: undefined;
};

type MainScreenRouteProp = RouteProp<RootStackParam, 'Userinfor'>;

type UserDataType = {
  user_id: string;
  name: string;
  department: string;
};

const UserInfo: React.FC = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParam>>();
  const route = useRoute<MainScreenRouteProp>();

  const [currentUser, setCurrentUser] = useState<any | null>(null);
  const [lambdaResponse, setLambdaResponse] = useState<string>('');
  const [userData, setUserData] = useState<UserDataType | null>(null);

  const fetchUserAndInvokeLambda = async () => {
    try {
      const user = await Auth.currentAuthenticatedUser();
      setCurrentUser(user);

      if (user) {
        const response = await invokeLambdaFunction(user);
        setLambdaResponse(response);
      }
    } catch (error) {
      console.log('사용자 정보를 가져오는 중 오류 발생:', error);
      setCurrentUser(null);
    }
  };

  const invokeLambdaFunction = async (user: any): Promise<string> => {
    try {
      const apiUrl = 'https://7uusyo40h0.execute-api.ap-northeast-2.amazonaws.com/sns-enrollment-stage/getusername';
      const userEmail = user.attributes?.email;

      const response = await axios.post(apiUrl, {
        email: userEmail,
      });

      if (response.data && response.data.body) {
        const parsedBody = JSON.parse(response.data.body);

        const userArray = parsedBody.user;

        if (userArray && userArray.length > 0) {
          const firstUser = userArray[0];

          setUserData(firstUser);
        } else {
          console.error('람다 함수 응답에서 유효한 "user" 데이터를 찾을 수 없습니다.');
        }
      } else {
        console.error('람다 함수 응답에서 유효한 "body" 데이터를 찾을 수 없습니다.');
      }

      const responseBody = response.data.body;
      return responseBody;
    } catch (error) {
      console.error('람다 함수 호출 중 오류 발생:', error);
      return ''; // 에러가 발생한 경우 빈 문자열 반환
    }
  };

  useEffect(() => {
    fetchUserAndInvokeLambda();
  }, []);

  return (
    <View style={styles.container}>
      {userData && (
        <View style={styles.userDataContainer}>
          <Text style={styles.userDataLabel}>학번:</Text>
          <Text style={styles.userData}>{userData.user_id}</Text>

          <Text style={styles.userDataLabel}>이름:</Text>
          <Text style={styles.userData}>{userData.name}</Text>

          <Text style={styles.userDataLabel}>학과:</Text>
          <Text style={styles.userData}>{userData.department}</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  userDataContainer: {
    padding: 20,
    borderRadius: 10,
    backgroundColor: '#f0f0f0',
    elevation: 3,
  },
  userDataLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  userData: {
    fontSize: 16,
    marginBottom: 10,
  },
});

export default UserInfo;
