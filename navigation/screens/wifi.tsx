import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet,TouchableWithoutFeedback } from 'react-native';
import { PermissionsAndroid } from 'react-native';
import { Icon } from '@rneui/base';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation, RouteProp, useRoute } from '@react-navigation/native';
import WifiManager, { WifiEntry } from 'react-native-wifi-reborn'; // 와이파이 모듈 추가

export type RootStackParam = {
  MainUser: {
    stu_num: string;
    stu_name: string;
    stu_type: string;
  };
  
  Subject:undefined;
  Settings: undefined;
  UserChat:undefined;
};

const WifiList: React.FC = () => {
  const [wifiList, setWifiList] = useState<WifiEntry[]>([]);
  const route = useRoute<RouteProp<RootStackParam, 'MainUser'>>();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParam>>();
  // 와이파이 목록 가져오기
  const fetchWifiList = async () => {
    try {
      const wifiArray = await WifiManager.loadWifiList();
      setWifiList(wifiArray);
    } catch (error) {
      console.error('Error fetching wifi list:', error);
    }
  };

  useEffect(() => {
    // 컴포넌트가 마운트될 때와 업데이트될 때마다 와이파이 목록을 가져옴
    fetchWifiList();

    // 10초마다 와이파이 목록을 다시 가져오도록 설정
    const intervalId = setInterval(fetchWifiList, 1000);

    // 컴포넌트가 언마운트되면 interval 해제
    return () => clearInterval(intervalId);
  }, []);

  return (
    <>
    <View style={styles.header}>
        <TouchableWithoutFeedback onPress={() => navigation.goBack()}>
          <Icon name="arrow-left" size={24} />
        </TouchableWithoutFeedback>
      </View>
    <View style={styles.contentView}>
      <Text style={styles.subHeader}>스마트 출석부</Text>
      <ScrollView style={styles.scrollContainer}>
        {/* 와이파이 목록 출력 */}
        <Text style={styles.wifiHeader}>Available Wi-Fi Networks:</Text>
        {wifiList.map((wifi: WifiEntry) => (
          <Text key={wifi.BSSID} style={styles.wifiText}>
            {wifi.SSID}
          </Text>
        ))}
      </ScrollView>
    </View>
    </>
  );
};

const styles = StyleSheet.create({
  contentView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  scrollContainer: {
    flex: 1,
    margin: 20,
  },
  wifiHeader: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  wifiText: {
    fontSize: 16,
    color: 'black',
    marginVertical: 5,
  },
  subHeader: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderBottomWidth: 2,
    borderBottomColor: '#3ADF00',
  },
});

export default WifiList;