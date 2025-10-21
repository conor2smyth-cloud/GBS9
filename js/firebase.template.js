// js/firebase.template.js
// Firebase template – DO NOT use directly.
// Copy to js/firebase.js and fill in your actual config before running.

const firebaseConfig = {
 apiKey: "AIzaSyAa9_gxx6MnrHHBABj6_Laif0C6LUorQhQ",
  authDomain: "gbs9-9d0a8.firebaseapp.com",
  projectId: "gbs9-9d0a8",
  storageBucket: "gbs9-9d0a8.appspot.com",
  messagingSenderId: "74649598691",
  appId: "1:74649598691:web:0ab7026bcf19b8c6e063d6",
  measurementId: "G-NHMVFL5H1E"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Export handles
const auth = firebase.auth();
const db = firebase.firestore();
