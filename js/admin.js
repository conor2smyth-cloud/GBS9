// admin.js
document.addEventListener("DOMContentLoaded", () => {
  const auth = firebase.auth();
  const db = firebase.firestore();

  const emailInput = document.getElementById("adminEmail");
  const passInput = document.getElementById("adminPass");
  const signInBtn = document.getElementById("signInBtn");
  const signOutBtn = document.getElementById("signOutBtn");
  const whoami = document.getElementById("whoami");

  const tabs = document.getElementById("adminTabs");
  const actions = document.getElementById("adminActions");

  // --- Auth ---
  signInBtn.addEventListener("click", () => {
    const email = emailInput.value;
    const pass = passInput.value;
    auth.signInWithEmailAndPassword(email, pass)
      .then(userCred => {
        whoami.textContent = `✅ Signed in as ${userCred.user.email}`;
        signInBtn.style.display = "none";
        signOutBtn.style.display = "inline-block";
        tabs.style.display = "flex";
        actions.style.display = "block";
      })
      .catch(err => {
        alert("Login failed: " + err.message);
      });
  });

  signOutBtn.addEventListener("click", () => {
    auth.signOut().then(() => {
      whoami.textContent = "Signed out.";
      signInBtn.style.display = "inline-block";
      signOutBtn.style.display = "none";
      tabs.style.display = "none";
      actions.style.display = "none";
    });
  });

  // --- Load drinks JSON ---
  fetch("data/drinks.json")
    .then(res => res.json())
    .then(data => {
      renderCheckboxes("cocktails", data.cocktails);
      renderCheckboxes("beer", data.beer);
      renderCheckboxes("spirits", data.spirits);
      renderCheckboxes("mixers", data.mixers);
    });

  function renderCheckboxes(tabId, items) {
    const container = document.getElementById(tabId);
    container.innerHTML = `<div class="checkbox-grid"></div>`;
    const grid = container.querySelector(".checkbox-grid");

    items.forEach(drink => {
      const label = document.createElement("label");
      label.innerHTML = `
        <input type="checkbox" data-type="${tabId}" data-name="${drink.name}"
          data-ingredients="${drink.ingredients || ""}"
          data-method="${drink.method || ""}"
          data-flavours="${drink.flavours || ""}">
        ${drink.name}
      `;
      grid.appendChild(label);
    });
  }

  // --- Save Tonight’s Menu ---
  document.getElementById("saveTonightBtn").addEventListener("click", () => {
    const selected = { cocktails: [], beer: [], spirits: [], mixers: [] };

    document.querySelectorAll("input[type=checkbox]:checked").forEach(cb => {
      selected[cb.dataset.type].push({
        name: cb.dataset.name,
        ingredients: cb.dataset.ingredients,
        method: cb.dataset.method,
        flavours: cb.dataset.flavours
      });
    });

    db.collection("tonight").doc("menu").set(selected)
      .then(() => {
        alert("✅ Tonight’s menu saved and now live!");
      })
      .catch(err => {
        alert("Error saving menu: " + err.message);
      });
  });

  // --- Tab switching ---
  document.querySelectorAll(".tab-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".tab-btn").forEach(b => b.classList.remove("active"));
      document.querySelectorAll(".tab-content").forEach(tc => tc.classList.remove("active"));
      btn.classList.add("active");
      document.getElementById(btn.dataset.tab).classList.add("active");
    });
  });
});

