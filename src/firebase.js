// firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCg3-kF0rhN_JYeJ9qNPjgDCje3vuNVOHA",
  authDomain: "askheroutsite.firebaseapp.com",
  projectId: "askheroutsite",
  storageBucket: "askheroutsite.firebasestorage.app",
  messagingSenderId: "474827796094",
  appId: "1:474827796094:web:1919682d9c1450ed2f722f",
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);



