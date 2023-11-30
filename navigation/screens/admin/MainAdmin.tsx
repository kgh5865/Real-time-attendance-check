import React from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { Button, Text } from '@rneui/themed';
import { useNavigation, RouteProp, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

export type RootStackParam = {
  MainAdmin: {
    stu_num: string;
    stu_name: string;
    stu_type: string;
  };
  Subject: undefined;
  List1: undefined;
  Main: undefined;
  Settings: undefined;
  Absence: undefined;
};

const MainAdmin: React.FC = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParam>>();
  const route = useRoute<RouteProp<RootStackParam, 'MainAdmin'>>();

  const func = () => {
    Alert.alert('알림', '출석을 진행합니다', [
      { text: '확인', onPress: () => navigation.navigate('Absence') },
    ]);
  };

  const func1 = () => {
    Alert.alert('알림', '출석종료를 진행합니다'); [
      { text: '확인', onPress: () => navigation.navigate('Absence') },
    ];
  };
  return (
    <View style={styles.contentView}>
      <Text style={styles.subHeader}>스마트 출석부</Text>
      <View style={styles.buttonsContainer}>
        <Text style={{ color: 'black', fontSize: 20 }}>{route.params?.stu_num}</Text>
        <Text style={{ color: 'black', fontSize: 17 }}>{route.params?.stu_name}</Text>
        <Text style={{ color: 'black', fontSize: 17 }}>{route.params?.stu_type}</Text>
        <View style={styles.rowView}>
          <Button
            title="출석현황"
            loading={false}
            loadingProps={{ size: 'small', color: 'white' }}
            buttonStyle={{
              backgroundColor: 'rgba(111, 202, 186, 1)',
              borderRadius: 10,
            }}
            titleStyle={{
              fontWeight: 'bold',
              fontSize: 15,
              paddingTop: 30,
              paddingBottom: 30,
            }}
            containerStyle={{
              height: 100,
              width: 100,
              marginLeft: 60,
            }}
            onPress={() => navigation.navigate('Subject')}
          />
          <Button
            title="설정"
            loading={false}
            loadingProps={{ size: 'small', color: 'white' }}
            buttonStyle={{
              backgroundColor: 'rgba(127, 220, 103, 1)',
              borderRadius: 10,
            }}
            titleStyle={{
              fontWeight: 'bold',
              fontSize: 15,
              paddingTop: 30,
              paddingBottom: 30,
            }}
            containerStyle={{
              height: 100,
              width: 100,
              marginRight: 60,
            }}
            onPress={() => navigation.navigate('Settings')}
          />
        </View>
        <View style={styles.rowView}>
          <Button
            title="출석"
            loading={false}
            loadingProps={{ size: 'small', color: 'white' }}
            buttonStyle={{
              backgroundColor: 'rgba(150, 190, 103, 1)',
              borderRadius: 10,
            }}
            titleStyle={{
              fontWeight: 'bold',
              fontSize: 15,
              paddingTop: 30,
              paddingBottom: 30,
            }}
            containerStyle={{
              height: 100,
              width: 100,
              marginLeft: 60,
              marginVertical: 40, // 버튼 사이의 간격을 벌리기 위해 수정
            }}
            onPress={func}
          />
          <Button
            title="종료"
            loading={false}
            loadingProps={{ size: 'small', color: 'white' }}
            buttonStyle={{
              backgroundColor: 'rgba(110, 100, 210, 1)',
              borderRadius: 10,
            }}
            titleStyle={{
              fontWeight: 'bold',
              fontSize: 15,
              paddingTop: 30,
              paddingBottom: 30,
            }}
            containerStyle={{
              height: 100,
              width: 100,
              marginRight: 60,
              marginVertical: 40, // 버튼 사이의 간격을 벌리기 위해 수정
            }}
            onPress={func1}
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  contentView: {
    backgroundColor: "#E4E4E4",
    flex: 1,
  },
  subHeader: {
    backgroundColor: "#FFFFFF",
    color: "#2089dc",
    textAlign: "center",
    paddingVertical: 10,
    marginBottom: 10,
    fontSize: 20,
  },
  rowView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  buttonsContainer: {
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginVertical: 20,
  },
});

export default MainAdmin;
