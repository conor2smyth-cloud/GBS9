async function loadCocktails() {
  try {
    const res = await fetch("data/cocktails.json");
    const cocktails = await res.json();

    const grid = document.getElementById("cocktail-grid");
    const baseFilter = document.getElementById("base-filter");
    const glassFilter = document.getElementById("glass-filter");
    const searchBox = document.getElementById("search-box");

    function render(filterBase, filterGlass, search) {
      grid.innerHTML = "";
      cocktails.forEach(c => {
        if (filterBase && c.base !== filterBase) return;
        if (filterGlass && c.glass !== filterGlass) return;
        if (search && !c.name.toLowerCase().includes(search.toLowerCase())) return;

        const card = document.createElement("div");
        card.className = "cocktail-card";
        card.innerHTML = `
          <img src="images/cocktails/${c.image}" alt="${c.name}">
          <h3>${c.name}</h3>
          <p>${c.base} – ${c.glass}</p>
        `;
        card.addEventListener("click", () => showPopup(c));
        grid.appendChild(card);
      });
    }

    function showPopup(cocktail) {
      const popup = document.createElement("div");
      popup.className = "popup";
      popup.innerHTML = `
        <div class="popup-content">
          <span class="close">&times;</span>
          <h2>${cocktail.name}</h2>
          <img src="images/cocktails/${cocktail.image}" alt="${cocktail.name}">
          <p><strong>Base:</strong> ${cocktail.base}</p>
          <p><strong>Glass:</strong> ${cocktail.glass}</p>
          <p><strong>Ingredients:</strong></p>
          <ul>${cocktail.ingredients.map(i => `<li>${i}</li>`).join("")}</ul>
        </div>
      `;
      document.body.appendChild(popup);
      popup.querySelector(".close").addEventListener("click", () => popup.remove());
    }

    // filters
    baseFilter.addEventListener("change", () => render(baseFilter.value, glassFilter.value, searchBox.value));
    glassFilter.addEventListener("change", () => render(baseFilter.value, glassFilter.value, searchBox.value));
    searchBox.addEventListener("input", () => render(baseFilter.value, glassFilter.value, searchBox.value));

    render("", "", "");
  } catch (err) {
    console.error("Error loading cocktails:", err);
  }
}

document.addEventListener("DOMContentLoaded", loadCocktails);
