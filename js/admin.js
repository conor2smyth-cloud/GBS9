// js/admin.js
import { db } from "./firebase.js";
import {
  collection,
  getDocs,
  addDoc,
  deleteDoc,
  doc,
  onSnapshot,
  query,
  where
} from "https://www.gstatic.com/firebasejs/9.6.11/firebase-firestore.js";

const menuContainer = document.getElementById("menuContainer");
const clearButton = document.getElementById("clearMenuBtn");

async function loadAdminMenu() {
  const categories = ["cocktails", "beer", "spirits", "misc"];

  // Read tonightMenu and collect active drink IDs
  const tonightSnap = await getDocs(collection(db, "tonightMenu"));
  let activeDrinkIds = tonightSnap.docs.map(d => d.data().drinkId);

  for (const category of categories) {
    const drinksSnap = await getDocs(collection(db, category));
    drinksSnap.forEach(drinkSnap => {
      const data = drinkSnap.data();
      const drinkId = drinkSnap.id;
      const isActive = activeDrinkIds.includes(drinkId);

      const div = document.createElement("div");
      div.className = "drink-item";

      const label = document.createElement("label");
      label.textContent = data.name;

      const toggle = document.createElement("input");
      toggle.type = "checkbox";
      toggle.dataset.id = drinkId;
      toggle.dataset.category = category;
      toggle.checked = isActive;

      toggle.addEventListener("change", async () => {
        if (toggle.checked) {
          await addDoc(collection(db, "tonightMenu"), {
            drinkId: drinkId,
            category: category
          });
        } else {
          const confirmOff = confirm(`Remove "${data.name}" from Tonight's Menu?`);
          if (confirmOff) {
            // Find and delete matching tonightMenu doc
            const q = query(collection(db, "tonightMenu"), where("drinkId", "==", drinkId));
            const snap = await getDocs(q);
            snap.forEach(async (docSnap) => {
              await deleteDoc(doc(db, "tonightMenu", docSnap.id));
            });
          } else {
            toggle.checked = true; // revert if cancelled
          }
        }
      });

      div.append(label, toggle);
      menuContainer.appendChild(div);
    });
  }

  // Realtime listener for live updates
  onSnapshot(collection(db, "tonightMenu"), (snapshot) => {
    activeDrinkIds = snapshot.docs.map(d => d.data().drinkId);
    document.querySelectorAll(".drink-item input[type=checkbox]").forEach(cb => {
      const id = cb.dataset.id;
      cb.checked = activeDrinkIds.includes(id);
    });
  });
}

// Clear all tonightMenu entries
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

