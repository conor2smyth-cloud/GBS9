// js/admin.js
import { db } from "./firebase.js";
import {
  collection,
  getDocs,
  setDoc,
  deleteDoc,
  doc,
  onSnapshot
} from "https://www.gstatic.com/firebasejs/9.6.11/firebase-firestore.js";

const menuContainer = document.getElementById("menuContainer");
const clearButton = document.getElementById("clearMenuBtn");

async function loadAdminMenu() {
  const collections = ["cocktails", "beer", "spirits", "misc"];

  // Cache all active drink IDs from tonightMenu
  const tonightSnap = await getDocs(collection(db, "tonightMenu"));
  let activeIds = tonightSnap.docs.map(d => d.id);

  for (const col of collections) {
    const snap = await getDocs(collection(db, col));
    snap.forEach(docSnap => {
      const data = docSnap.data();
      const drinkId = docSnap.id; // use Firestore's own ID
      const isActive = activeIds.includes(drinkId);

      const div = document.createElement("div");
      div.className = "drink-item";

      const label = document.createElement("label");
      label.textContent = data.name;

      const toggle = document.createElement("input");
      toggle.type = "checkbox";
      toggle.dataset.id = drinkId;
      toggle.checked = isActive;

      toggle.addEventListener("change", async () => {
        if (toggle.checked) {
          await setDoc(doc(db, "tonightMenu", drinkId), { active: true });
        } else {
          const confirmOff = confirm(`Remove "${data.name}" from Tonight's Menu?`);
          if (confirmOff) {
            await deleteDoc(doc(db, "tonightMenu", drinkId));
          } else {
            toggle.checked = true; // revert to ON
          }
        }
      });

      div.append(label, toggle);
      menuContainer.appendChild(div);
    });
  }

  // Realtime updates
  onSnapshot(collection(db, "tonightMenu"), (snapshot) => {
    activeIds = snapshot.docs.map(d => d.id);
    document.querySelectorAll(".drink-item input[type=checkbox]").forEach(cb => {
      const id = cb.dataset.id;
      cb.checked = activeIds.includes(id);
    });
  });
}

// Clear button
clearButton.addEventListener("click", async () => {
  const ok = confirm("Clear the entire Tonight's Menu?");
  if (!ok) return;
  const snap = await getDocs(collection(db, "tonightMenu"));
  for (const docSnap of snap.docs) {
    await deleteDoc(doc(db, "tonightMenu", docSnap.id));
  }
  alert("Tonight's Menu cleared.");
});

window.addEventListener("DOMContentLoaded", loadAdminMenu);

