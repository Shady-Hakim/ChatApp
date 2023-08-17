import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {Button} from 'react-native-paper';
import Colors from '../constants/Colors';
import {addUserToRoom} from '../utils/firebaseHelpers';

/**
 * Rooms list single row.
 *
 * @param {Object} props - The component props.
 * @param {string} props.title - The title of the room.
 * @param {string} props.creator - The room creator.
 * @param {Object} props.navigation - The navigation prop.
 */
const ListItem = ({title, creator, navigation}) => {
  // Joining the user to the room
  const onJoinRoom = () => {
    addUserToRoom(title);
    navigation.navigate('Single room', {roomId: title});
  };

  return (
    <View style={styles.roomItem}>
      <View>
        <Text>{title}</Text>
        <Text>Created by: {creator}</Text>
      </View>
      <Button
        mode="outlined"
        buttonColor={Colors.primary}
        textColor="#fff"
        style={styles.joinButton}
        onPress={() => onJoinRoom()}>
        Join
      </Button>
    </View>
  );
};
export default ListItem;

const styles = StyleSheet.create({
  roomItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 20,
    backgroundColor: '#F8F9FB',
    marginVertical: 2,
  },
  joinButton: {
    borderRadius: 5,
  },
});
