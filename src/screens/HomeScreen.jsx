import React, {useEffect} from 'react';
import {Dimensions, StyleSheet, View, FlatList, Text} from 'react-native';
import {Button} from 'react-native-paper';
import {observer} from 'mobx-react-lite';
import Colors from '../constants/Colors';
import {handleSignOut} from '../utils/firebaseHelpers';
import ListItem from '../components/ListItem';
import store from '../store';

const {width} = Dimensions.get('window');

/**
 * HomeScreen component represents the home screen of the application.
 *
 * @param {Object} props - The component props.
 * @param {Object} props.navigation - The navigation prop.
 */
function HomeScreen({navigation}) {
  useEffect(() => {
    const getRooms = async () => {
      await store.getRooms();
    };
    getRooms();
  }, []);

  if (store.roomsIsLoading) {
    // Display loading indicator while rooms are being loaded
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {!store.rooms.length ? (
        // Display message if there are no rooms
        <Text style={styles.errorText}>There are no rooms yet</Text>
      ) : (
        // Display the list of rooms
        <FlatList
          data={store.rooms}
          renderItem={({item}) => (
            <ListItem
              title={item.title}
              creator={item.creator}
              navigation={navigation}
            />
          )}
          keyExtractor={item => item.title}
        />
      )}
      <View>
        {/* Button to create a new room */}
        <Button
          mode="outlined"
          buttonColor={Colors.white}
          textColor="#fff"
          labelStyle={styles.createButtonLabel}
          style={styles.button}
          onPress={() => navigation.navigate('Create room')}>
          Create new room
        </Button>
        {/* Button to log out */}
        <Button
          mode="outlined"
          buttonColor={Colors.primary}
          textColor="#fff"
          labelStyle={styles.buttonLabel}
          style={styles.button}
          onPress={handleSignOut}>
          Log out
        </Button>
      </View>
    </View>
  );
}

export default observer(HomeScreen);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#fff',
    paddingBottom: 40,
  },
  button: {
    width: width / 1.25,
    borderRadius: 5,
    marginVertical: 10,
    alignSelf: 'center',
  },
  buttonLabel: {fontSize: 20},
  createButtonLabel: {fontSize: 20, color: Colors.primary},
  errorText: {
    alignSelf: 'center',
    fontSize: 20,
  },
});
