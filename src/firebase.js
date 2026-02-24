import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

// Paste your Firebase project config here.
// Get it from: Firebase Console → Project Settings → Your apps → Web app → Config
const firebaseConfig = {
  apiKey: "REPLACE_ME",
  authDomain: "REPLACE_ME",
  databaseURL: "REPLACE_ME",
  projectId: "REPLACE_ME",
  storageBucket: "REPLACE_ME",
  messagingSenderId: "REPLACE_ME",
  appId: "REPLACE_ME",
};

const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);
