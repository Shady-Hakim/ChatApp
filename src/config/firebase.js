// Import the functions you need from the SDKs you need
import {initializeApp} from 'firebase/app';
import {getFirestore} from 'firebase/firestore';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// const firebaseConfig = {
//   apiKey: 'AIzaSyBeIqANAcy9mayBRwb5Uft0cVFWsyMfEjc',
//   authDomain: 'oncare-2fa4b.firebaseapp.com',
//   projectId: 'oncare-2fa4b',
//   storageBucket: 'oncare-2fa4b.appspot.com',
//   messagingSenderId: '119137853084',
//   appId: '1:119137853084:web:d4e04e054bebe73efe1759',
// };
// const firebaseConfig = {
//   apiKey: 'AIzaSyBdNifGsnoDKk9U16It699NdcQcNWxUw-w',
//   authDomain: 'myoncare-cf084.firebaseapp.com',
//   projectId: 'myoncare-cf084',
//   storageBucket: 'myoncare-cf084.appspot.com',
//   messagingSenderId: '165807252005',
//   appId: '1:165807252005:web:b7417c00e9bf828ac855cc',
// };
const firebaseConfig = {
  apiKey: 'AIzaSyCnOxuwyfu_joccK1OweVmE1b7GaBbS-M8',
  authDomain: 'oncare-chat.firebaseapp.com',
  projectId: 'oncare-chat',
  storageBucket: 'oncare-chat.appspot.com',
  messagingSenderId: '340517585127',
  appId: '1:340517585127:web:17f5f3e7ad0187e8d82242',
};
// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export {app, db};
