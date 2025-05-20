import firebase from 'firebase/compat/app';
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';




// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC3m7X1P6iaTXbF-ZG9arh51mmKqibx9PM",
  authDomain: "testproject-6fa43.firebaseapp.com",
  projectId: "testproject-6fa43",
  storageBucket: "testproject-6fa43.firebasestorage.app",
  messagingSenderId: "920768333233",
  appId: "1:920768333233:web:ca8e5f2e6f8130b015a990",
  measurementId: "G-S04GBYYL2J"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app)

export {db};