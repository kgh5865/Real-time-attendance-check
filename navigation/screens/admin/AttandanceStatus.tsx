import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Tab, TabView, ListItem } from '@rneui/themed';

const AttandanceStatus = () => {
  const [index, setIndex] = useState(0);
  const [expanded1, setExpanded1] = useState(false);
  const [expanded2, setExpanded2] = useState(false);
  const [expanded3, setExpanded3] = useState(false);

  return (
    <>
      <Tab
        value={index}
        onChange={(e) => setIndex(e)}
        indicatorStyle={{
          backgroundColor: 'white',
          height: 3,
        }}
        variant="primary"
      >
        <Tab.Item title="운영체제개론" titleStyle={{ fontSize: 12 }} />
        <Tab.Item title="캡스톤 디자인" titleStyle={{ fontSize: 13 }} />
        <Tab.Item title="통신네트웤 및 실습" titleStyle={{ fontSize: 12 }} />
        <Tab.Item title="전자계산응용" titleStyle={{ fontSize: 12 }} />
      </Tab>

      <TabView value={index} onChange={setIndex} animationType="spring">
        {/* 1번 탭*/}
        <TabView.Item style={{ backgroundColor: 'primary', width: '100%', flex: 1 }}>
          <View style={styles.container}>
            <ListItem.Accordion
              content={
                <>
                  <ListItem.Content>
                    <ListItem.Title>1주차</ListItem.Title>
                  </ListItem.Content>
                </>
              }
              isExpanded={expanded1}
              onPress={() => setExpanded1(!expanded1)}
            >
              <ListItem>
                <ListItem.Content>
                  <ListItem.Title style={styles.centerText}>
                    {/* Display content as text */}
                    Content for Week 1 goes here
                  </ListItem.Title>
                </ListItem.Content>
              </ListItem>
            </ListItem.Accordion>

            <ListItem.Accordion
              content={
                <>
                  <ListItem.Content>
                    <ListItem.Title>2주차</ListItem.Title>
                  </ListItem.Content>
                </>
              }
              isExpanded={expanded2}
              onPress={() => setExpanded2(!expanded2)}
            >
              <ListItem>
                <ListItem.Content>
                  <ListItem.Title style={styles.centerText}>
                    {/* Display content as text */}
                    Content for Week 2 goes here
                  </ListItem.Title>
                </ListItem.Content>
              </ListItem>
            </ListItem.Accordion>

            <ListItem.Accordion
              content={
                <>
                  <ListItem.Content>
                    <ListItem.Title>3주차</ListItem.Title>
                  </ListItem.Content>
                </>
              }
              isExpanded={expanded3}
              onPress={() => setExpanded3(!expanded3)}
            >
              <ListItem>
                <ListItem.Content>
                  <ListItem.Title style={styles.centerText}>
                    {/* Display content as text */}
                    Content for Week 3 goes here
                  </ListItem.Title>
                </ListItem.Content>
              </ListItem>
            </ListItem.Accordion>
          </View>
        </TabView.Item>
      </TabView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  centerText: {
    textAlign: 'center',
  },
});

export default AttandanceStatus;