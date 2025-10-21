// js/firebase.js
// Firebase v9 Modular SDK
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.11/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/9.6.11/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyAxX7v-XXXXXXXXXXXXXXX",
  authDomain: "gbs9-9d0a8.firebaseapp.com",
  projectId: "gbs9-9d0a8",
  storageBucket: "gbs9-9d0a8.appspot.com",
  messagingSenderId: "969676248299",
  appId: "1:969676248299:web:XXXXXXXXXXXXXX"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
