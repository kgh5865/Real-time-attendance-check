import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Button, FlatList } from 'react-native';

interface WeeklyAttendanceData {
  date: string; // 날짜 정보를 추가
  week: number;
  attendance: number;
  absence: number;
  tardiness: number;
}

const List1: React.FC = () => {
  const [weeklyAttendance, setWeeklyAttendance] = useState<WeeklyAttendanceData[]>([]);

  useEffect(() => {
    // 서버에서 주차별 출결 정보를 가져오는 함수 (실제로는 서버 API 호출 등)
    const fetchWeeklyAttendance = async () => {
      // 간단한 예제로 가상의 주차별 출결 정보를 생성
      const fakeWeeklyAttendance = getFakeWeeklyAttendance();
      setWeeklyAttendance(fakeWeeklyAttendance);
    };

    // 주차별 출결 정보 가져오기
    fetchWeeklyAttendance();
  }, []);

  const getFakeWeeklyAttendance = (): WeeklyAttendanceData[] => {
    const fakeData: WeeklyAttendanceData[] = [];

    for (let week = 1; week <= 5; week++) {
      const currentDate = new Date();
      const formattedDate = new Date(currentDate.setDate(currentDate.getDate() + week)).toLocaleDateString();

      fakeData.push({
        date: formattedDate, // 날짜 정보 추가
        week,
        attendance: Math.floor(Math.random() * 10) + 1,
        absence: Math.floor(Math.random() * 3),
        tardiness: Math.floor(Math.random() * 5),
      });
    }

    return fakeData;
  };

  const renderWeeklyAttendanceItem = ({ item }: { item: WeeklyAttendanceData }) => (
    <View style={styles.weeklyAttendanceItem}>
      <Text>{`${item.date}, 주차 ${item.week}`}</Text>
      <Text>{`출석: ${item.attendance}회`}</Text>
      <Text>{`결석: ${item.absence}회`}</Text>
      <Text>{`지각: ${item.tardiness}회`}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text>운영체재개론 출석 현황</Text>
      {weeklyAttendance.length > 0 ? (
        <FlatList
          data={weeklyAttendance}
          keyExtractor={(item) => item.date}
          renderItem={renderWeeklyAttendanceItem}
        />
      ) : (
        <Text>출석 정보를 불러오는 중입니다...</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  weeklyAttendanceItem: {
    marginBottom: 20,
  },
});

export default List1;