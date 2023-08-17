import {makeAutoObservable, runInAction} from 'mobx';
import auth from '@react-native-firebase/auth';
import {
  addNewMessage,
  addNewRoom,
  editMessageById,
  getAllParticipants,
  getAllRooms,
  getAllUsers,
  removeMessageById,
} from './utils/firebaseHelpers';
import {collection, doc, onSnapshot} from 'firebase/firestore';
import {db} from './config/firebase';

class Rooms {
  rooms = []; // Array to store all rooms
  messages = []; // Array to store messages of a room
  users = []; // Array to store all users
  roomsIsLoading = true; // Indicates if rooms are being loaded
  messagesIsLoading = false; // Indicates if messages are being loaded
  roomParticipants = []; // Array to store room participants

  constructor() {
    makeAutoObservable(this);
  }

  // Adds a new room to the database
  addRoom(title, id) {
    const user = auth().currentUser;
    addNewRoom({
      id: id,
      title: title,
      creator: user.displayName,
      createdTime: new Date().getTime(),
    });
  }

  // Retrieves messages of a room
  async getMessages(roomId) {
    this.messagesIsLoading = true;
    const parentDocRef = doc(collection(db, 'rooms'), roomId);
    const nestedCollectionRef = collection(parentDocRef, 'messages');

    const unsubscribe = onSnapshot(nestedCollectionRef, querySnapshot => {
      const messages = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      const sortedData = messages
        .sort((a, b) => a.createdTime - b.createdTime)
        .reverse();

      runInAction(() => {
        this.messages = sortedData;
        this.messagesIsLoading = false;
      });
    });

    // Store the unsubscribe function in case you want to stop listening later
    this.unsubscribeMessages = unsubscribe;
  }

  // Listens for updates on a user document
  startUserListener(userId, onUpdate) {
    const userDocRef = doc(db, 'users', userId);
    const unsubscribe = onSnapshot(userDocRef, docSnapshot => {
      const userData = docSnapshot.data();
      onUpdate(userData);
    });

    return unsubscribe;
  }

  // Adds a new message to a room
  async addMessage(roomId, message) {
    try {
      await addNewMessage(roomId, message);
    } catch (error) {
      console.log('Error adding message:', error);
    }
  }

  async removeMessage(roomId, messageId) {
    try {
      await removeMessageById(roomId, messageId);
    } catch (error) {
      console.log('Error removing message:', error);
    }
  }
  async editMessage(roomId, messageId, message) {
    try {
      await editMessageById(roomId, messageId, message);
    } catch (error) {
      console.log('Error editing message:', error);
    }
  }

  // Retrieves all rooms from the database
  async getRooms() {
    this.roomsIsLoading = true;
    const roomsCollectionRef = collection(db, 'rooms');

    const unsubscribe = onSnapshot(roomsCollectionRef, querySnapshot => {
      const data = querySnapshot.docs.map(doc => ({id: doc.id, ...doc.data()}));
      const sortedData = data
        .sort((a, b) => a.createdTime - b.createdTime)
        .reverse();

      runInAction(() => {
        this.rooms = sortedData;
        this.roomsIsLoading = false;
      });
    });

    // Store the unsubscribe function in case you want to stop listening later
    this.unsubscribeRooms = unsubscribe;
  }

  // Retrieves all users from the database
  async getUsers() {
    const data = await getAllUsers();
    runInAction(() => {
      this.users = data;
    });
  }

  // Retrieves participants (users) of a room
  async getRoomParticipants(roomId) {
    const data = await getAllParticipants(roomId);
    runInAction(() => {
      this.roomParticipants = data;
    });
  }
}

const store = new Rooms();

export default store;
