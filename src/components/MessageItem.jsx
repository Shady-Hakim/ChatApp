import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import auth from '@react-native-firebase/auth';
import store from '../store';
import InputSection from './InputSection';

/**
 * A single message item component.
 *
 * @param {Object} props - The component props.
 * @param {object} props.item - The message object.
 * @param {string} props.roomId - The room name.
 */
const MessageItem = ({item, roomId}) => {
  const [user, setUser] = useState();
  const [isEdit, setIsEdit] = useState(false);
  const currentUser = auth().currentUser;
  const isCurrentUser = currentUser.displayName === item?.userName;
  const isOnline = user?.currentRoom === roomId;
  useEffect(() => {
    const handleUpdate = userData => {
      setUser(userData);
    };

    const unsubscribe = store.startUserListener(item.userId, handleUpdate);

    return () => {
      unsubscribe();
    };
  }, [item.userId]);

  return (
    <>
      {isEdit ? (
        <InputSection
          roomId={roomId}
          messageItem={item}
          setIsEdit={setIsEdit}
        />
      ) : (
        <View
          style={[
            styles.messageItem,
            !isCurrentUser ? styles.leftMessageItem : styles.rightMessageItem,
          ]}>
          {!isCurrentUser ? (
            <View style={styles.senderContainer}>
              <Text style={styles.visibilityIndicator(isOnline)}>.</Text>
              <Text style={styles.sender}>
                {item?.userName} {isOnline && '(Online)'}
              </Text>
            </View>
          ) : (
            <View style={styles.removeContainer}>
              <TouchableOpacity
                onPress={() => store.removeMessage(roomId, item.id)}>
                <Text style={styles.remove}>remove</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setIsEdit(true)}>
                <Text style={styles.remove}>edit</Text>
              </TouchableOpacity>
            </View>
          )}
          <Text
            style={[
              styles.messageBody,
              currentUser.displayName === item?.userName &&
                styles.rightMessageBody,
            ]}>
            {item?.messageBody}
          </Text>
        </View>
      )}
    </>
  );
};
export default MessageItem;

const styles = StyleSheet.create({
  messageItem: {
    padding: 15,
    borderRadius: 10,
    width: 300,
    marginVertical: 10,
    transform: [{scaleY: -1}],
  },
  leftMessageItem: {
    backgroundColor: '#f3f3f3',
    marginLeft: 10,
  },
  rightMessageItem: {
    backgroundColor: '#2D67E6',
    marginRight: 10,
    alignSelf: 'flex-end',
  },
  sender: {
    fontSize: 12,
    marginBottom: 10,
    marginLeft: 15,
    color: '#7a7a7a',
  },
  messageBody: {
    fontWeight: 'bold',
  },
  rightMessageBody: {
    color: '#fff',
  },
  senderContainer: {
    flexDirection: 'row',
  },
  visibilityIndicator: isOnline => {
    return {
      color: isOnline ? '#00B526' : '#7a7a7a',
      position: 'absolute',
      fontSize: 70,
      marginTop: -55,
    };
  },
  removeContainer: {
    flexDirection: 'row',
    alignSelf: 'flex-end',
  },
  remove: {
    color: '#fff',
    fontSize: 12,
    marginEnd: 5,
  },
});
