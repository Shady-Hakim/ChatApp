import * as React from 'react';
import {
  View,
  Text,
  ImageBackground,
  StyleSheet,
  SafeAreaView,
  Dimensions,
} from 'react-native';
import background from '../../assets/back.jpg';
import {Button} from 'react-native-paper';

const {width} = Dimensions.get('window');

/**
 * The authentication welcome screen.
 *
 * @param {Object} props - The component props.
 * @param {Object} props.navigation - The navigation prop.
 **/
function WelcomeScreen({navigation}) {
  // The buttons common props
  const buttonProps = () => {
    return {
      mode: 'outlined',
      buttonColor: '#fff',
      textColor: '#006CFF',
      labelStyle: {fontSize: 22, paddingVertical: 3},
      style: styles.button,
    };
  };

  return (
    <ImageBackground
      source={background}
      resizeMode="cover"
      style={styles.background}>
      <SafeAreaView style={styles.container}>
        <Text style={styles.heading}>Welcome to chat rooms</Text>

        <View>
          <Button
            {...buttonProps()}
            onPress={() => navigation.navigate('Sign In')}>
            Login
          </Button>
          <Button
            {...buttonProps()}
            onPress={() => navigation.navigate('Sign Up')}>
            Create a new account
          </Button>
        </View>
      </SafeAreaView>
    </ImageBackground>
  );
}
export default WelcomeScreen;

const styles = StyleSheet.create({
  background: {
    flex: 1,
    alignItems: 'center',
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-around',
    width: width / 1.6,
  },
  heading: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  button: {
    width: width / 1.25,
    marginBottom: 20,
    borderColor: '#006CFF',
  },
});
