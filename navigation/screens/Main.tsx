import React, { useEffect, useState } from 'react';
import { View, ScrollView, StyleSheet, Alert } from 'react-native';
import { Button, ButtonGroup, withTheme, Text } from '@rneui/themed';
import { useNavigation, RouteProp, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import TouchID from 'react-native-touch-id';

export type RootStackParam = {
  Main: {
    stu_num: string;
    stu_name: string;
    stu_type: string;
  };
  List: undefined;
};

function touchFunc(){
  TouchID.isSupported()
      .then((supported) => {
        if (supported) {
          TouchID.authenticate('지문을 스캔해주세요')
            .then((success: boolean) => {
              if (success) {
                Alert.alert('지문 인식 성공!'); // 'Alert.alert'를 사용하여 경고 메시지를 표시합니다.
              } else {
                Alert.alert('지문 인식 실패!'); // 'Alert.alert'를 사용하여 경고 메시지를 표시합니다.
              }
            })
            .catch((error: Error) => {
              console.log('지문 인식 오류', error);
            });
        } else {
          Alert.alert('이 기기에서는 지문 인식을 지원하지 않습니다.'); // 'Alert.alert'를 사용하여 경고 메시지를 표시합니다.
        }
      });
}

export const Main = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParam>>();
  const route = useRoute<RouteProp<RootStackParam, 'Main'>>();

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

      onPress={() => navigation.navigate('List')}
    
    />
    <Button
      title="쪽지보내기"
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
      onPress={() => console.log('쪽지보내기')}
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
      onPress={() => touchFunc()}
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
      onPress={() => touchFunc()}
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
    fontSize: 20
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
  }
});