// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import {getFirestore} from "firebase/firestore";
import { getStorage } from "firebase/storage";
const firebaseConfig = {
  apiKey: "AIzaSyC20rKO_pwEG-98CNFfP9_9tfiWQOt8UYE",
  authDomain: "fir-turtorial-5cc4f.firebaseapp.com",
  projectId: "fir-turtorial-5cc4f",
  storageBucket: "fir-turtorial-5cc4f.firebasestorage.app",
  messagingSenderId: "550068595342",
  appId: "1:550068595342:web:f0579b993531c7a5cbf7df",
  measurementId: "G-L7QWTHBTQT"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);
export const storage = getStorage(app);