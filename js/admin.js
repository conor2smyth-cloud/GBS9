// js/admin.js

import { getFirestore, collection, getDocs, setDoc, doc } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-firestore.js";
import { app } from "./firebase.js";

const db = getFirestore(app);

// Categories we support
const categories = ["cocktails", "beer", "spirits", "misc"];

// Load drinks from Firestore
async function loadDrinks() {
  try {
    for (const cat of categories) {
      const querySnapshot = await getDocs(collection(db, cat));
      const container = document.getElementById(`${cat}-list`);

      if (!container) continue;

      container.innerHTML = "";

      querySnapshot.forEach((docSnap) => {
        const data = docSnap.data();
        const label = document.createElement("label");

        label.innerHTML = `
          <input type="checkbox" data-cat="${cat}" data-id="${docSnap.id}">
          ${data.name || "Unnamed"}
        `;

        container.appendChild(label);
      });
    }
    console.log("✅ Drinks loaded into admin panel.");
  } catch (err) {
    console.error("❌ Error loading drinks:", err);
    document.getElementById("status-message").textContent = "Error loading drinks. Check console.";
  }
}

// Save tonight’s menu
async function saveMenu() {
  const checkboxes = document.querySelectorAll("input[type=checkbox]");
  const tonightMenu = {};

  checkboxes.forEach((cb) => {
    if (cb.checked) {
      if (!tonightMenu[cb.dataset.cat]) {
        tonightMenu[cb.dataset.cat] = [];
      }
      tonightMenu[cb.dataset.cat].push(cb.dataset.id);
    }
  });

  try {
    await setDoc(doc(db, "tonightMenu", "current"), tonightMenu);
    console.log("✅ Menu saved:", tonightMenu);

    const msg = document.getElementById("status-message");
    msg.textContent = "Menu saved successfully!";
    msg.style.color = "green";
  } catch (err) {
    console.error("❌ Error saving menu:", err);

    const msg = document.getElementById("status-message");
    msg.textContent = "Error saving menu.";
    msg.style.color = "red";
  }
}

// Attach event listeners
document.addEventListener("DOMContentLoaded", () => {
  loadDrinks();

  const saveBtn = document.getElementById("save-menu");
  if (saveBtn) {
    saveBtn.addEventListener("click", saveMenu);
  }

  // Tab switching
  document.querySelectorAll(".tab-button").forEach((btn) => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".tab-button").forEach((b) => b.classList.remove("active"));
      document.querySelectorAll(".tab-content").forEach((c) => c.classList.remove("active"));

      btn.classList.add("active");
      document.getElementById(btn.dataset.tab).classList.add("active");
    });
  });
});
