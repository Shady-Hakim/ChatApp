import React, {useEffect, useState} from 'react';
import UserStack from './userStack';
import AuthStack from './authStack';
import auth from '@react-native-firebase/auth';

export default function RootNavigation() {
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState();

  useEffect(() => {
    // Handle user state changes
    function onAuthStateChanged(user) {
      setUser(user);
      if (initializing) {
        setInitializing(false);
      }
    }
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber; // unsubscribe on unmount
  }, [initializing]);

  if (initializing) {
    return null;
  }

  return user ? <UserStack /> : <AuthStack />;
}
