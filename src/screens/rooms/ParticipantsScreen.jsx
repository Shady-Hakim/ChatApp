import React, {useEffect} from 'react';
import {StyleSheet} from 'react-native';
import store from '../../store';
import {FlatList, GestureHandlerRootView} from 'react-native-gesture-handler';
import ParticipantItem from '../../components/ParticipantItem';
import {observer} from 'mobx-react-lite';

/**
 * ParticipantsScreen component represents the screen displaying the list of participants in a chat room.
 *
 * @param {Object} props - The component props.
 * @param {Object} props.route - The route prop to receive the sent props from the parent component.
 */
function ParticipantsScreen({route}) {
  const {roomId} = route.params;

  useEffect(() => {
    // Load room participants
    const getParticipants = async () => {
      await store.getRoomParticipants(roomId);
    };
    getParticipants();
  }, [roomId]);

  return (
    <GestureHandlerRootView style={styles.container}>
      {/* Display the list of participants */}
      <FlatList
        data={store.roomParticipants}
        renderItem={({item}) => <ParticipantItem name={item.displayName} />}
        keyExtractor={item => item.uid}
      />
    </GestureHandlerRootView>
  );
}

export default observer(ParticipantsScreen);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
