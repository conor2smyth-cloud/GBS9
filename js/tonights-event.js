// js/tonights-event.js

document.addEventListener("DOMContentLoaded", () => {
  const menuContainer = document.getElementById("sipMenu");

  if (!menuContainer) {
    console.error("❌ No #sipMenu element found in HTML");
    return;
  }

  // ✅ Live listener for tonight's menu
  window.db
    .collection("tonightMenu")
    .doc("current") // we keep everything under a single doc
    .onSnapshot((doc) => {
      if (!doc.exists) {
        menuContainer.innerHTML = `<p>No menu set for tonight yet.</p>`;
        return;
      }

      const data = doc.data();
      const items = data?.items || [];

      if (items.length === 0) {
        menuContainer.innerHTML = `<p>No drinks selected yet.</p>`;
        return;
      }

      // Build menu layout
      menuContainer.innerHTML = items
        .map((drink) => {
          return `
            <div class="menu-item card">
              <h3>${drink.name}</h3>
              ${drink.image && drink.image !== "coming-soon.jpg" 
                ? `<img src="images/cocktails/${drink.image}" alt="${drink.name}">`
                : `<div class="placeholder">Image coming soon</div>`}
              <p><strong>Ingredients:</strong> ${drink.ingredients || "N/A"}</p>
              <p><strong>Method:</strong> ${drink.method || "N/A"}</p>
              ${drink.flavours && drink.flavours.length > 0 
                ? `<p><strong>Flavours:</strong> ${drink.flavours.join(", ")}</p>` 
                : ""}
            </div>
          `;
        })
        .join("");
    });
});
