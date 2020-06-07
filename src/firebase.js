import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';
import 'firebase/storage';
import 'firebase/firestore'

var firebaseConfig = {
  apiKey: 'AIzaSyAj5B0HHGUGnY8Vd70i9IVnOZ9qdEwnQic',
  authDomain: 'react-slack-clone-4ec81.firebaseapp.com',
  databaseURL: 'https://react-slack-clone-4ec81.firebaseio.com',
  projectId: 'react-slack-clone-4ec81',
  storageBucket: 'react-slack-clone-4ec81.appspot.com',
  messagingSenderId: '23993442743',
  appId: '1:23993442743:web:42e537ef6b5d1fd9e78832',
  measurementId: 'G-LW08HYYH2H',
};

firebase.initializeApp(firebaseConfig);

export default firebase;
