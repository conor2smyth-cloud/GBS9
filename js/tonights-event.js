// js/tonights-event.js

document.addEventListener("DOMContentLoaded", () => {
  console.log("✅ tonights-event.js loaded");

  const db = firebase.firestore();
  const menuContainer = document.getElementById("tonightMenu");

  if (!menuContainer) {
    console.warn("⚠️ No #tonightMenu container found in HTML");
    return;
  }

  // Collections we care about
  const categories = ["cocktails", "beer", "spirits", "mixers"];

  // ------------------------
  // Render menu dynamically
  // ------------------------
  function renderMenu(drinksByCat) {
    if (!drinksByCat) {
      menuContainer.innerHTML = "<p>No drinks selected for tonight.</p>";
      return;
    }

    menuContainer.innerHTML = categories.map(cat => {
      const ids = drinksByCat[cat] || [];
      if (!ids.length) return "";

      return `
        <section class="menu-section">
          <h2>${cat.charAt(0).toUpperCase() + cat.slice(1)}</h2>
          <ul class="menu-list" id="menu-${cat}"></ul>
        </section>
      `;
    }).join("");

    // Now fetch details for each drink
    categories.forEach(cat => {
      const ids = drinksByCat[cat] || [];
      if (!ids.length) return;

      const ul = document.getElementById(`menu-${cat}`);
      ids.forEach(id => {
        db.collection(cat).doc(id).get().then(doc => {
          if (!doc.exists) return;
          const d = doc.data();

          const flavours = d.flavour 
            ? `<p class="flavours"><strong>Flavours:</strong> ${d.flavour}</p>`
            : "";

          ul.innerHTML += `
            <li class="menu-item">
              <h3>${d.name || "Unnamed"}</h3>
              ${d.ingredients ? `<p><strong>Ingredients:</strong> ${d.ingredients.join(", ")}</p>` : ""}
              ${d.short ? `<p>${d.short}</p>` : ""}
              ${flavours}
            </li>
          `;
        });
      });
    });
  }

  // ------------------------
  // Live listener for tonight's menu
  // ------------------------
  db.collection("tonight").doc("menu")
    .onSnapshot(doc => {
      if (!doc.exists) {
        menuContainer.innerHTML = "<p>Tonight’s menu not set yet.</p>";
        return;
      }
      renderMenu(doc.data().drinks);
    });
});
