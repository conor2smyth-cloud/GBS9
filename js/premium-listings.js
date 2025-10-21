document.addEventListener("DOMContentLoaded", () => {
  const cocktailList = document.getElementById("cocktail-list");
  const modal = document.getElementById("cocktail-modal");
  const modalName = document.getElementById("modal-name");
  const modalImage = document.getElementById("modal-image");
  const modalShort = document.getElementById("modal-short");
  const modalIngredients = document.getElementById("modal-ingredients");
  const closeBtn = document.querySelector(".close-btn");

  let cocktails = [];

  // Load cocktails.json
  fetch("data/cocktails.json")
    .then(res => res.json())
    .then(data => {
      cocktails = data;
      displayCocktails(cocktails);
    })
    .catch(err => {
      console.error("Error loading cocktails.json:", err);
    });

  // Display cocktail grid
  function displayCocktails(list) {
    cocktailList.innerHTML = "";
    list.forEach(cocktail => {
      const card = document.createElement("div");
      card.className = "cocktail-card";

      card.innerHTML = `
        <img src="images/cocktails/${cocktail.image}" alt="${cocktail.name}">
        <h4>${cocktail.name}</h4>
        <p class="short">${cocktail.short}</p>
      `;

      card.addEventListener("click", () => openModal(cocktail));
      cocktailList.appendChild(card);
    });
  }

  // Open modal with details
  function openModal(cocktail) {
    modalName.textContent = cocktail.name;
    modalImage.src = `images/cocktails/${cocktail.image}`;
    modalShort.textContent = cocktail.short;

    modalIngredients.innerHTML = "";
    cocktail.ingredients.forEach(ing => {
      const li = document.createElement("li");
      li.textContent = ing;
      modalIngredients.appendChild(li);
    });

    modal.style.display = "block";
  }

  // Close modal
  closeBtn.addEventListener("click", () => {
    modal.style.display = "none";
  });

  window.addEventListener("click", (e) => {
    if (e.target === modal) {
      modal.style.display = "none";
    }
  });

  // Filtering
  const filterBase = document.getElementById("filter-base");
  const filterGlass = document.getElementById("filter-glass");

  [filterBase, filterGlass].forEach(filter => {
    filter.addEventListener("change", applyFilters);
  });

  function applyFilters() {
    const base = filterBase.value;
    const glass = filterGlass.value;

    const filtered = cocktails.filter(cocktail => {
      return (!base || cocktail.base === base) &&
             (!glass || cocktail.glass === glass);
    });

    displayCocktails(filtered);
  }
});

// Load and render Premium Listings
fetch("data/drinks.json")
  .then(res => res.json())
  .then(data => {
    const allDrinks = [
      ...data.cocktails,
      ...data.beer,
      ...data.spirits,
      ...data.snacks,
      ...data.misc
    ];

    // Sort: those with real images first
    allDrinks.sort((a, b) => {
      const aHasImage = a.image && a.image !== "coming-soon.jpg";
      const bHasImage = b.image && b.image !== "coming-soon.jpg";

      if (aHasImage && !bHasImage) return -1; // a first
      if (!aHasImage && bHasImage) return 1;  // b first

      // Optional secondary sort: alphabetically by name
      return a.name.localeCompare(b.name);
    });

    const container = document.getElementById("premiumListings");

    container.innerHTML = allDrinks.map(drink => `
      <div class="card" data-name="${drink.name}">
        <img src="images/${drink.image || 'coming-soon.jpg'}" alt="${drink.name}">
        <div class="card-body">
          <h3>${drink.name}</h3>
          <p>${drink.short || ''}</p>
        </div>
      </div>
    `).join("");
  })
  .catch(err => console.error("Error loading drinks:", err));

