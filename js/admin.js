// --- Firebase Init ---
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}
const db = firebase.firestore();

// --- Categories to display ---
const categories = ["cocktails", "beer", "spirits", "misc"];

// --- Load drinks and build toggles ---
function loadAdminToggles() {
  categories.forEach(cat => {
    db.collection(cat).get().then(snapshot => {
      const container = document.getElementById(cat);
      if (!container) return;

      container.innerHTML = `
        <h3>${cat.charAt(0).toUpperCase() + cat.slice(1)}</h3>
        <div class="checkbox-grid">
          ${snapshot.docs.map(doc => {
            const d = doc.data();
            return `
              <label>
                <input type="checkbox" data-cat="${cat}" data-id="${doc.id}">
                ${d.name || "Unnamed"}
              </label>
            `;
          }).join("")}
        </div>
      `;

      // Attach listeners
      container.querySelectorAll("input[type=checkbox]").forEach(cb => {
        cb.addEventListener("change", e => {
          saveSelection(e.target.dataset.cat, e.target.dataset.id, e.target.checked);
        });
      });
    }).catch(err => console.error(`Error loading ${cat}:`, err));
  });
}

// --- Save into tonightMenu ---
function saveSelection(category, id, enabled) {
  const ref = db.collection("tonightMenu").doc(`${category}_${id}`);
  if (enabled) {
    ref.set({ category, drinkId: id, enabled: true })
      .then(() => console.log(`✅ Added ${id} from ${category}`))
      .catch(err => console.error("Error saving menu:", err));
  } else {
    ref.delete()
      .then(() => console.log(`🗑️ Removed ${id} from ${category}`))
      .catch(err => console.error("Error removing menu:", err));
  }
}

// --- Run ---
document.addEventListener("DOMContentLoaded", loadAdminToggles);
