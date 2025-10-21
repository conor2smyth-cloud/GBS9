import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getFirestore, collection, getDocs, setDoc, doc, deleteDoc, getDoc } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

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

const categories = ["cocktails", "beer", "spirits", "misc"];
const content = document.getElementById("content");
const statusBox = document.getElementById("status");
const saveMenuBtn = document.getElementById("saveMenuBtn");

let tonightSelections = {};

document.addEventListener("DOMContentLoaded", async () => {
  await loadTonightMenu();
  await loadAllCategories();
  setupTabs();
});

async function loadTonightMenu() {
  const tonightRef = collection(db, "tonightMenu");
  const snapshot = await getDocs(tonightRef);
  tonightSelections = {};
  snapshot.forEach(doc => {
    tonightSelections[doc.id] = true;
  });
}

async function loadAllCategories() {
  for (const cat of categories) {
    const catRef = collection(db, cat);
    const snapshot = await getDocs(catRef);
    const container = document.getElementById(cat);
    container.innerHTML = `
      <div class="checkbox-grid">
        ${snapshot.docs.map(d => {
          const drink = d.data();
          const checked = tonightSelections[d.id] ? "checked" : "";
          return `
            <label>
              <input type="checkbox" data-id="${d.id}" data-cat="${cat}" ${checked}>
              ${drink.name || "Unnamed"}
            </label>
          `;
        }).join("")}
      </div>
    `;
  }
}

function setupTabs() {
  const tabs = document.querySelectorAll(".tab");
  const contents = document.querySelectorAll(".tab-content");

  tabs.forEach(tab => {
    tab.addEventListener("click", () => {
      tabs.forEach(t => t.classList.remove("active"));
      contents.forEach(c => c.classList.remove("active"));
      tab.classList.add("active");
      document.getElementById(tab.dataset.tab).classList.add("active");
    });
  });
}

saveMenuBtn.addEventListener("click", async () => {
  statusBox.textContent = "Saving...";
  const allChecked = document.querySelectorAll("input[type=checkbox]:checked");

  // Clear previous menu
  const tonightRef = collection(db, "tonightMenu");
  const oldSnapshot = await getDocs(tonightRef);
  for (const d of oldSnapshot.docs) {
    await deleteDoc(doc(db, "tonightMenu", d.id));
  }

  // Add new selection
  for (const cb of allChecked) {
    await setDoc(doc(db, "tonightMenu", cb.dataset.id), {
      category: cb.dataset.cat,
      name: cb.parentElement.textContent.trim()
    });
  }

  statusBox.textContent = "✅ Tonight’s menu saved!";
  setTimeout(() => statusBox.textContent = "", 3000);
});
