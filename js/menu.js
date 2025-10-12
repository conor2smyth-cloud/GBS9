document.addEventListener("DOMContentLoaded", () => {
  const cardStack = document.getElementById("card-stack");
  const likeBtn = document.getElementById("like");
  const dislikeBtn = document.getElementById("dislike");
  const menuList = document.getElementById("menuList");

  let cocktails = [];
  let currentIndex = 0;

  // Load cocktails from JSON
  fetch("data/cocktails.json")
    .then(res => res.json())
    .then(data => {
      cocktails = data;
      showNextCard();
    })
    .catch(err => console.error("Error loading cocktails:", err));

  function showNextCard() {
    cardStack.innerHTML = "";
    if (currentIndex >= cocktails.length) {
      cardStack.innerHTML = `<p>No more cocktails! 🍸</p>`;
      return;
    }

    const cocktail = cocktails[currentIndex];
    const card = document.createElement("div");
    card.className = "swipe-card";
    card.innerHTML = `
      <img src="images/cocktails/${cocktail.image}" alt="${cocktail.name}">
      <h3>${cocktail.name}</h3>
      <p>${cocktail.short}</p>
    `;
    cardStack.appendChild(card);
  }

  function addToMenu(cocktail) {
    const item = document.createElement("div");
    item.className = "menu-item";
    item.innerHTML = `
      <img src="images/cocktails/${cocktail.image}" alt="${cocktail.name}">
      <div>
        <h4>${cocktail.name}</h4>
        <p>${cocktail.short}</p>
      </div>
    `;
    menuList.appendChild(item);
  }

  likeBtn.addEventListener("click", () => {
    if (currentIndex < cocktails.length) {
      addToMenu(cocktails[currentIndex]);
      currentIndex++;
      showNextCard();
    }
  });

  dislikeBtn.addEventListener("click", () => {
    currentIndex++;
    showNextCard();
  });
});
