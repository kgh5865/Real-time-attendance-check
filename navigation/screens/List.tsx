import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export const List: React.FC = () => {
  const subjects: string[] = ['캡스톤디자인1', '운영체재개론', '통신네트워크및실습'];

  const handleSubjectPress = (subject: string) => {
    // navigation.navigate('List1', { selectedSubject: subject });
  };

  return (
    <View>
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