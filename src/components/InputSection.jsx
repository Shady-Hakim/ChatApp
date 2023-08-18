import React from 'react';
import {View, StyleSheet, Dimensions, Text} from 'react-native';
import {Button, TextInput} from 'react-native-paper';
import * as Yup from 'yup';
import Colors from '../constants/Colors';
import store from '../store';
import {ErrorMessage, Formik} from 'formik';

const {width} = Dimensions.get('window');

/**
 * Rooms list single row.
 *
 * @param {Object} props - The component props.
 * @param {string} props.roomId - The id of the room.
 * @param {Object} props.messageItem - The message object.
 * @param {callback} props.setIsEdit - The callback function to set isEdit state.
 */
const InputSection = ({roomId, messageItem, setIsEdit}) => {
  const handleSendingMessage = message => {
    // Check if there is a message item
    if (messageItem) {
      // If there is a message item, edit the message in the store
      store.editMessage(roomId, messageItem.id, message);
      setIsEdit(false); // Set isEdit to false
    } else {
      // If there is no message item, add the message to the store
      store.addMessage(roomId, message);
    }
  };

  return (
    <Formik
      initialValues={{message: messageItem?.messageBody || ''}}
      onSubmit={(values, {setSubmitting, resetForm}) => {
        // Handle sending the message and resetting the form
        handleSendingMessage(values.message);
        setSubmitting(false);
        resetForm();
      }}
      validationSchema={Yup.object().shape({
        message: Yup.string().required("Message can't be empty"),
      })}>
      {({handleChange, handleSubmit, values, errors}) => (
        <View style={styles.textInputContainer(messageItem?.id)}>
          {/* Input field for message body */}
          <View>
            <TextInput
              name="message"
              mode="outlined"
              style={styles.textInput}
              activeUnderlineColor={Colors.primary}
              placeholder={errors.message || 'Type your message'}
              placeholderTextColor={errors.message && 'red'}
              value={values.message}
              onChangeText={handleChange('message')}
            />
          </View>
          {/* Button to send the message */}
          <Button
            mode="outlined"
            buttonColor={Colors.primary}
            textColor="#fff"
            labelStyle={styles.buttonLabel}
            style={styles.button}
            onPress={handleSubmit}>
            Send
          </Button>
        </View>
      )}
    </Formik>
  );
};
export default InputSection;

const styles = StyleSheet.create({
  textInputContainer: messageId => ({
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: 10,
    marginBottom: 40,
    transform: messageId && [{scaleY: -1}],
  }),
  textInput: {
    backgroundColor: '#f3f3f3',
    width: width / 1.5,
    height: 42,
  },
  button: {
    marginTop: 4,
    width: width / 4,
    borderRadius: 5,
  },
  buttonLabel: {
    fontSize: 20,
  },
  errorMessage: {color: 'red'},
});
