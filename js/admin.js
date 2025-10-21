// Admin.js
document.addEventListener("DOMContentLoaded", () => {
  // Firebase setup
  const db = firebase.firestore();
  const auth = firebase.auth();

  const emailEl = document.getElementById("adminEmail");
  const passEl = document.getElementById("adminPass");
  const signInBtn = document.getElementById("signInBtn");
  const signOutBtn = document.getElementById("signOutBtn");
  const whoami = document.getElementById("whoami");

  const saveTonightBtn = document.getElementById("saveTonightBtn");
  const previewMenuBtn = document.getElementById("previewMenuBtn");
  const printMenuBtn = document.getElementById("printMenuBtn");

  // ---- AUTH ----
  signInBtn.addEventListener("click", async () => {
    try {
      const userCred = await auth.signInWithEmailAndPassword(
        emailEl.value,
        passEl.value
      );
      whoami.textContent = `✅ Logged in as ${userCred.user.email}`;
      signInBtn.style.display = "none";
      signOutBtn.style.display = "inline-block";
      document.getElementById("adminTabs").style.display = "flex";
      document.getElementById("adminActions").style.display = "block";
    } catch (err) {
      whoami.textContent = `❌ Login failed: ${err.message}`;
    }
  });

  signOutBtn.addEventListener("click", async () => {
    await auth.signOut();
    whoami.textContent = "Signed out.";
    signInBtn.style.display = "inline-block";
    signOutBtn.style.display = "none";
    document.getElementById("adminTabs").style.display = "none";
    document.getElementById("adminActions").style.display = "none";
  });

  // ---- DRINKS TOGGLE ----
  async function loadDrinks() {
    const res = await fetch("data/drinks.json");
    const drinks = await res.json();

    const categories = {
      cocktails: document.getElementById("cocktails"),
      beer: document.getElementById("beer"),
      spirits: document.getElementById("spirits"),
      mixers: document.getElementById("mixers")
    };

    Object.values(categories).forEach(c => (c.innerHTML = "")); // clear

    // Render checkboxes
    function render(drink, type) {
      return `
        <label>
          <input type="checkbox" data-name="${drink.name}" data-type="${type}">
          ${drink.name}
        </label>
      `;
    }

    drinks.cocktails.forEach(d =>
      categories.cocktails.insertAdjacentHTML("beforeend", render(d, "cocktail"))
    );
    drinks.beer.forEach(d =>
      categories.beer.insertAdjacentHTML("beforeend", render(d, "beer"))
    );
    drinks.spirits.forEach(d =>
      categories.spirits.insertAdjacentHTML("beforeend", render(d, "spirit"))
    );
    drinks.mixers.forEach(d =>
      categories.mixers.insertAdjacentHTML("beforeend", render(d, "mixer"))
    );

    // Load Firestore selections
    db.collection("tonight").doc("menu").get().then(doc => {
      if (doc.exists) {
        const selected = doc.data().drinks || [];
        document.querySelectorAll("input[type=checkbox]").forEach(cb => {
          if (selected.find(d => d.name === cb.dataset.name)) {
            cb.checked = true;
          }
        });
      }
    });
  }

  loadDrinks();

  // ---- SAVE MENU ----
  saveTonightBtn.addEventListener("click", async () => {
    const selected = [];
    document.querySelectorAll("input[type=checkbox]:checked").forEach(cb => {
      selected.push({
        name: cb.dataset.name,
        type: cb.dataset.type
      });
    });

    try {
      await db.collection("tonight").doc("menu").set({
        drinks: selected,
        updatedAt: firebase.firestore.FieldValue.serverTimestamp()
      });
      alert("✅ Tonight’s menu saved & live!");
    } catch (err) {
      alert("❌ Save failed: " + err.message);
    }
  });

  // ---- PREVIEW & PRINT ----
  previewMenuBtn.addEventListener("click", () => {
    window.open("tonights-event.html", "_blank");
  });

  printMenuBtn.addEventListener("click", () => {
    window.open("print-menu.html", "_blank");
  });
});

