// ===== Global Modal Controls =====
const modal = document.getElementById("modal");
const closeBtn = modal ? modal.querySelector(".close") : null;

if (closeBtn) {
  closeBtn.onclick = () => (modal.style.display = "none");
}
window.onclick = e => {
  if (e.target === modal) modal.style.display = "none";
};

// ===== Function to open modal with drink details =====
function openModal(item, type) {
  if (!modal) return;

  // Populate left column (textual info)
  document.getElementById("modalTitle").textContent = item.name || "Unnamed Cocktail";
  document.getElementById("modalDesc").textContent = item.short || "No description available.";
  document.getElementById("modalGlass").textContent = item.glass || "N/A";

  // Ingredients list
  const ingList = document.getElementById("modalIngredients");
  ingList.innerHTML = "";
  if (Array.isArray(item.ingredients)) {
    item.ingredients.forEach(i => {
      const li = document.createElement("li");
      li.textContent = i;
      ingList.appendChild(li);
    });
  }

  // Flavours
  const flavourSpan = document.getElementById("modalFlavours");
  flavourSpan.textContent = item.flavour && item.flavour !== "nan"
    ? item.flavour
    : "None";

  // Right column (image + favourites button)
  const imgEl = document.getElementById("modalImg");
  imgEl.src = `images/${type}/${item.image}`;
  imgEl.alt = item.name;
  imgEl.onerror = () => {
    imgEl.src = "images/coming-soon.jpg";
  };

  // Add to favourites button
  const favBtn = document.getElementById("addToFav");
  favBtn.onclick = () => {
    try {
      // Save to localStorage for now (could hook into Design Your Menu later)
      let favs = JSON.parse(localStorage.getItem("favourites") || "[]");
      if (!favs.find(f => f.name === item.name)) {
        favs.push(item);
        localStorage.setItem("favourites", JSON.stringify(favs));
        alert(`${item.name} added to favourites!`);
      } else {
        alert(`${item.name} is already in favourites.`);
      }
    } catch (err) {
      console.error("Failed to add favourite", err);
    }
  };

  // Finally show the modal
  modal.style.display = "flex";
}
