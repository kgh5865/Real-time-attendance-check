import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

interface AppProps {}

const App: React.FC<AppProps> = () => {
  const subjects: string[] = ['캡스톤디자인1', '운영체재개론', '통신네트워크및실습'];

  return (
    <View style={styles.container}>
      <Text>과목을 선택하세요:</Text>
      {subjects.map((subject, index) => (
        <View key={index} style={styles.buttonContainer}>
          <Button
            title={subject}
            onPress={() => console.log(`선택한 과목: ${subject}`)}
          />
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  buttonContainer: {
    marginVertical: 10, // 원하는 간격으로 조절
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default App;