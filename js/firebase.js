// Firebase config (restricted in Google Cloud Console)
const firebaseConfig = {
  apiKey: "AIzaSyAa9_gxx6MnrHHBABj6_Laif0C6LUorQhQ",
  authDomain: "gbs9-9d0a8.firebaseapp.com",
  projectId: "gbs9-9d0a8",
  storageBucket: "gbs9-9d0a8.firebasestorage.app",
  messagingSenderId: "74649598691",
  appId: "1:74649598691:web:0ab7026bcf19b8c6e063d6",
  measurementId: "G-NHMVFL5H1E"
};

// Initialize Firebase (global singleton)
firebase.initializeApp(firebaseConfig);

// Export handles for your scripts
const auth = firebase.auth();
const db = firebase.firestore();
