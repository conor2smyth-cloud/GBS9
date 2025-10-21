// js/admin.js

document.addEventListener("DOMContentLoaded", () => {
  console.log("✅ Admin.js loaded");

  // Firestore reference
  const db = firebase.firestore();

  // Categories we want to manage
  const categories = ["cocktails", "beer", "spirits", "mixers"];

  // Containers
  const saveBtn = document.getElementById("saveTonightBtn");
  const tabs = document.getElementById("adminTabs");
  const actions = document.getElementById("adminActions");

  // Track selections locally before saving
  let tonightMenu = { cocktails: [], beer: [], spirits: [], mixers: [] };

  // ------------------------
  // Load drinks into checkboxes
  // ------------------------
  function loadCategories() {
    categories.forEach(cat => {
      const container = document.getElementById(cat);
      if (!container) return;

      db.collection(cat).get().then(snapshot => {
        if (snapshot.empty) {
          container.innerHTML = `<p class="empty">No ${cat} found in Firestore.</p>`;
          return;
        }

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

        // Attach listeners
        container.querySelectorAll("input[type=checkbox]").forEach(cb => {
          cb.addEventListener("change", e => {
            const cat = e.target.dataset.cat;
            const id = e.target.dataset.id;

            if (e.target.checked) {
              tonightMenu[cat].push(id);
            } else {
              tonightMenu[cat] = tonightMenu[cat].filter(x => x !== id);
            }
          });
        });
      });
    });
  }

  // ------------------------
  // Save Tonight’s Menu
  // ------------------------
  if (saveBtn) {
    saveBtn.addEventListener("click", async () => {
      try {
        await db.collection("tonight").doc("menu").set({
          drinks: tonightMenu,
          updatedAt: new Date()
        });
        alert("✅ Tonight’s menu saved successfully!");
      } catch (err) {
        console.error("Save error:", err);
        alert("❌ Failed to save menu.");
      }
    });
  }

  // ------------------------
  // Tabs Switching
  // ------------------------
  if (tabs) {
    const tabBtns = tabs.querySelectorAll(".tab-btn");
    const tabContents = document.querySelectorAll(".tab-content");

    tabBtns.forEach(btn => {
      btn.addEventListener("click", () => {
        tabBtns.forEach(b => b.classList.remove("active"));
        btn.classList.add("active");

        tabContents.forEach(tc => {
          tc.classList.remove("active");
          if (tc.id === btn.dataset.tab) tc.classList.add("active");
        });
      });
    });
  }

  // Show tabs + actions after login (for now, always show)
  if (tabs) tabs.style.display = "flex";
  if (actions) actions.style.display = "block";

  // Init
  loadCategories();
});

