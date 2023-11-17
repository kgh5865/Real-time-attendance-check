import React, { useEffect, useState } from 'react';
import { View, ScrollView, StyleSheet, Alert } from 'react-native';
import { Button, ButtonGroup, withTheme, Text } from '@rneui/themed';
import { useNavigation, RouteProp, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Auth } from 'aws-amplify';


export type RootStackParam = {
  Main: {
    stu_num: string;
    stu_name: string;
    stu_type: string;
  };
  List: undefined;
  List1: undefined;
  Main2: undefined;
};



export const Main = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParam>>();
  const route = useRoute<RouteProp<RootStackParam, 'Main'>>();


  /*사용자 정보 가져오기 */
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    // 컴포넌트가 마운트되었을 때, 현재 인증된 사용자 정보를 가져옴
    fetchCurrentUser();
  }, []);

  const fetchCurrentUser = async () => {//현재 사용자 정보 가져오기
    try {
      const user = await Auth.currentAuthenticatedUser();
      setCurrentUser(user);
    } catch (error) {
      console.log('사용자 정보를 가져오는 데 실패했습니다:', error);
      setCurrentUser(null);
    }
  };
  /*사용자 정보 가져오기 */

  const func = () => {
    if ((currentUser as any).attributes?.sub === 'c97c8114-6021-4f95-b5fe-6c03f71f3f7b') {
      console.log('교수입니다');
      navigation.navigate('Main2');
    } else {
      console.log('학생입니다.');
      navigation.navigate('Main2');
    }
  };

  return (
    <View style={styles.contentView}>
            <Text style={styles.subHeader}>스마트 출석부</Text>
            <View style={styles.buttonsContainer}>
  <View style={styles.rowView}>
    <Button
      title="학생용"
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

      onPress={() => func()}
    
    />
    <Button
      title="교수용"
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
      onPress={() => func()}
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