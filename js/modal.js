document.addEventListener("DOMContentLoaded", () => {
  const modal = document.getElementById("modal");
  const closeBtn = modal.querySelector(".close");
  const imgEl = document.getElementById("modalImg");
  const galleryLeft = modal.querySelector(".gallery-nav.left");
  const galleryRight = modal.querySelector(".gallery-nav.right");
  const addToFavBtn = document.getElementById("addToFav");

  let galleryImages = [];
  let currentIndex = 0;
  let currentItem = null;

  // Open modal
  window.openModal = (item, type) => {
    currentItem = item;

    // Core info
    document.getElementById("modalTitle").textContent = item.name;
    document.getElementById("modalDesc").textContent = item.short || "";
    document.getElementById("modalGlass").textContent = item.glass || "N/A";

    // Ingredients
    const ingList = document.getElementById("modalIngredients");
    ingList.innerHTML = "";
    (item.ingredients || []).forEach(i => {
      const li = document.createElement("li");
      li.textContent = i;
      ingList.appendChild(li);
    });

    // Flavours
    document.getElementById("modalFlavours").textContent = item.flavour || "None";

    // Gallery (detect all numbered images)
    galleryImages = [];
    let baseName = item.image.replace(/\.\w+$/, ""); // strip extension
    let ext = item.image.split(".").pop();

    let i = 1;
    while (true) {
      let testPath = `images/${type}/${baseName.replace(/-\d+$/, "")}-${i}.${ext}`;
      if (document.querySelector(`img[src='${testPath}']`) || i === 1) {
        galleryImages.push(testPath);
      } else {
        break;
      }
      i++;
    }

    currentIndex = 0;
    imgEl.src = galleryImages[currentIndex] || `images/${type}/${item.image}`;
    modal.style.display = "flex";
  };

  // Close modal
  closeBtn.onclick = () => modal.style.display = "none";
  window.onclick = e => { if (e.target === modal) modal.style.display = "none"; };

  // Gallery navigation
  galleryLeft.onclick = () => {
    if (galleryImages.length > 1) {
      currentIndex = (currentIndex - 1 + galleryImages.length) % galleryImages.length;
      imgEl.src = galleryImages[currentIndex];
    }
  };
  galleryRight.onclick = () => {
    if (galleryImages.length > 1) {
      currentIndex = (currentIndex + 1) % galleryImages.length;
      imgEl.src = galleryImages[currentIndex];
    }
  };

  // Add to favourites (stub: integrate with Design Your Menu later)
  addToFavBtn.onclick = () => {
    alert(`${currentItem?.name} added to favourites!`);
    modal.style.display = "none";
  };
});
