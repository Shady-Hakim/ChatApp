import * as React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import {TextInput, Button} from 'react-native-paper';
import {Formik, ErrorMessage} from 'formik';
import * as Yup from 'yup';
import Colors from '../../constants/Colors';
import {handleSignIn} from '../../utils/firebaseHelpers';

const {width} = Dimensions.get('window');

// The sign in form screen
function SignInScreen() {
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.inner}>
          <Formik
            initialValues={{email: '', password: ''}}
            onSubmit={(values, {setSubmitting}) => {
              handleSignIn(values);
              setSubmitting(false);
            }}
            validationSchema={Yup.object().shape({
              email: Yup.string()
                .email('Invalid email')
                .required('Email is required'),
              password: Yup.string().required('Password is required'),
            })}>
            {({handleChange, handleSubmit, values, isSubmitting}) => (
              <View style={styles.formContainer}>
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
                  onPress={handleSubmit}
                  disabled={isSubmitting}>
                  Login
                </Button>
              </View>
            )}
          </Formik>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}
export default SignInScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#f3f3f3',
  },
  textInput: {backgroundColor: '#fff', marginBottom: 5},
  errorMessage: {color: 'red'},
  button: {width: width / 1.25, marginVertical: 10, borderRadius: 5},
  inner: {
    justifyContent: 'space-around',
  },
  formContainer: {width: width / 1.25, alignSelf: 'center'},
});
