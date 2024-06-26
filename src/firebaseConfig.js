import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyDhkNnNU2BbVQNHiL0KrLQKMJa0Oiv28Gw",
  authDomain: "virtualnotice-1a8f1.firebaseapp.com",
  projectId: "virtualnotice-1a8f1",
  storageBucket: "virtualnotice-1a8f1.appspot.com",
  messagingSenderId: "785350459600",
  appId: "1:785350459600:web:45c1dcefbf813b28de1ed5",
  measurementId: "G-SWHQGD69F1"
};

// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
export const auth =firebase.auth();
export const firestore = app.firestore();
export default app;
