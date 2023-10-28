// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyDuePG3CClqM3h35VAfsc6F6vX4ZTWtugo',
  authDomain: 'uploadimages-1c0c9.firebaseapp.com',
  projectId: 'uploadimages-1c0c9',
  storageBucket: 'uploadimages-1c0c9.appspot.com',
  messagingSenderId: '635007445737',
  appId: '1:635007445737:web:9c231cc8517064fd7b5e78',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore();
const auth = getAuth();
const storage = getStorage();
export default app;

export { db, auth, storage };
