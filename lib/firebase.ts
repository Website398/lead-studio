import { getApp, getApps, initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyAgWptnpLCQxdPHWhswwz89Sz8MZiamYFg",
  authDomain: "lead-page-7db03.firebaseapp.com",
  databaseURL:
    "https://lead-page-7db03-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "lead-page-7db03",
  storageBucket: "lead-page-7db03.firebasestorage.app",
  messagingSenderId: "108253627853",
  appId: "1:108253627853:web:121e43f4d0737de8287084",
};

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getDatabase(app);