import React from 'react';
import {StyleSheet, Text, View} from 'react-native';

/**
 * Single participant row.
 *
 * @param {Object} props - The component props.
 * @param {string} name - The participant name.
 */
const ParticipantItem = ({name}) => (
  <View style={styles.container}>
    <Text>{name}</Text>
  </View>
);
export default ParticipantItem;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    height: 50,
    backgroundColor: '#f3f3f3',
    marginVertical: 2,
  },
});
