import React from 'react';
import {View, Text, StyleSheet, Dimensions} from 'react-native';
import {TextInput, Button} from 'react-native-paper';
import {Formik, ErrorMessage} from 'formik';
import * as Yup from 'yup';
import Colors from '../../constants/Colors';
import store from '../../store';

const {width} = Dimensions.get('window');

/**
 * CreateRoomScreen component represents the screen for creating a new chat room.
 *
 * @param {Object} props - The component props.
 * @param {Object} props.navigation - The navigation prop.
 */
function CreateRoomScreen({navigation}) {
  return (
    <View style={styles.container}>
      <Formik
        initialValues={{title: ''}}
        onSubmit={(values, {setSubmitting}) => {
          // Add new room to the store and navigate to the Home screen
          store.addRoom(values.title);
          store.getRooms();
          navigation.navigate('Home');
          setSubmitting(false);
        }}
        validationSchema={Yup.object().shape({
          title: Yup.string()
            .required('Room title is required')
            .test(
              'unique-title',
              'A room exists with the same title, please change the title and try again',
              value => {
                const existingTitles = store.rooms.map(room => room.title);
                return !existingTitles.includes(value);
              },
            ),
        })}>
        {({handleChange, handleSubmit, values}) => (
          <View style={styles.formContainer}>
            {/* Input field for room title */}
            <TextInput
              label="Room title"
              name="title"
              mode="flat"
              style={styles.textInput}
              activeUnderlineColor={Colors.primary}
              placeholder="Developers room"
              value={values.title}
              onChangeText={handleChange('title')}
            />
            {/* Display error message if the room title validation fails */}
            <ErrorMessage name="title">
              {msg => <Text style={styles.errorMessage}>{msg}</Text>}
            </ErrorMessage>

            {/* Button to create the room */}
            <Button
              mode="outlined"
              buttonColor={Colors.primary}
              textColor="#fff"
              labelStyle={{fontSize: 20}}
              style={styles.button}
              onPress={handleSubmit}>
              Create room
            </Button>
          </View>
        )}
      </Formik>
    </View>
  );
}

export default CreateRoomScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  formContainer: {width: width / 1.25, alignSelf: 'center'},
  textInput: {backgroundColor: '#f3f3f3', marginBottom: 5},
  errorMessage: {color: 'red'},
  button: {width: width / 1.25, marginVertical: 10, borderRadius: 5},
});
