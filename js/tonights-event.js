document.addEventListener("DOMContentLoaded", () => {
  const db = firebase.firestore();

  const sipContainer = document.getElementById("sipTab"); // Make sure Sip tab has id="sipTab"

  // --- Render Function ---
  function renderMenu(drinks) {
    if (!drinks || drinks.length === 0) {
      sipContainer.innerHTML = "<p>No drinks selected for tonight yet.</p>";
      return;
    }

    sipContainer.innerHTML = drinks.map(drink => `
      <div class="menu-card" data-name="${drink.name}" data-type="${drink.type}">
        <h3>${drink.name}</h3>
        <p class="type">${drink.type}</p>
      </div>
    `).join("");

    // Attach modal openers
    sipContainer.querySelectorAll(".menu-card").forEach(card => {
      card.addEventListener("click", () => {
        openDrinkModal(card.dataset.name, card.dataset.type);
      });
    });
  }

  // --- Modal logic (basic version; can be expanded later) ---
  async function openDrinkModal(name, type) {
    try {
      const res = await fetch("data/drinks.json");
      const allDrinks = await res.json();
      const drinkList = allDrinks[type + "s"] || []; // cocktails, beers, spirits, mixers
      const drink = drinkList.find(d => d.name === name);

      if (!drink) return;

      const modal = document.getElementById("globalModal");
      document.getElementById("globalModalTitle").textContent = drink.name;
      document.getElementById("globalModalDesc").textContent = drink.blurb || drink.ingredients || "";

      // Optional flavours field
      const flavourBox = document.getElementById("globalModalFlavours");
      if (drink.flavours && drink.flavours.length > 0) {
        flavourBox.innerHTML = "<strong>Flavours:</strong> " + drink.flavours.join(", ");
        flavourBox.style.display = "block";
      } else {
        flavourBox.style.display = "none";
      }

      // Image
      const modalImg = document.getElementById("globalModalImg");
      if (modalImg && drink.image) {
        modalImg.src = "images/cocktails/" + drink.image;
      }

      modal.style.display = "flex";
    } catch (err) {
      console.error("Modal open failed", err);
    }
  }

  // --- Firestore Listener ---
  db.collection("tonight").doc("menu").onSnapshot(doc => {
    if (doc.exists) {
      renderMenu(doc.data().drinks);
    } else {
      sipContainer.innerHTML = "<p>No menu saved yet.</p>";
    }
  });
});
