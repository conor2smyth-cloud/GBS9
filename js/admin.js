// Admin Panel JS – No login required

import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js";
import { getFirestore, collection, getDocs, doc, setDoc, deleteDoc } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-firestore.js";

// Firebase init
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Categories we support
const categories = ["cocktails", "beer", "spirits", "misc"];

// --- Load Drinks ---
async function loadDrinks() {
  for (const cat of categories) {
    const container = document.getElementById(cat);
    if (!container) continue;

    const snap = await getDocs(collection(db, cat));
    container.innerHTML = `<div class="checkbox-grid">
      ${snap.docs.map(d => {
        const data = d.data();
        return `
          <label>
            <input type="checkbox" data-cat="${cat}" data-id="${d.id}">
            ${data.name || "Unnamed"}
          </label>
        `;
      }).join("")}
    </div>`;

    // Add change listeners
    container.querySelectorAll("input[type=checkbox]").forEach(cb => {
      cb.addEventListener("change", e => {
        saveSelection(e.target.dataset.cat, e.target.dataset.id, e.target.checked);
      });
    });
  }
}

// --- Save Selection to tonightMenu ---
async function saveSelection(category, id, enabled) {
  const ref = doc(db, "tonightMenu", `${category}_${id}`);
  if (enabled) {
    await setDoc(ref, { category, id });
  } else {
    await deleteDoc(ref);
  }
}

// --- Save Menu Button ---
document.getElementById("saveMenu").addEventListener("click", async () => {
  document.getElementById("status").innerText = "✅ Menu saved!";
  setTimeout(() => (document.getElementById("status").innerText = ""), 2000);
});

// --- Preview Button ---
document.getElementById("previewMenu").addEventListener("click", () => {
  window.open("tonights-event.html", "_blank");
});

// --- Print Button ---
document.getElementById("printMenu").addEventListener("click", () => {
  window.print();
});

// --- Tabs ---
document.querySelectorAll(".tab-button").forEach(button => {
  button.addEventListener("click", () => {
    document.querySelectorAll(".tab-button").forEach(btn => btn.classList.remove("active"));
    document.querySelectorAll(".tab-content").forEach(tab => tab.classList.remove("active"));

    button.classList.add("active");
    document.getElementById(button.dataset.tab).classList.add("active");
  });
});

// Start everything
loadDrinks();
