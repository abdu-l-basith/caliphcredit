import firebase from 'firebase/compat/app';
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth, sendSignInLinkToEmail, isSignInWithEmailLink, signInWithEmailLink } from 'firebase/auth';
import { getStorage } from "firebase/storage";




// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDuDsvNoehA7hLHWJdouerYjykHygYzMlc",
  authDomain: "students-portfolio-8a88a.firebaseapp.com",
  projectId: "students-portfolio-8a88a",
  storageBucket: "students-portfolio-8a88a.firebasestorage.app",
  messagingSenderId: "1097526134045",
  appId: "1:1097526134045:web:3dee357977998b81d70df4",
  measurementId: "G-E4W0GF1KCG"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app)
export const storage = getStorage(app);
export const auth = getAuth(app)
export {db};