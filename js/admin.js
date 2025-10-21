// admin.js
document.addEventListener("DOMContentLoaded", () => {
  // Firebase
  const auth = firebase.auth();
  const db = firebase.firestore();

  const signInBtn = document.getElementById("signInBtn");
  const signOutBtn = document.getElementById("signOutBtn");
  const emailInput = document.getElementById("adminEmail");
  const passInput = document.getElementById("adminPass");
  const whoami = document.getElementById("whoami");

  const adminTabs = document.getElementById("adminTabs");
  const adminActions = document.getElementById("adminActions");

  // --- Auth ---
  signInBtn?.addEventListener("click", async () => {
    try {
      await auth.signInWithEmailAndPassword(emailInput.value, passInput.value);
    } catch (err) {
      alert("Login failed: " + err.message);
    }
  });

  signOutBtn?.addEventListener("click", async () => {
    await auth.signOut();
  });

  auth.onAuthStateChanged(user => {
    if (user) {
      whoami.textContent = `Signed in as ${user.email}`;
      signInBtn.style.display = "none";
      signOutBtn.style.display = "inline-block";
      adminTabs.style.display = "flex";
      adminActions.style.display = "block";
      loadDrinkOptions();
    } else {
      whoami.textContent = "";
      signInBtn.style.display = "inline-block";
      signOutBtn.style.display = "none";
      adminTabs.style.display = "none";
      adminActions.style.display = "none";
    }
  });

  // --- Load drink categories dynamically ---
  function loadDrinkOptions() {
    const categories = ["cocktails", "beer", "spirits", "mixers"];

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

   // --- Save to Firestore ---
  function saveSelection(category, id, enabled) {
    const ref = db.collection("tonightMenu").doc(category);

    if (enabled) {
      ref.set(
        { [id]: true },
        { merge: true }
      );
    } else {
      ref.set(
        { [id]: false },
        { merge: true }
      );
    }
  }

}); // <-- closes DOMContentLoaded listener

