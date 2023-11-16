import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

export const List = () => {
  const subjects: string[] = ['캡스톤디자인1', '운영체재개론', '통신네트워크및실습'];

  return (
    <View style={styles.container}>
      <Text>과목을 선택하세요:</Text>
      {subjects.map((subject, index) => (
        <Button
          key={index}
          title={subject}
          onPress={() => (`선택한 과목: ${String(subject)}`)}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    buttonContainer: {
      marginVertical: 40, // 원하는 간격으로 조절
    },
  },
});