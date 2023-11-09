import React, { useState, useEffect } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { Button, ButtonGroup, withTheme, Text } from '@rneui/themed';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

export type RootStackParam = {
  Login: undefined;
  Main: {
    stu_num: number;
  };
};

export const Login = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParam>>();

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text style={{ color: 'black', fontSize: 30 }}>로그인</Text>
      <Button 
        title="로그인" 
        onPress={() => navigation.navigate('Main', {
          stu_num: 2019225146,
      })} 
        />
    </View>
  );
};