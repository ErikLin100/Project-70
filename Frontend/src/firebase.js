import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBWepJ2sdBo1w9L8kqyfzPYGBPoLXHOk9A",
  authDomain: "hilight-7a75a.firebaseapp.com",
  projectId: "hilight-7a75a",
  storageBucket: "hilight-7a75a.appspot.com",
  messagingSenderId: "794722905203",
  appId: "1:794722905203:web:0856273e430e62e7ba0e06",
  measurementId: "G-GJF84J1L6B"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();
const db = getFirestore(app);

export { auth, googleProvider, db };