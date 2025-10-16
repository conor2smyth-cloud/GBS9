// === Global Modal System (Benchmark) ===
const modal = document.getElementById("modal");
const modalImg = document.getElementById("modalImg");
const modalTitle = document.getElementById("modalTitle");
const modalDesc = document.getElementById("modalDesc");
const modalIngredients = document.getElementById("modalIngredients");
const modalFlavours = document.getElementById("modalFlavours");
const closeBtn = modal?.querySelector(".close");
const addToFavBtn = document.getElementById("addToFav");

let galleryImages = [];
let currentIndex = 0;

// Open modal with item data
function openModal(item, type = "cocktails") {
  modal.style.display = "flex";

  modalTitle.textContent = item.name;
  modalDesc.textContent = item.short || "";
  modalIngredients.textContent = item.ingredients?.join(", ") || "N/A";
  modalFlavours.textContent = item.flavour || "None";

  // Detect images
  const baseName = item.image?.replace(/\.\w+$/, "");
  const ext = item.image?.split(".").pop() || "jpg";
  galleryImages = [];

  // Assume files may be cocktail-name-1.jpg, cocktail-name-2.jpg, etc.
  for (let i = 1; i <= 5; i++) {
    const candidate = `images/${type}/${baseName}-${i}.${ext}`;
    galleryImages.push(candidate);
  }

  currentIndex = 0;
  updateGallery();
}

// Update gallery image
function updateGallery() {
  modalImg.src = galleryImages[currentIndex];
}

// Navigation
document.querySelector(".gallery-nav.left")?.addEventListener("click", () => {
  currentIndex = (currentIndex - 1 + galleryImages.length) % galleryImages.length;
  updateGallery();
});
document.querySelector(".gallery-nav.right")?.addEventListener("click", () => {
  currentIndex = (currentIndex + 1) % galleryImages.length;
  updateGallery();
});

// Close modal
closeBtn?.addEventListener("click", () => modal.style.display = "none");
window.addEventListener("click", e => {
  if (e.target === modal) modal.style.display = "none";
});

// Add to favourites (Design Your Menu integration)
addToFavBtn?.addEventListener("click", () => {
  if (typeof addFavourite === "function") {
    addFavourite({
      name: modalTitle.textContent,
      image: modalImg.src,
      short: modalDesc.textContent
    });
  }
  alert("Added to favourites!");
});
