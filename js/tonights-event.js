import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getFirestore, collection, getDocs } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyAJJbNG4BUDZPWdOBh1ahsKXJ0KizkPmKs",
  authDomain: "gbs9-9d0a8.firebaseapp.com",
  projectId: "gbs9-9d0a8",
  storageBucket: "gbs9-9d0a8.firebasestorage.app",
  messagingSenderId: "74649598691",
  appId: "1:74649598691:web:0ab7026bcf19b8c6e063d6",
  measurementId: "G-NHMVFL5H1E"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const menuContainer = document.getElementById("menuContainer");

document.addEventListener("DOMContentLoaded", async () => {
  try {
    const snapshot = await getDocs(collection(db, "tonightMenu"));
    if (snapshot.empty) {
      menuContainer.innerHTML = "<p class='empty'>No drinks selected for tonight yet 🍹</p>";
      return;
    }

    const drinks = [];
    snapshot.forEach(doc => drinks.push(doc.data()));

    // Group drinks by category
    const grouped = drinks.reduce((acc, drink) => {
      if (!acc[drink.category]) acc[drink.category] = [];
      acc[drink.category].push(drink);
      return acc;
    }, {});

    renderMenu(grouped);
  } catch (err) {
    console.error("Error loading tonight’s menu:", err);
    menuContainer.innerHTML = "<p class='error'>Failed to load menu. Please try again later.</p>";
  }
});

function renderMenu(data) {
  menuContainer.innerHTML = Object.entries(data)
    .map(([category, drinks]) => `
      <section class="menu-category">
        <h2>${category.charAt(0).toUpperCase() + category.slice(1)}</h2>
        <ul>
          ${drinks.map(d => `<li>${d.name}</li>`).join("")}
        </ul>
      </section>
    `).join("");
}

