import React, { useEffect, useState, useContext } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { Button, Text } from '@rneui/themed';
import { useNavigation, RouteProp, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import AppContext from '../../AppContext';
import { Auth } from 'aws-amplify';
import axios from 'axios';

type RootStackParam = {
  Main: undefined;
  MainAdmin: undefined;
  MainUser: undefined;
  List1: undefined;
  Main2: undefined;
  Subject: undefined;
};

const Main: React.FC = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParam>>();
  const context = useContext(AppContext);//전역변수

  const [currentUser, setCurrentUser] = useState<any | null>(null);
  const [lambdaResponse, setLambdaResponse] = useState<string>('');//람다 함수 응답
  // const [userData, setUserData] = useState<UserDataType | null>(null);
  // const [adminData, setadminData] = useState<AdminDataType | null>(null);

  const fetchUserAndInvokeLambda = async () => {
    try {
      const user = await Auth.currentAuthenticatedUser();
      setCurrentUser(user);

      // 사용자가 있는 경우에만 람다 함수 호출
      if (user) {
        const response = await invokeLambdaFunction(user);
        setLambdaResponse(response); // 람다 함수 응답을 state에 저장
      }
    } catch (error) {
      console.log('사용자 정보를 가져오지 못했습니다:', error);
      setCurrentUser(null);
    }
  };

  const invokeLambdaFunctionAdmin = async (user: any): Promise<string> => {
    try {
      const apiUrl = 'https://7uusyo40h0.execute-api.ap-northeast-2.amazonaws.com/sns-enrollment-stage/getadminname';
      const userEmail = user.attributes?.email;
  
      const response = await axios.post(apiUrl, {
        email: userEmail,
      });

      console.log(userEmail);

      // 응답 데이터 확인
      console.log('람다 함수 응답 전체:', response.data);
  
      // "user" 키 확인
    if (response.data && response.data.body) {
      const parsedBody = JSON.parse(response.data.body);

      // "user" 배열 내의 첫 번째 요소에 직접 접근
      const userArray = parsedBody.admin;

      if (userArray && userArray.length > 0) {
        context.setId(userArray[0].admin_id);
        context.setName(userArray[0].name);
        context.setDepartment(userArray[0].department);

      } else {

        console.error('람다 함수 응답에서 유효한 "admin" 데이터를 찾을 수 없습니다.');
      }
    } else {
      console.error('람다 함수 응답에서 유효한 "body" 데이터를 찾을 수 없습니다.');
    }

    const responseBody = response.data.body;
    return responseBody;
    }
    catch (error) {
    console.error('람다 함수 호출 중 오류:', error);
    return ''; // 에러가 발생한 경우 빈 문자열 반환
  }
  }

  const invokeLambdaFunction = async (user: any): Promise<string> => {
    try {
      const apiUrl = 'https://7uusyo40h0.execute-api.ap-northeast-2.amazonaws.com/sns-enrollment-stage/getusername';
      const userEmail = user.attributes?.email;
  
      const response = await axios.post(apiUrl, {
        email: userEmail,
      });
  
      // 응답 데이터 확인
      console.log('람다 함수 응답 전체:', response.data);
  
      // "user" 키 확인
    if (response.data && response.data.body) {
      const parsedBody = JSON.parse(response.data.body);

      // "user" 배열 내의 첫 번째 요소에 직접 접근
      const userArray = parsedBody.user;

      if (userArray && userArray.length > 0) {
        context.setId(userArray[0].user_id);
        context.setName(userArray[0].name);
        context.setDepartment(userArray[0].department);
        
      } else {

        console.log('람다 함수 응답에서 유효한 "user" 데이터를 찾을 수 없습니다.');
        invokeLambdaFunctionAdmin(user);
      }
    } else {
      console.error('람다 함수 응답에서 유효한 "body" 데이터를 찾을 수 없습니다.');
    }

    const responseBody = response.data.body;
    return responseBody;
    } catch (error) {
      console.error('람다 함수 호출 중 오류:', error);
      return ''; // 에러가 발생한 경우 빈 문자열 반환
    }
  };

  useEffect(() => {
    fetchUserAndInvokeLambda();
  }, []);

  const handleStudentPress = () => {
    if (currentUser && currentUser.attributes?.sub !== 'c97c8114-6021-4f95-b5fe-6c03f71f3f7b') {
      console.log('학생');
      Alert.alert('알림', '학생');
      navigation.navigate('MainUser');
    } else {
      console.log('교수');
      Alert.alert('알림', '교수는 학생 섹션에 접근할 수 없습니다');
    }
  };

  const handleProfessorPress = () => {
    if (currentUser && currentUser.attributes?.sub === 'c97c8114-6021-4f95-b5fe-6c03f71f3f7b') {
      console.log('교수');
      Alert.alert('알림', '교수');
      navigation.navigate('MainAdmin');
    } else {
      console.log('학생');
      Alert.alert('알림', '학생은 교수 섹션에 접근할 수 없습니다');
    }
  };

  return (
    <View style={styles.contentView}>
      <Text style={styles.subHeader}>스마트 출석부</Text>
      <View style={styles.buttonsContainer}>
        <View style={styles.rowView}>
          <Button
            title="학생"
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
            }}
            containerStyle={{
              height: 100,
              width: 100,
              marginLeft: 60,
            }}
            onPress={handleStudentPress}
          />
          <Button
            title="교수"
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
            }}
            containerStyle={{
              height: 100,
              width: 100,
              marginRight: 60,
            }}
            onPress={handleProfessorPress}
          />
        </View>
      </View>

      {/* 추가된 부분: 람다 함수 응답 및 사용자 데이터 화면에 표시 */}
      <View style={styles.userDataContainer}>
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
});

export default Main;