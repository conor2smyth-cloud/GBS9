document.addEventListener("DOMContentLoaded", () => {
  const cocktailGrid = document.getElementById("cocktailGrid");
  const modal = document.getElementById("cocktailModal");
  const modalImg = document.getElementById("modalImage");
  const modalName = document.getElementById("modalName");
  const modalDesc = document.getElementById("modalDescription");
  const modalIngredients = document.getElementById("modalIngredients");
  const closeBtn = document.querySelector(".modal .close");

  let cocktails = [];

  // Fetch cocktails JSON
  fetch("data/cocktails.json")
    .then(res => res.json())
    .then(data => {
      cocktails = data;
      renderCocktails(cocktails);
    })
    .catch(err => console.error("Error loading cocktails:", err));

  function renderCocktails(list) {
    cocktailGrid.innerHTML = "";
    list.forEach(cocktail => {
      const card = document.createElement("div");
      card.className = "cocktail-card";
      card.innerHTML = `
        <img src="images/cocktails/${cocktail.image}" alt="${cocktail.name}">
        <h3>${cocktail.name}</h3>
        <p>${cocktail.short}</p>
      `;
      card.addEventListener("click", () => openModal(cocktail));
      cocktailGrid.appendChild(card);
    });
  }

  function openModal(cocktail) {
    modal.style.display = "block";
    modalImg.src = `images/cocktails/${cocktail.image}`;
    modalName.textContent = cocktail.name;
    modalDesc.textContent = cocktail.short;
    modalIngredients.innerHTML = "";
    cocktail.ingredients.forEach(ing => {
      const li = document.createElement("li");
      li.textContent = ing;
      modalIngredients.appendChild(li);
    });
  }

  closeBtn.addEventListener("click", () => {
    modal.style.display = "none";
  });

  window.addEventListener("click", e => {
    if (e.target === modal) {
      modal.style.display = "none";
    }
  });

  // Filtering
  const filters = document.querySelectorAll(".filters input[type=checkbox]");
  filters.forEach(filter => {
    filter.addEventListener("change", () => {
      applyFilters();
    });
  });

  function applyFilters() {
    const selected = Array.from(filters)
      .filter(f => f.checked)
      .map(f => f.value);

    if (selected.length === 0) {
      renderCocktails(cocktails);
      return;
    }

    const filtered = cocktails.filter(c =>
      selected.includes(c.base) || selected.includes(c.glass)
    );
    renderCocktails(filtered);
  }
});
