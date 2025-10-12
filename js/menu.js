document.addEventListener("DOMContentLoaded", () => {
  const cardImg = document.getElementById("cocktail-img");
  const cardName = document.getElementById("cocktail-name");
  const cardBio = document.getElementById("cocktail-bio");
  const menuList = document.getElementById("menu-list");
  const likeBtn = document.getElementById("like");
  const dislikeBtn = document.getElementById("dislike");

  let cocktails = [];
  let currentIndex = 0;
  let menu = [];

  // Load cocktails dynamically from JSON
  fetch("data/cocktails.json")
    .then(response => response.json())
    .then(data => {
      cocktails = data.cocktails; // assuming cocktails.json has { "cocktails": [ ... ] }
      if (cocktails.length > 0) {
        showCocktail(cocktails[currentIndex]);
      }
    })
    .catch(err => {
      console.error("Error loading cocktails.json:", err);
      cardName.textContent = "Error loading cocktails";
    });

  // Show cocktail card
  function showCocktail(cocktail) {
    cardImg.src = cocktail.image || "images/placeholder.jpg";
    cardImg.alt = cocktail.name;
    cardName.textContent = cocktail.name;
    cardBio.textContent = cocktail.bio || "A refreshing cocktail experience.";
  }

  // Go to next cocktail
  function nextCocktail() {
    currentIndex++;
    if (currentIndex >= cocktails.length) {
      currentIndex = 0; // loop around
    }
    showCocktail(cocktails[currentIndex]);
  }

  // Like button → add to menu
  likeBtn.addEventListener("click", () => {
    const cocktail = cocktails[currentIndex];
    menu.push(cocktail);
    updateMenu();
    nextCocktail();
  });

  // Dislike button → skip
  dislikeBtn.addEventListener("click", () => {
    nextCocktail();
  });

  // Update custom menu list
  function updateMenu() {
    menuList.innerHTML = "";
    menu.forEach(cocktail => {
      const item = document.createElement("div");
      item.classList.add("menu-item");
      item.innerHTML = `
        <img src="${cocktail.image || 'images/placeholder.jpg'}" alt="${cocktail.name}">
        <div>
          <h4>${cocktail.name}</h4>
          <p>${cocktail.bio || "A custom-picked cocktail."}</p>
        </div>
      `;
      menuList.appendChild(item);
    });
  }
});
