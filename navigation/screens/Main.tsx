import React, { useEffect, useState } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { Button, ButtonGroup, withTheme, Text } from '@rneui/themed';
import { useNavigation, RouteProp, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

export type RootStackParam = {
  Login: undefined;
  Main: {
    stu_num: number;
  };
};

export const Main = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParam>>();
  const route = useRoute<RouteProp<RootStackParam, 'Main'>>();

  return (
    <View style={styles.contentView}>
      <Text style={styles.subHeader}>스마트 출석부</Text>
      <View style={styles.buttonsContainer}>
      <Text style={{ color: 'black', fontSize: 20 }}>{route.params?.stu_num}</Text>
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
              paddingBottom: 30
            }}
            containerStyle={{
              height: 100,
              width: 100,
              marginLeft: 60
            }}
            onPress={() => console.log('aye')}
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
              paddingBottom: 30
            }}
            containerStyle={{
              height: 100,
              width: 100,
              marginRight: 60
            }}
            onPress={() => console.log('aye')}
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