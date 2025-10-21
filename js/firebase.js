const firebaseConfig = {
  apiKey: "AIzaSyCPClFICZJ0ZzXNOBH3xAeBMdwuPaawATo",
  authDomain: "gbs9-9d0a8.firebaseapp.com",
  projectId: "gbs9-9d0a8",
  storageBucket: "gbs9-9d0a8.firebasestorage.app",
  messagingSenderId: "74649598691",
  appId: "1:74649598691:web:0ab7026bcf19b8c6e063d6",
  measurementId: "G-NHMVFL5H1E"
};

<!-- Add these CDN scripts on any page that talks to Firebase (admin, print, tonights-event) -->
<script src="https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js"></script>
<script src="https://www.gstatic.com/firebasejs/10.12.0/firebase-auth-compat.js"></script>
<script src="https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore-compat.js"></script>

// /js/firebase.js
// Replace with your Firebase config from the console
const firebaseConfig = {
  apiKey: "YOUR_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  projectId: "YOUR_PROJECT",
  storageBucket: "YOUR_PROJECT.appspot.com",
  messagingSenderId: "SENDER_ID",
  appId: "APP_ID"
};

firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

// Helpers
function tonightDocRef() {
  return db.collection("tonight").doc("menu");
}

// Sign in/out
async function adminSignIn(email, password) {
  const cred = await auth.signInWithEmailAndPassword(email, password);
  console.log("Signed in as:", cred.user.email, "UID:", cred.user.uid);
  alert("Signed in!");
  return cred.user;
}
async function adminSignOut() {
  await auth.signOut();
  alert("Signed out.");
}

// Load/save tonight menu
async function loadTonightMenu() {
  const snap = await tonightDocRef().get();
  return snap.exists ? snap.data() : { cocktails: [], beer: [], spirits: [], mixers: [] };
}
async function saveTonightMenu(data) {
  await tonightDocRef().set(
    { ...data, updatedAt: firebase.firestore.FieldValue.serverTimestamp() },
    { merge: true }
  );
}

window.FirebaseAPI = { auth, db, adminSignIn, adminSignOut, loadTonightMenu, saveTonightMenu };
