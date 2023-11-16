import React, { useState, useEffect } from 'react';
import { Button, ButtonGroup, withTheme, Text } from '@rneui/themed';
import { useNavigation } from '@react-navigation/native';
import RadioButtonsGroup from 'react-native-radio-buttons-group';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { View, TextInput, Alert, StyleSheet } from 'react-native';


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  input: {
    width: '80%',
    height: 40,
    borderWidth: 1,
    marginBottom: 20,
    paddingLeft: 10,
  },
});
export type RootStackParam = {
  Login: undefined;
  Main: {
    stu_num: string;
    stu_name: string;
    stu_type: string;
  };
};


export const Login = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParam>>();
  const [studentId, setStudentId] = useState<string>('');
  const [name, setName] = useState<string>('');
  const [userType, setUserType] = useState<string>('');
  const handleLogin = (): void => {
    if (studentId && name) {
      Alert.alert('로그인 성공', `학번: ${studentId}\n이름: ${name}\n사용자 유형: ${userType}`); 
      navigation.navigate('Main', {
        stu_num: studentId , stu_name: name , stu_type: userType
      })
    } else {
      Alert.alert('오류', '학번 or 교번과 이름을 입력하세요.');
    }


  
  };
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>

       <TextInput
        style={styles.input}
        placeholder="학번 or 교번"
        onChangeText={(text: string) => setStudentId(text)}
        value={studentId}
      />
      <TextInput
        style={styles.input}
        placeholder="이름"
        onChangeText={(text: string) => setName(text)}
        value={name}
      />
      <TextInput
        style={styles.input}
        placeholder="사용자 유형"
        onChangeText={(text: string) => setUserType(text)}
        value={userType}
      />
      <Button title="로그인" onPress={handleLogin} />
    
    </View>
  );
};