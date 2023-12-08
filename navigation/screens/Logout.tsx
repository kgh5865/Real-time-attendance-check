import { StyleSheet, Text, View, Pressable, Dimensions, TouchableWithoutFeedback } from 'react-native';
import { Auth } from 'aws-amplify';
import React, { useEffect, useState } from 'react';
const { width } = Dimensions.get('window');
import { Icon } from '@rneui/base';
import { useNavigation } from '@react-navigation/native';

const Home = () => {
  const navigation = useNavigation();
  const signOut = async () => {
    try {
      await Auth.signOut({ global: true });
    } catch (error) {
      console.log('error signing out: ', error);
    }
  };
  return (
    <>
      <View style={styles.header}>
        <TouchableWithoutFeedback onPress={() => navigation.goBack()}>
          <Icon name='arrow-left' size={24} />
        </TouchableWithoutFeedback>
      </View>
      <View style={styles.container}>
        <Text style={styles.headerTitle}>로그아웃</Text>
        <Pressable style={styles.button} onPress={() => signOut()}>
          <Text style={styles.buttonText}>Log Out</Text>
        </Pressable>
      </View>
    </>
  );
};
const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f0f0f0',
    alignItems: 'center',
    justifyContent: 'center',
    width: width,
    flex: 1
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderBottomWidth: 2,
    borderBottomColor: '#FF0000',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  button: {
    marginTop: 50,
    backgroundColor: '#B00020',
    padding: 10,
    borderRadius: 6,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
  },
});
export default Home;