// js/admin.js

document.addEventListener("DOMContentLoaded", () => {
  const cocktailsTab = document.getElementById("cocktails");
  const beerTab = document.getElementById("beer");
  const spiritsTab = document.getElementById("spirits");
  const mixersTab = document.getElementById("mixers");

  const saveBtn = document.getElementById("saveTonightBtn");

  if (!cocktailsTab || !beerTab || !spiritsTab || !mixersTab) {
    console.error("❌ Admin tabs not found in HTML");
    return;
  }

  // ✅ Fetch drinks.json
  fetch("data/drinks.json")
    .then(res => res.json())
    .then(data => {
      const tonightMenuRef = window.db.collection("tonightMenu").doc("current");

      // Load previously selected menu from Firestore
      tonightMenuRef.get().then(doc => {
        const saved = doc.exists ? doc.data().items || [] : [];
        renderCheckboxGrid(data, saved);
      });

      // Save button → write selection to Firestore
      saveBtn.addEventListener("click", () => {
        const checked = document.querySelectorAll(".checkbox-grid input:checked");
        const items = Array.from(checked).map(cb => ({
          name: cb.dataset.name,
          type: cb.dataset.type,
          image: cb.dataset.image || "",
          ingredients: cb.dataset.ingredients || "",
          method: cb.dataset.method || "",
          flavours: cb.dataset.flavours ? cb.dataset.flavours.split(",") : []
        }));

        tonightMenuRef.set({ items })
          .then(() => {
            alert("✅ Tonight’s menu saved and guests will see updates instantly.");
          })
          .catch(err => {
            console.error("❌ Error saving menu:", err);
          });
      });

      // Render all categories into grids
      function renderCheckboxGrid(data, saved) {
        renderCategory(cocktailsTab, data.cocktails, "cocktail", saved);
        renderCategory(beerTab, data.beer, "beer", saved);
        renderCategory(spiritsTab, data.spirits, "spirit", saved);
        renderCategory(mixersTab, data.misc, "mixer", saved);
      }

      function renderCategory(container, items, type, saved) {
        if (!items) return;
        container.innerHTML = `
          <div class="checkbox-grid">
            ${items
              .map(item => {
                const checked = saved.find(d => d.name === item.Name) ? "checked" : "";
                return `
                  <label class="${checked ? "checked" : ""}">
                    <input type="checkbox" 
                           data-name="${item.Name}" 
                           data-type="${type}" 
                           data-image="${item.Image || ""}" 
                           data-ingredients="${item.Ingredients || ""}" 
                           data-method="${item.Method || ""}" 
                           data-flavours="${item.Flavours || ""}"
                           ${checked}>
                    ${item.Name}
                  </label>
                `;
              })
              .join("")}
          </div>
        `;

        // Toggle label highlight on click
        container.querySelectorAll("input[type=checkbox]").forEach(cb => {
          cb.addEventListener("change", e => {
            e.target.closest("label").classList.toggle("checked", e.target.checked);
          });
        });
      }
    })
    .catch(err => console.error("❌ Error loading drinks.json:", err));
});


