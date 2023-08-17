import * as React from 'react';
import {View, Text, StyleSheet, Dimensions} from 'react-native';
import {TextInput, Button} from 'react-native-paper';
import {Formik, ErrorMessage} from 'formik';
import * as Yup from 'yup';
import Colors from '../../constants/Colors';
import {handleSignUp} from '../../utils/firebaseHelpers';

const {width} = Dimensions.get('window');

// The sign up form screen
function SignUpScreen() {
  return (
    <View style={styles.container}>
      <Formik
        initialValues={{displayName: '', email: '', password: ''}}
        onSubmit={(values, {setSubmitting}) => {
          handleSignUp(values);
          setSubmitting(false);
        }}
        validationSchema={Yup.object().shape({
          displayName: Yup.string().required('Name is required'),
          email: Yup.string()
            .email('Invalid email')
            .required('Email is required'),
          password: Yup.string().required('Password is required'),
        })}>
        {({handleChange, handleSubmit, values}) => (
          <View style={styles.formContainer}>
            <TextInput
              label="Name"
              name="displayName"
              mode="flat"
              style={styles.textInput}
              activeUnderlineColor={Colors.primary}
              placeholder="Full name"
              value={values.displayName}
              onChangeText={handleChange('displayName')}
            />
            <ErrorMessage name="displayName">
              {msg => <Text style={styles.errorMessage}>{msg}</Text>}
            </ErrorMessage>

            <TextInput
              label="Email"
              name="email"
              mode="flat"
              style={styles.textInput}
              activeUnderlineColor={Colors.primary}
              placeholder="johndoe@example.com"
              value={values.email}
              onChangeText={handleChange('email')}
            />
            <ErrorMessage name="email">
              {msg => <Text style={styles.errorMessage}>{msg}</Text>}
            </ErrorMessage>

            <TextInput
              label="Password"
              name="password"
              mode="flat"
              placeholder="***********"
              secureTextEntry={true}
              style={styles.textInput}
              activeUnderlineColor={Colors.primary}
              value={values.password}
              onChangeText={handleChange('password')}
            />
            <ErrorMessage name="password">
              {msg => <Text style={styles.errorMessage}>{msg}</Text>}
            </ErrorMessage>

            <Button
              mode="outlined"
              buttonColor={Colors.primary}
              textColor="#fff"
              labelStyle={{fontSize: 20}}
              style={styles.button}
              onPress={handleSubmit}>
              Create a new account
            </Button>
          </View>
        )}
      </Formik>
    </View>
  );
}
export default SignUpScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#f3f3f3',
  },
  formContainer: {width: width / 1.25, alignSelf: 'center'},
  textInput: {backgroundColor: '#fff', marginBottom: 5},
  errorMessage: {color: 'red'},
  button: {width: width / 1.25, marginVertical: 10, borderRadius: 5},
});
