// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import {getFirestore} from 'firebase/firestore'

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBIB_4pa2YTZXN28vGRzO9zB_9jg3qz4ho",
  authDomain: "automaticroaddamagedetection.firebaseapp.com",
  projectId: "automaticroaddamagedetection",
  storageBucket: "automaticroaddamagedetection.appspot.com",
  messagingSenderId: "35904925297",
  appId: "1:35904925297:web:89cb8aae1561689fc075d0"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app)