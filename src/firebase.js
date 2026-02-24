import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyA1gZk5M5hU-DXp-fa9EvQGps4JuorotLQ",
  authDomain: "vibepotluck.firebaseapp.com",
  databaseURL: "https://vibepotluck-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "vibepotluck",
  storageBucket: "vibepotluck.firebasestorage.app",
  messagingSenderId: "427955081414",
  appId: "1:427955081414:web:f1ad8c3aaebe1faa7907c7",
  measurementId: "G-NW7J22L7HZ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);
