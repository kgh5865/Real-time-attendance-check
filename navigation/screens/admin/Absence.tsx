import React, { useEffect, useState, useRef, useContext } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useNavigation, RouteProp, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Auth } from 'aws-amplify';
import axios from 'axios';
import AppContext from '../../../AppContext';

type RootStackParam = {
  Main: undefined;
  MainAdmin: undefined;
  MainUser: undefined;
  List1: undefined;
  Main2: undefined;
  Subject: undefined;
};

const Absence: React.FC = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParam>>();
  const [serverState, setServerState] = useState<string>('');
  const [absentStudents, setAbsentStudents] = useState<string[]>([]); // State to store absent students
  const [attendanceStudents, setAttendanceStudents] = useState<string[]>([]);
  const webSocket = useRef<WebSocket | null>(null);
  const context = useContext(AppContext); // 전역변수

  const invokeLambdaFunction = async () => {
    try {
      const apiUrl = 'https://7uusyo40h0.execute-api.ap-northeast-2.amazonaws.com/sns-enrollment-stage/getstudent';

      const response = await axios.post(apiUrl, {
        adminId: context.id,
        subjId: "310037",
        subjPart: "13"
      });

      // 응답 데이터 확인
      console.log('람다 함수 응답 전체:', response.data);

      // "user" 키 확인
      if (response.data && response.data.body) {
        const parsedBody = JSON.parse(response.data.body);

        // "user" 배열 내의 요소들을 absentStudents에 추가
        const users = parsedBody.data || [];
        const absentStudentNames = users.map((user: { user_id: string, name: string }) => user.name);
        setAbsentStudents(absentStudentNames);
      } else {
        console.error('람다 함수 응답에서 유효한 "body" 데이터를 찾을 수 없습니다.');
      }
    } catch (error) {
      console.error('람다 함수 호출 중 오류:', error);
    }
  };

  const handleAttendanceEnd = () => {
    // 여기에 출석 종료 시 수행할 작업 추가
    console.log('출석 종료 버튼이 눌렸습니다.');
    navigation.goBack();
  };

  useEffect(() => {
    invokeLambdaFunction();
    webSocket.current = new WebSocket('http://210.119.103.171:8080');

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

    webSocket.current.onmessage = (e) => {
      // 값 받기
      let parse = JSON.parse(e.data);

      if (parse.subj_id === '310037' && parse.subj_part === '13') {
        console.log(parse.name);

        // 받아온 이름을 attendanceStudents에 추가
        setAttendanceStudents((prevAttendanceStudents) => {
          // attendanceStudents 배열에 이미 존재하지 않는 경우에만 추가
          if (!prevAttendanceStudents.includes(parse.name)) {
            // absentStudents 배열에서 해당 학생 제외
            setAbsentStudents((prevAbsentStudents) =>
              prevAbsentStudents.filter((student) => student !== parse.name)
            );

            return [...prevAttendanceStudents, parse.name];
          }

          return prevAttendanceStudents;
        });
      }
    };

    // Cleanup function
    return () => {
      if (webSocket.current) {
        (webSocket.current as WebSocket).close();
      }
    };
  }, []);

  // Empty dependency array means this effect runs once after initial render

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.column}>
        <Text style={styles.header}>결석 학생 목록</Text>
        <View style={styles.absentStudentsContainer}>
          {absentStudents.map((student, index) => (
            <Text key={index} style={styles.absentStudent}>
              {student}
            </Text>
          ))}
        </View>
      </ScrollView>

      <ScrollView contentContainerStyle={styles.column}>
        <Text style={styles.header}>출석 학생 목록</Text>
        <View style={styles.absentStudentsContainer}>
          {attendanceStudents.map((student, index) => (
            <Text key={index} style={styles.absentStudent}>
              {student}
            </Text>
          ))}
        </View>
      </ScrollView>

      {/* 출석 종료 버튼 */}
      <TouchableOpacity style={styles.attendanceEndButton} onPress={handleAttendanceEnd}>
        <Text style={styles.attendanceEndButtonText}>출석 종료</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row', // Display columns side by side
    justifyContent: 'space-around', // Add space around the columns
    alignItems: 'center',
    backgroundColor: '#E4E4E4',
  },
  column: {
    flex: 1, // Take equal space
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  absentStudentsContainer: {
    width: '80%',
    padding: 10,
    backgroundColor: 'white',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  absentStudent: {
    fontSize: 16,
    marginBottom: 10,
  },
  // 출석 종료 버튼 스타일
  attendanceEndButton: {
    marginTop: 'auto', // marginTop을 'auto'로 설정하여 최대한 아래로 이동
    marginBottom: 10, // marginBottom은 그대로 유지
    backgroundColor: 'blue',
    padding: 10,
    borderRadius: 5,
  },
  
  attendanceEndButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default Absence;