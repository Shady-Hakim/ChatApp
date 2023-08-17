import auth from '@react-native-firebase/auth';
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  setDoc,
  updateDoc,
  where,
} from 'firebase/firestore';
import {db} from '../config/firebase';
import store from '../store';
import firestore from '@react-native-firebase/firestore';

// Handles user sign up using email and password
const handleSignUp = ({email, password, displayName}) => {
  auth()
    .createUserWithEmailAndPassword(email, password)
    .then(userCredentials => {
      const user = userCredentials.user;
      console.log('handleSignUp', user);

      updateUserProfile(user, displayName); // Updates the user's display name
    })
    .catch(error => {
      handleSignUpError(error);
    });
};

// Updating profile with the display name
const updateUserProfile = (user, displayName) => {
  user
    .updateProfile({
      displayName: displayName,
    })
    .then(() => {
      addNewUser(); // Adds the new user to the database
    })
    .catch(error => {
      console.log('Error updating profile', error);
    });
};

// Handles sign up errors
const handleSignUpError = error => {
  if (error.code === 'auth/email-already-in-use') {
    console.log('That email address is already in use!');
  }

  if (error.code === 'auth/invalid-email') {
    console.log('That email address is invalid!');
  }
  console.log(error);
};

// Handles user sign in using email and password
const handleSignIn = values => {
  auth()
    .signInWithEmailAndPassword(values.email, values.password)
    .then(userCredentials => {
      const user = userCredentials.user;
      console.log('user signed in!', user);
    })
    .catch(error => {
      console.log(error);
    });
};

// Handles user sign out
const handleSignOut = () => {
  auth()
    .signOut()
    .then(() => console.log('User signed out!'))
    .catch(error => console.log('Error signing out:', error));
};

// Retrieves all rooms from the database
const getAllRooms = async () => {
  const querySnapshot = await getDocs(collection(db, 'rooms'));
  const data = querySnapshot.docs.map(doc => ({id: doc.id, ...doc.data()}));
  return data;
};

// Adds a new room to the database
const addNewRoom = async room => {
  try {
    const docRef = await setDoc(doc(db, 'rooms', room.title), {
      title: room.title,
      creator: room.creator,
      createdTime: room.createdTime,
    });
    console.log('Document written with ID: ', docRef);
  } catch (e) {
    console.error('Error adding document: ', e);
  }
};

// Adds a new user to the database
const addNewUser = async () => {
  const user = auth().currentUser;
  const ref = doc(db, 'users', user.uid);
  try {
    await setDoc(ref, {
      displayName: user.displayName,
      uid: user.uid,
      email: user.email,
      currentRoom: null,
    });
    console.log('Document written with ID: ', user.uid);
  } catch (e) {
    console.error('Error adding document: ', e);
  }
};

// Retrieves all users from the database
const getAllUsers = async () => {
  const querySnapshot = await getDocs(collection(db, 'users'));
  const data = querySnapshot.docs.map(doc => doc.data());
  return data;
};

// Retrieves a user by their ID from the database
const getUserById = async uid => {
  const docRef = doc(db, 'users', uid);
  const docSnap = await getDoc(docRef);
  const data = docSnap.data();

  console.log('doc', data);
  return data;
};

// Sets the current room of the user to null, indicating offline status
const userOffline = async () => {
  const user = auth().currentUser;
  const ref = doc(db, 'users', user.uid);
  await updateDoc(ref, {
    currentRoom: null,
  });
};

// Sets the current room of the user to the specified room ID, indicating online status
const userOnline = async roomId => {
  const user = auth().currentUser;
  const ref = doc(db, 'users', user.uid);
  await updateDoc(ref, {
    currentRoom: roomId,
  });
};

// Adds the current user to a room
const addUserToRoom = async roomId => {
  const currentUser = auth().currentUser;
  const parentDocRef = doc(collection(db, 'rooms'), roomId);
  const nestedCollectionRef = doc(parentDocRef, 'users', currentUser.uid);

  const newDocumentData = {
    displayName: currentUser.displayName,
    email: currentUser.email,
    uid: currentUser.uid,
  };

  setDoc(nestedCollectionRef, newDocumentData)
    .then(docRef => {
      console.log('New document addedto nested collection with ID:', docRef.id);
    })
    .catch(error => {
      console.log('Error adding document to nested collection:', error);
    });
};

// Adds a new message to a room
const addNewMessage = async (roomId, message) => {
  const currentUser = auth().currentUser;
  const parentDocRef = doc(collection(db, 'rooms'), roomId);
  const nestedCollectionRef = collection(parentDocRef, 'messages');

  const newDocumentData = {
    messageBody: message,
    userName: currentUser.displayName,
    userId: currentUser.uid,
    createdTime: new Date().getTime(),
  };

  setDoc(doc(nestedCollectionRef), newDocumentData)
    .then(docRef => {
      console.log(
        'New document added to nested collection with ID:',
        docRef.id,
      );
    })
    .catch(error => {
      console.log('Error adding document to nested collection:', error);
    });
};
const removeMessageById = async (roomId, MessageId) => {
  const parentDocRef = doc(collection(db, 'rooms'), roomId);
  const nestedCollectionRef = doc(parentDocRef, 'messages', MessageId);
  deleteDoc(nestedCollectionRef)
    .then(function () {
      console.log('Document successfully deleted!');
    })
    .catch(function (error) {
      console.error('Error removing document: ', error);
    });
  console.log('nestedCollectionRef', nestedCollectionRef);
};
const editMessageById = async (roomId, messageId, newMessage) => {
  console.log('editMessageById', roomId, messageId, newMessage);
  const parentDocRef = doc(collection(db, 'rooms'), roomId);
  const nestedCollectionRef = collection(parentDocRef, 'messages');

  const newDocumentData = {
    messageBody: newMessage,
  };

  try {
    await updateDoc(doc(nestedCollectionRef, messageId), newDocumentData);
    console.log('Document updated successfully');
  } catch (error) {
    console.log('Error updating document:', error);
  }
};
// Retrieves all messages from a room
const getAllMessages = async roomId => {
  const parentDocRef = doc(collection(db, 'rooms'), roomId);
  const nestedCollectionRef = collection(parentDocRef, 'messages');
  const querySnapshot = await getDocs(nestedCollectionRef);
  const messages = await querySnapshot.docs.map(doc => doc.data());

  return messages;
};

// Retrieves all participants (users) from a room
const getAllParticipants = async roomId => {
  const parentDocRef = doc(collection(db, 'rooms'), roomId);
  const nestedCollectionRef = collection(parentDocRef, 'users');
  const querySnapshot = await getDocs(nestedCollectionRef);
  const users = await querySnapshot.docs.map(doc => doc.data());

  return users;
};

export {
  handleSignUp,
  handleSignOut,
  handleSignIn,
  addNewRoom,
  getAllRooms,
  addUserToRoom,
  getAllUsers,
  getUserById,
  addNewMessage,
  getAllMessages,
  userOnline,
  userOffline,
  getAllParticipants,
  removeMessageById,
  editMessageById,
};
