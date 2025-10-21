// --- Firestore Reference ---
const db = firebase.firestore();

// Categories to load
const categories = ["cocktails", "beer", "spirits", "misc"];

// --- Render checklists ---
function loadAdminMenu() {
  categories.forEach(cat => {
    db.collection(cat).get().then(snapshot => {
      const container = document.getElementById(cat);
      if (!container) return;

      container.innerHTML = `<div class="checkbox-grid">
        ${snapshot.docs.map(doc => {
          const d = doc.data();
          return `
            <label>
              <input type="checkbox" data-cat="${cat}" data-id="${doc.id}">
              ${d.name || "Unnamed"}
            </label>
          `;
        }).join("")}
      </div>`;

      // Attach change listeners
      container.querySelectorAll("input[type=checkbox]").forEach(cb => {
        cb.addEventListener("change", e => {
          saveSelection(e.target.dataset.cat, e.target.dataset.id, e.target.checked);
        });
      });
    });
  });
}

// --- Save selections live into tonightMenu ---
function saveSelection(category, id, enabled) {
  const ref = db.collection("tonightMenu").doc(`${category}_${id}`);
  if (enabled) {
    ref.set({ category, id, enabled: true });
  } else {
    ref.delete();
  }
}

// --- "Save Menu" button feedback ---
document.addEventListener("DOMContentLoaded", () => {
  loadAdminMenu();

  const saveBtn = document.getElementById("saveMenuBtn");
  const msg = document.getElementById("saveMessage");

  saveBtn.addEventListener("click", () => {
    msg.style.display = "block";
    setTimeout(() => msg.style.display = "none", 3000);
  });
});

// --- Tab switching ---
function openTab(tabName) {
  document.querySelectorAll(".tabcontent").forEach(el => el.style.display = "none");
  document.querySelectorAll(".tablink").forEach(btn => btn.classList.remove("active"));
  document.getElementById(tabName).style.display = "block";
  event.currentTarget.classList.add("active");
}

// Show first tab by default
document.addEventListener("DOMContentLoaded", () => {
  document.querySelector(".tablink").click();
});

