document.addEventListener("DOMContentLoaded", () => {
  // --- Firebase Init ---
  if (typeof firebase === "undefined") {
    console.error("Firebase not loaded. Check firebase.js include in HTML.");
    return;
  }

  const db = firebase.firestore();
  const auth = firebase.auth();

  const categories = ["cocktails", "beer", "spirits", "mixers"];

  // --- Auth ---
  const signInBtn = document.getElementById("signInBtn");
  const signOutBtn = document.getElementById("signOutBtn");
  const whoami = document.getElementById("whoami");
  const adminTabs = document.getElementById("adminTabs");
  const adminActions = document.getElementById("adminActions");

  function showMessage(msg, type = "success") {
    const div = document.createElement("div");
    div.textContent = msg;
    div.style.padding = "0.8rem";
    div.style.margin = "0.5rem 0";
    div.style.borderRadius = "6px";
    div.style.fontWeight = "bold";
    div.style.textAlign = "center";
    div.style.background = type === "error" ? "#ff4444" : "#44c767";
    div.style.color = "#fff";
    document.body.prepend(div);
    setTimeout(() => div.remove(), 4000);
  }

  // Login
  if (signInBtn) {
    signInBtn.addEventListener("click", () => {
      const email = document.getElementById("adminEmail").value;
      const pass = document.getElementById("adminPass").value;
      auth.signInWithEmailAndPassword(email, pass).catch(err => {
        showMessage("❌ Login failed: " + err.message, "error");
      });
    });
  }

  if (signOutBtn) {
    signOutBtn.addEventListener("click", () => {
      auth.signOut();
    });
  }

  auth.onAuthStateChanged(user => {
    if (user) {
      whoami.textContent = `Signed in as ${user.email}`;
      signOutBtn.style.display = "inline-block";
      signInBtn.style.display = "none";
      adminTabs.style.display = "flex";
      adminActions.style.display = "block";
      renderCategories();
    } else {
      whoami.textContent = "Not signed in";
      signOutBtn.style.display = "none";
      signInBtn.style.display = "inline-block";
      adminTabs.style.display = "none";
      adminActions.style.display = "none";
    }
  });

  // --- Render categories ---
  function renderCategories() {
    categories.forEach(cat => {
      db.collection(cat).get()
        .then(snapshot => {
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

          container.querySelectorAll("input[type=checkbox]").forEach(cb => {
            cb.addEventListener("change", e => {
              saveSelection(e.target.dataset.cat, e.target.dataset.id, e.target.checked);
            });
          });
        })
        .catch(err => {
          console.error("Error loading", cat, err);
          showMessage(`⚠️ Could not load ${cat} — check Firestore rules`, "error");
        });
    });
  }

  // --- Save Selection ---
  function saveSelection(category, id, enabled) {
    const ref = db.collection("tonightMenu").doc(`${category}_${id}`);
    ref.set({ category, id, enabled }, { merge: true })
      .then(() => {
        showMessage("✅ Menu updated successfully");
      })
      .catch(err => {
        console.error("Save error", err);
        showMessage("❌ Save failed — check Firestore rules", "error");
      });
  }

  // --- Admin Actions ---
  const saveTonightBtn = document.getElementById("saveTonightBtn");
  const printMenuBtn = document.getElementById("printMenuBtn");
  const previewMenuBtn = document.getElementById("previewMenuBtn");

  if (saveTonightBtn) {
    saveTonightBtn.addEventListener("click", () => {
      showMessage("✅ Menu saved & live for guests");
    });
  }

  if (printMenuBtn) {
    printMenuBtn.addEventListener("click", () => {
      window.open("print-menu.html", "_blank");
    });
  }

  if (previewMenuBtn) {
    previewMenuBtn.addEventListener("click", () => {
      window.open("tonights-event.html", "_blank");
    });
  }
});

