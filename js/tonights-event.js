document.addEventListener("DOMContentLoaded", () => {
  const menuRef = firebase.firestore().collection("tonight").doc("menu");

  // 🔴 Live listener (updates instantly when admin saves)
  menuRef.onSnapshot(doc => {
    if (doc.exists) {
      const tonight = doc.data();
      renderMenu(tonight);
    }
  });
});

function renderMenu(tonight) {
  const container = document.getElementById("sipMenu");
  if (!container) return;

  // Clear old content
  container.innerHTML = "";

  // Loop through categories
  ["cocktails", "beer", "spirits", "mixers"].forEach(type => {
    if (tonight[type] && tonight[type].length > 0) {
      const section = document.createElement("div");
      section.classList.add("menu-section");
      section.innerHTML = `<h2>${type}</h2>`;

      tonight[type].forEach(drink => {
        const item = document.createElement("div");
        item.classList.add("menu-item");
        item.innerHTML = `
          <button class="menu-link"
            data-name="${drink.name}"
            data-ingredients="${drink.ingredients || ""}"
            data-method="${drink.method || ""}"
            data-flavours="${drink.flavours || ""}">
            ${drink.name}
          </button>
        `;
        section.appendChild(item);
      });

      container.appendChild(section);
    }
  });

  // Wire modal openers
  document.querySelectorAll(".menu-link").forEach(btn => {
    btn.addEventListener("click", () => {
      openModal({
        name: btn.dataset.name,
        ingredients: btn.dataset.ingredients,
        method: btn.dataset.method,
        flavours: btn.dataset.flavours
      });
    });
  });
}

function openModal(drink) {
  const modal = document.getElementById("menuModal");
  modal.querySelector("h3").textContent = drink.name;
  modal.querySelector(".ingredients").textContent = drink.ingredients;
  modal.querySelector(".method").textContent = drink.method;

  const flavoursBox = modal.querySelector(".flavours");
  if (drink.flavours && drink.flavours.trim() !== "") {
    flavoursBox.textContent = `Flavours: ${drink.flavours}`;
    flavoursBox.style.display = "block";
  } else {
    flavoursBox.style.display = "none";
  }

  modal.style.display = "flex";
}
