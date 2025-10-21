import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.0/firebase-app.js";
import { getFirestore, collection, getDocs, doc, getDoc } from "https://www.gstatic.com/firebasejs/11.0.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "gbs9-9d0a8.firebaseapp.com",
  projectId: "gbs9-9d0a8",
  storageBucket: "gbs9-9d0a8.firebasestorage.app",
  messagingSenderId: "74649598691",
  appId: "1:74649598691:web:0ab7026bcf19b8c6e063d6",
  measurementId: "G-NHMVFL5H1E"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function renderMenu() {
  const menuDiv = document.getElementById("menu");
  const tonightSnap = await getDocs(collection(db, "tonightMenu"));
  if (tonightSnap.empty) {
    menuDiv.innerHTML = "<p>No menu set for tonight yet.</p>";
    return;
  }

  const grouped = {};
  for (const t of tonightSnap.docs) {
    const { category, drinkId } = t.data();
    const drinkSnap = await getDoc(doc(db, category, drinkId));
    if (drinkSnap.exists()) {
      if (!grouped[category]) grouped[category] = [];
      grouped[category].push(drinkSnap.data().name);
    }
  }

  menuDiv.innerHTML = Object.entries(grouped)
    .map(([cat, drinks]) => `
      <div class="category">
        <h2>${cat}</h2>
        <ul>${drinks.map(d => `<li>${d}</li>`).join("")}</ul>
      </div>
    `).join("");
}

document.addEventListener("DOMContentLoaded", renderMenu);
