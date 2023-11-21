import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

export type RootStackParam = {
  Main: {
    stu_num: string;
    stu_name: string;
    stu_type: string;
  };
  List: undefined;
  List1: undefined;
  List2: undefined;
  List3: undefined;
};

interface AppProps {}

const App: React.FC<AppProps> = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParam>>();
  const subjects: string[] = ['캡스톤디자인1', '운영체재개론', '통신네트워크및실습'];
  const [userData, setUserData] = useState<any>(null);

  useEffect(() => {
    // 서버에서 데이터를 가져오는 함수
    const fetchData = async () => {
      try {
        const response = await fetch('YOUR_API_ENDPOINT'); // 여기에 실제 API 엔드포인트를 넣어주세요
        const data = await response.json();
        setUserData(data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    // 화면이 처음 렌더링될 때 데이터를 가져오도록 설정
    fetchData();
  }, []);

  const handleSubjectPress = (selectedSubject: string, navigation: any) => {
    if (selectedSubject === '운영체재개론') {
      navigation.navigate('List2', { userData });
    } else if (selectedSubject === '통신네트워크및실습') {
      navigation.navigate('List3', { userData });
    } else {
      navigation.navigate('List1', { userData });
    }
  };

  return (
    <View style={styles.container}>
      <Text>과목을 선택하세요:</Text>
      {subjects.map((subject, index) => (
        <View key={index} style={styles.buttonContainer}>
          <Button
            title={subject}
            onPress={() => handleSubjectPress(subject, navigation)}
          />
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  buttonContainer: {
    marginVertical: 10,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default App;
