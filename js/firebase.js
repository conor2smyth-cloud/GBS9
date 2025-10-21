// js/firebase.js

const firebaseConfig = {
  apiKey: "AIzaSyAa9_gxx6MnrHHBABj6_Laif0C6LUorQhQ",
  authDomain: "gbs9-9d0a8.firebaseapp.com",
  projectId: "gbs9-9d0a8",
  storageBucket: "gbs9-9d0a8.appspot.com",
  messagingSenderId: "74649598691",
  appId: "1:74649598691:web:0ab7026bcf19b8c6e063d6",
  measurementId: "G-NHMVFL5H1E"
};

// Initialize Firebase (compat mode)
firebase.initializeApp(firebaseConfig);

// Firestore reference
const db = firebase.firestore();
