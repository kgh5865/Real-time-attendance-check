import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { RouteProp } from '@react-navigation/native';
import { RootStackParam } from './MainAdmin';

type AbsenceScreenRouteProp = RouteProp<RootStackParam, 'Absence'>;

const Absence: React.FC = () => {
  const route = useRoute<AbsenceScreenRouteProp>();

  const attendanceData: { stu_num: string; stu_name: string; attendance: string; absence: string }[] =
    route.params && 'attendanceData' in route.params
      ? (route.params as { attendanceData: { stu_num: string; stu_name: string; attendance: string; absence: string }[] }).attendanceData
      : [];

  return (
    <ScrollView>
      <View style={styles.container}>
        <View style={styles.table}>
          <View style={styles.rowHeader}>
            <Text style={styles.headerText}>학번</Text>
            <Text style={styles.headerText}>이름</Text>
            <Text style={styles.headerText}>출석</Text>
            <Text style={styles.headerText}>결석</Text>
          </View>
          {attendanceData.map((data, index) => (
            <View key={index} style={styles.row}>
              <Text style={styles.cell}>{data.stu_num}</Text>
              <Text style={styles.cell}>{data.stu_name}</Text>
              <Text style={styles.cell}>{data.attendance}</Text>
              <Text style={styles.cell}>{data.absence}</Text>
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#E4E4E4',
  },
  table: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    paddingVertical: 10,
    margin: 20,
  },
  rowHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '80%',
    marginVertical: 10,
  },
  headerText: {
    fontSize: 16,
    fontWeight: 'bold',
    width: '20%',
    textAlign: 'center',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '80%',
    marginVertical: 5,
  },
  cell: {
    fontSize: 16,
    width: '20%',
    textAlign: 'center',
  },
});

export default Absence;
