// admin.js
import {
  initializeApp
} from "https://www.gstatic.com/firebasejs/9.6.11/firebase-app.js";
import {
  getFirestore,
  collection,
  getDocs,
  setDoc,
  deleteDoc,
  doc,
  onSnapshot
} from "https://www.gstatic.com/firebasejs/9.6.11/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyAxX7v-XXXXXXXXXXXXXXX",
  authDomain: "gbs9-9d0a8.firebaseapp.com",
  projectId: "gbs9-9d0a8",
  storageBucket: "gbs9-9d0a8.appspot.com",
  messagingSenderId: "969676248299",
  appId: "1:969676248299:web:XXXXXXXXXXXXXX"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const menuContainer = document.getElementById("menuContainer");
const clearButton = document.getElementById("clearMenuBtn");

async function loadAdminMenu() {
  const collections = ["cocktails", "beer", "spirits", "misc"];
  const tonightSnap = await getDocs(collection(db, "tonightMenu"));
  const activeIds = tonightSnap.docs.map(d => d.id);

  for (const col of collections) {
    const snap = await getDocs(collection(db, col));
    snap.forEach(docSnap => {
      const data = docSnap.data();
      const isActive = activeIds.includes(docSnap.id);
      const div = document.createElement("div");
      div.className = "drink-item";

      const label = document.createElement("label");
      label.textContent = data.name;

      const toggle = document.createElement("input");
      toggle.type = "checkbox";
      toggle.checked = isActive;

      toggle.addEventListener("change", async () => {
        if (toggle.checked) {
          await setDoc(doc(db, "tonightMenu", docSnap.id), { active: true });
        } else {
          const confirmOff = confirm(`Remove "${data.name}" from Tonight's Menu?`);
          if (confirmOff) {
            await deleteDoc(doc(db, "tonightMenu", docSnap.id));
          } else {
            toggle.checked = true; // revert
          }
        }
      });

      div.append(label, toggle);
      menuContainer.appendChild(div);
    });
  }

  // Real-time listener: keep admin synced
  onSnapshot(collection(db, "tonightMenu"), (snapshot) => {
    const activeIds = snapshot.docs.map(d => d.id);
    document.querySelectorAll(".drink-item input[type=checkbox]").forEach(cb => {
      const label = cb.previousSibling.textContent;
      const drinkId = label.toLowerCase().replace(/\s+/g, "-");
      cb.checked = activeIds.includes(drinkId);
    });
  });
}

clearButton.addEventListener("click", async () => {
  const ok = confirm("Are you sure you want to clear the entire Tonight's Menu?");
  if (!ok) return;
  const snap = await getDocs(collection(db, "tonightMenu"));
  for (const docSnap of snap.docs) {
    await deleteDoc(doc(db, "tonightMenu", docSnap.id));
  }
  alert("Tonight's Menu cleared.");
});

window.addEventListener("DOMContentLoaded", loadAdminMenu);

