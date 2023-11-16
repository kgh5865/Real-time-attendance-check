
import React, { useEffect, useState } from 'react';
import { View, ScrollView, StyleSheet, Alert } from 'react-native';
import { Button, ButtonGroup, withTheme, Text } from '@rneui/themed';
import { useNavigation, RouteProp, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

export type RootStackParam = {
    Logout : undefined;
}
const navigation = useNavigation<NativeStackNavigationProp<RootStackParam>>();

export const Settings: React.FC = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.header}>설정 및 로그아웃</Text>
      <Button
      title="로그아웃"
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
      onPress={() => navigation.navigate('Logout')}
    /> 
    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
});

