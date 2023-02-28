import { initializeApp } from "firebase/app";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey:
    process.env.REACT_APP_FIREBASE_API_KET ??
    "AIzaSyAoKXWZNW4mCcy5-UlQrus_4jlaqzuOeHw",
  authDomain:
    process.env.REACT_APP_FIREBASE_AUTH_DOMAIN ??
    "referapp-3c358.firebaseapp.com",
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID ?? "referapp-3c358",
  storageBucket:
    process.env.REACT_APP_FIREBASE_STORAGE_BUCKET ??
    "referapp-3c358.appspot.com",
  messagingSenderId:
    process.env.REACT_APP_FIREBASE_MESSEGE_SENDER_ID ?? "970214781613",
  appId:
    process.env.REACT_APP_FIREBASE_APP_ID ??
    "1:970214781613:web:319e9d4f9b4d43fbab0c24",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export default app;
