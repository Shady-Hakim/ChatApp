import React from 'react';
import {TouchableOpacity, Text} from 'react-native';

/**
 * The authentication welcome screen.
 *
 * @param {Object} props - The component props.
 * @param {Object} props.navigation - The navigation prop.
 * @param {string} roomId - The room name.
 **/
const RightButton = ({navigation, roomId}) => (
  <TouchableOpacity
    onPress={() => navigation.navigate('Participants', {roomId})}>
    <Text>Participants</Text>
  </TouchableOpacity>
);
export default RightButton;
