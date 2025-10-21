// admin.js
// Handles Admin Panel for Tonight's Event

import { auth, db } from "./firebase.js";
import {
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

import {
  doc,
  setDoc,
  getDoc,
  onSnapshot
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

// --- Elements ---
const emailInput = document.getElementById("adminEmail");
const passInput = document.getElementById("adminPass");
const signInBtn = document.getElementById("signInBtn");
const signOutBtn = document.getElementById("signOutBtn");
const whoami = document.getElementById("whoami");

const tabs = document.getElementById("adminTabs");
const actions = document.getElementById("adminActions");
const saveBtn = document.getElementById("saveTonightBtn");

// Containers for checkboxes
const cocktailsBox = document.getElementById("cocktails");
const beerBox = document.getElementById("beer");
const spiritsBox = document.getElementById("spirits");
const mixersBox = document.getElementById("mixers");

// Success message
const notif = document.createElement("div");
notif.id = "adminNotif";
notif.style.position = "fixed";
notif.style.bottom = "1rem";
notif.style.right = "1rem";
notif.style.padding = "0.8rem 1.2rem";
notif.style.borderRadius = "6px";
notif.style.display = "none";
notif.style.zIndex = "2000";
notif.style.background = "#28a745";
notif.style.color = "#fff";
document.body.appendChild(notif);

function showNotif(msg) {
  notif.innerText = msg;
  notif.style.display = "block";
  setTimeout(() => (notif.style.display = "none"), 3000);
}

// --- Auth ---
signInBtn?.addEventListener("click", async () => {
  try {
    await signInWithEmailAndPassword(auth, emailInput.value, passInput.value);
  } catch (err) {
    alert("❌ Login failed: " + err.message);
  }
});

signOutBtn?.addEventListener("click", async () => {
  await signOut(auth);
});

// Listen for auth changes
onAuthStateChanged(auth, user => {
  if (user) {
    whoami.innerText = `Signed in as ${user.email}`;
    signInBtn.style.display = "none";
    signOutBtn.style.display = "inline-block";
    tabs.style.display = "flex";
    actions.style.display = "block";
    loadDrinks(); // Load checkboxes once logged in
  } else {
    whoami.innerText = "";
    signInBtn.style.display = "inline-block";
    signOutBtn.style.display = "none";
    tabs.style.display = "none";
    actions.style.display = "none";
  }
});

// --- Drinks Data Loader ---
async function loadDrinks() {
  const res = await fetch("data/drinks.json");
  const data = await res.json();

  const snap = await getDoc(doc(db, "tonight", "menu"));
  const tonight = snap.exists() ? snap.data() : { cocktails: [], beer: [], spirits: [], mixers: [] };

  renderCheckboxes("cocktails", data.cocktails, tonight.cocktails);
  renderCheckboxes("beer", data.beer, tonight.beer);
  renderCheckboxes("spirits", data.spirits, tonight.spirits);
  renderCheckboxes("mixers", data.mixers || [], tonight.mixers || []);
}

function renderCheckboxes(category, drinks, selected) {
  const box = document.getElementById(category);
  if (!box) return;
  box.innerHTML = `<div class="checkbox-grid">` +
    drinks.map(d => {
      const checked = selected?.includes(d.name) ? "checked" : "";
      return `<label class="${checked ? "checked" : ""}">
        <input type="checkbox" data-cat="${category}" value="${d.name}" ${checked}>
        ${d.name}
      </label>`;
    }).join("") + `</div>`;

  // Toggle checked state
  box.querySelectorAll("input[type=checkbox]").forEach(cb => {
    cb.addEventListener("change", e => {
      const label = e.target.closest("label");
      if (e.target.checked) label.classList.add("checked");
      else label.classList.remove("checked");
    });
  });
}

// --- Save Menu to Firestore ---
saveBtn?.addEventListener("click", async () => {
  const tonight = {
    cocktails: getChecked("cocktails"),
    beer: getChecked("beer"),
    spirits: getChecked("spirits"),
    mixers: getChecked("mixers")
  };

  await setDoc(doc(db, "tonight", "menu"), tonight);
  showNotif("✅ Tonight’s menu saved & live!");
});

function getChecked(category) {
  const box = document.getElementById(category);
  return [...box.querySelectorAll("input[type=checkbox]:checked")].map(cb => cb.value);
}

// --- Realtime Updates (guest pages auto-refresh) ---
onSnapshot(doc(db, "tonight", "menu"), snap => {
  if (snap.exists()) {
    console.log("🔥 Tonight’s menu updated:", snap.data());
  }
});

