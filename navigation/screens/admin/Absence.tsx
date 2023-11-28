import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { RouteProp } from '@react-navigation/native';
import { RootStackParam } from './MainAdmin';

type AbsenceScreenRouteProp = RouteProp<RootStackParam, 'Absence'>;

const Absence: React.FC = () => {
  const route = useRoute<AbsenceScreenRouteProp>();

  // Type guard to check if absentStudents and presentStudents are present in route.params
  const absentStudents: string[] =
    route.params && 'absentStudents' in route.params
      ? (route.params as { absentStudents: string[] }).absentStudents
      : [];

  const presentStudents: string[] =
    route.params && 'presentStudents' in route.params
      ? (route.params as { presentStudents: string[] }).presentStudents
      : [];

  return (
    <View style={styles.container}>
      <View style={styles.studentsContainer}>
        <Text style={styles.header}>결석 학생 목록</Text>
        <View style={styles.absentStudentsContainer}>
          {absentStudents.map((student, index) => (
            <Text key={index} style={styles.absentStudent}>
              {student}
            </Text>
          ))}
        </View>
      </View>
      <View style={styles.studentsContainer}>
        <Text style={styles.header}>출석 학생 목록</Text>
        <View style={styles.absentStudentsContainer}>
          {presentStudents.map((student, index) => (
            <Text key={index} style={styles.absentStudent}>
              {student}
            </Text>
          ))}
        </View>
      </View>
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
  studentsContainer: {
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
});

export default Absence;
