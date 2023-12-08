import React, { useEffect, useState, useRef, useContext } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TouchableWithoutFeedback, Alert } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import axios from 'axios';
import AppContext from '../../../AppContext';
import { useNavigation } from '@react-navigation/native';
import { Icon } from '@rneui/base';


type RootStackParam = {
  Main: undefined;
  MainAdmin: undefined;
  MainUser: undefined;
  List1: undefined;
  Main2: undefined;
  Subject: undefined;
};

type StudentData = {
  user_id : string;
  name : string;
};

type AttdData = {
  id : string;
  attd : string;
};

const Absence: React.FC = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParam>>();
  const [serverState, setServerState] = useState<string>('');
  const [absentStudents, setAbsentStudents] = useState<string[]>([]); // 결석 학생 배열
  const [attendanceStudents, setAttendanceStudents] = useState<string[]>([]); // 출석 학생 배열
  const [combinedStudents, setCombinedStudents] = useState<AttdData[]>([]); // 합쳐진 학생 배열
  const [allStudents, setAllStudents] = useState<StudentData[]>([]);//모든 학생 정보
  const webSocket = useRef<WebSocket | null>(null);
  const context = useContext(AppContext); // 전역변수
  const [subjId, setSubjId] = useState<string>('');
  const [subjPart, setSubjPart] = useState<string>('');

  const invokeLambdaFunction = async () => {
    try {
      const apiUrl = 'https://7uusyo40h0.execute-api.ap-northeast-2.amazonaws.com/sns-enrollment-stage/getstudent';

      const response = await axios.post(apiUrl, {
        adminId: context.id,
        subjId: '310037',
        subjPart: '13',
      });

      // 응답 데이터 확인
      console.log('람다 함수 응답 전체:', response.data);

      // "user" 키 확인
      if (response.data && response.data.body) {
        const parsedBody = JSON.parse(response.data.body);

        // "user" 배열 내의 요소들을 absentStudents에 추가
        const users = parsedBody.data || [];
        const absentStudentNames = users.map((user: { user_id: string; name: string }) => user.name);
        setAbsentStudents(absentStudentNames);
        setAllStudents(users);
      } else {
        console.error('람다 함수 응답에서 유효한 "body" 데이터를 찾을 수 없습니다.');
      }
    } catch (error) {
      console.error('람다 함수 호출 중 오류:', error);
    }
  };

  const invokeLambdaFunctionEnrollment = async () => {
    try {
      const apiUrl = 'https://7uusyo40h0.execute-api.ap-northeast-2.amazonaws.com/sns-enrollment-stage/enrollment/admin';

      const response = await axios.post(apiUrl, {
        adminId: context.id,
      });

      // 응답 데이터 확인
      console.log('람다 함수 응답 전체:', response.data);

      // "user" 키 확인
      if (response.data && response.data.body) {
        const parsedBody = JSON.parse(response.data.body);

        const DataArray = parsedBody.data;
        console.log(DataArray);

        if (DataArray && DataArray.length > 0) {
          setSubjId(DataArray[0].subjId);
          setSubjPart(DataArray[0].subjPart);
        }
      } else {
        console.error('람다 함수 응답에서 유효한 "body" 데이터를 찾을 수 없습니다.');
      }
    } catch (error) {
      console.error('람다 함수 호출 중 오류:', error);
    }
  };




  const combineStudents = () => {

    const updatedCombinedStudents = allStudents.map(student => {
      const isAbsent = absentStudents.find(absentStudent => absentStudent === student.name);
      const attdData: AttdData = {
        id: student.user_id, // Assuming 'user_id' is the appropriate identifier
        attd: isAbsent ? '결석' : '출석',
      };
      return attdData;
    });
  
    setCombinedStudents(updatedCombinedStudents);
    lambdaStudentAttendance(updatedCombinedStudents);//람다호출 => DB 데이터 저장
    
  };


  const lambdaStudentAttendance = async (item : AttdData[]) => {
    try {
      const apiUrl = 'https://7uusyo40h0.execute-api.ap-northeast-2.amazonaws.com/sns-enrollment-stage/set/studentattendance';

      const response = await axios.post(apiUrl, {
        subj_id: '310037',
        subj_part: '13',
        week: '4',
        period: '1',
        start: '0',
        users: item
      });

      // 응답 데이터 확인
      console.log('람다 함수 응답 전체:', response.data);
    } catch (error) {
      console.error('람다 함수 호출 중 오류:', error);
    }
  };




  const handleAttendanceEnd = () => {
    // 출석 종료 시 수행할 작업 추가
    console.log('출석 종료 버튼이 눌렸습니다.');

    
    Alert.alert(
      '강의 종료 안내',
      '강의 종료 시에는 "강의 종료" 버튼을 눌러주세요.',
      [
        { text: '확인', onPress: () => console.log('강의 종료 안내 확인 버튼 눌림') },
      ],
      { cancelable: false }
    );

    // 합쳐진 학생 배열 업데이트
    combineStudents();

    // 페이지 이동
    navigation.goBack();
  };

  useEffect(() => {
    invokeLambdaFunction();
    invokeLambdaFunctionEnrollment();
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
      let parse = JSON.parse(e.data);

      if (parse.subj_id === '310037' && parse.subj_part === '13') {
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

  const handleStudentClick = (studentName: string) => {
    // 학생 이름을 출석 목록에 추가
    setAttendanceStudents((prevAttendanceStudents) => {
      // attendanceStudents 배열에 이미 존재하지 않는 경우에만 추가
      if (!prevAttendanceStudents.includes(studentName)) {
        // absentStudents 배열에서 해당 학생 제외
        setAbsentStudents((prevAbsentStudents) =>
          prevAbsentStudents.filter((student) => student !== studentName)
        );
  
        // attendanceStudents 배열에 새로운 학생 추가
        return [...prevAttendanceStudents, studentName];
      }
  
      // 이미 출석 목록에 있는 경우 이전 배열을 그대로 반환
      return prevAttendanceStudents;
    });
  };
  const moveStudentToAbsentList = (studentName: string) => {
    // 결석 목록에 추가
    setAbsentStudents((prevAbsentStudents) => [...prevAbsentStudents, studentName]);

    // 출석 목록에서 제거
    setAttendanceStudents((prevAttendanceStudents) =>
      prevAttendanceStudents.filter((student) => student !== studentName)
    );
  };
  return (
    <>
      <View style={styles.header2}>
        <TouchableWithoutFeedback onPress={() => navigation.goBack()}>
          <Icon name="arrow-left" size={24} />
        </TouchableWithoutFeedback>
      </View>
      <View style={styles.container}>
        <ScrollView contentContainerStyle={styles.column}>
          <Text style={styles.header}>결석 학생 목록</Text>
          <View style={styles.absentStudentsContainer}>
            {absentStudents.map((student, index) => (
              <TouchableOpacity
                key={index}
                style={styles.studentClickable} // 추가: 클릭 가능한 스타일
                onPress={() => handleStudentClick(student)} // 추가: 클릭 시 핸들러 호출
              >
                <Text style={styles.absentStudent}>{student}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>

        <ScrollView contentContainerStyle={styles.column}>
        <Text style={styles.header}>출석 학생 목록</Text>
        <View style={styles.absentStudentsContainer}>
          {attendanceStudents.map((student, index) => (
            <TouchableOpacity
              key={index}
              style={styles.studentClickable}
              onPress={() => moveStudentToAbsentList(student)}
            >
              <Text style={styles.absentStudent}>{student}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      </View>

      {/* 출석 종료 버튼 */}
      <TouchableOpacity style={styles.attendanceEndButton} onPress={handleAttendanceEnd}>
        <Text style={styles.attendanceEndButtonText}>출석 종료</Text>
      </TouchableOpacity>
    </>
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
    backgroundColor: '#819FF7',  //목록 배경
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  absentStudent: {
    fontSize: 15,
    color: 'black',
    textAlign: 'center',
  },
  // 출석 종료 버튼 스타일
  attendanceEndButton: {
    marginTop: 'auto', // marginTop을 'auto'로 설정하여 최대한 아래로 이동
    marginBottom: 40,  // marginBottom은 그대로 유지
    marginRight: 40,
    marginLeft: 40,
    backgroundColor: 'blue',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center'
  },
  attendanceEndButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  studentClickable: {
    padding: 10,
    borderRadius: 5,
    backgroundColor: '#E6E6E6',  //클릭 배경
    marginVertical: 5,
    alignItems: 'center',
  },
  header2: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderBottomWidth: 2,
    borderBottomColor: '#0101DF',
  },
});

export default Absence;
