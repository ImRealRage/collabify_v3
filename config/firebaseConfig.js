// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: "collabify-f70d7.firebaseapp.com",
  projectId: "collabify-f70d7",
  storageBucket: "collabify-f70d7.firebasestorage.app",
  messagingSenderId: "1443167174",
  appId: "1:1443167174:web:3f1dc5397e3e8af59010c7",
  measurementId: "G-WR29WCHZZJ"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
const analytics = getAnalytics(app);