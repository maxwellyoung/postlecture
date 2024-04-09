// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "FIREBASE_API_KEY",
  authDomain: "postlecture-a1e1f.firebaseapp.com",
  projectId: "postlecture-a1e1f",
  storageBucket: "postlecture-a1e1f.appspot.com",
  messagingSenderId: "400832600961",
  appId: "1:400832600961:web:10fb73b9411fa88d076680",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Get a reference to the Firestore service
export const db = getFirestore(app);
