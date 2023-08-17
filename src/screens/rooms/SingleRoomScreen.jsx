import React, {useEffect} from 'react';
import {StyleSheet} from 'react-native';
import store from '../../store';
import {FlatList, GestureHandlerRootView} from 'react-native-gesture-handler';
import MessageItem from '../../components/MessageItem';
import {observer} from 'mobx-react-lite';
import {userOffline, userOnline} from '../../utils/firebaseHelpers';
import RightButton from '../../components/ParticipantsButton';
import InputSection from '../../components/InputSection';

/**
 * SingleRoomScreen component represents the screen for a single chat room.
 * It displays the list of messages, allows users to send new messages,
 * and provides options for managing participants.
 *
 * @param {Object} props - The component props.
 * @param {Object} props.navigation - The navigation prop.
 * @param {Object} props.route - The route prop to receive the sent props from the parent component.
 */
function SingleRoomScreen({navigation, route}) {
  const {roomId} = route.params;

  useEffect(() => {
    // Adding the participant button to the header right side
    navigation.setOptions({
      title: roomId,
      headerRight: () => (
        <RightButton navigation={navigation} roomId={roomId} />
      ),
    });
    // Load initial messages
    store.getMessages(roomId);
  }, [navigation, roomId]);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      userOnline(roomId);
      console.log('User entered the screen');
    });

    return () => {
      unsubscribe();
      userOffline();
      console.log('User exited the screen');
    };
  }, [navigation, roomId]);

  return (
    <GestureHandlerRootView style={styles.container}>
      {/* Display the list of messages */}
      <FlatList
        data={store.messages.slice()}
        renderItem={({item}) => <MessageItem item={item} roomId={roomId} />}
        style={{transform: [{scaleY: -1}]}}
        keyExtractor={item => item.createdTime}
      />

      {/* Input section for typing and sending messages */}
      <InputSection roomId={roomId} />
    </GestureHandlerRootView>
  );
}

export default observer(SingleRoomScreen);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
