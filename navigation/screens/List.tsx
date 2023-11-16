import React from 'react';
import { View, Text, Button } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export const App: React.FC = () => {
  const subjects: string[] = ['캡스톤디자인1', '운영체재개론', '통신네트워크및실습'];
  const navigation = useNavigation();

  const handleSubjectPress = (subject: string) => {
    navigation.navigate('List1', { selectedSubject: subject });
  };

  return (
    <View style={styles.container}>
      <Text>과목을 선택하세요:</Text>
      {subjects.map((subject, index) => (
        <Button
          key={index}
          title={subject}
          onPress={() => handleSubjectPress(subject)} />
      ))}
    </View>
  );
};

