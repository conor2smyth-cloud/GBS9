document.addEventListener("DOMContentLoaded", () => {
  const modal = document.getElementById("globalModal");
  const modalImg = document.getElementById("globalModalImg");
  const modalTitle = document.getElementById("globalModalTitle");
  const modalDesc = document.getElementById("globalModalDesc");
  const modalFlavours = document.getElementById("globalModalFlavours");
  const favBtn = document.getElementById("globalAddToFavBtn");

  const closeBtn = modal.querySelector(".close");
  const prevBtn = modal.querySelector(".prev");
  const nextBtn = modal.querySelector(".next");

  let slides = [];   // array of image filenames for slideshow
  let currentIndex = 0;
  let currentItem = null;

  // === Open Modal ===
  function openModal(item) {
    currentItem = item;

    // Populate slideshow images
    slides = item.images && item.images.length > 0 ? item.images : [item.image];
    currentIndex = 0;

    showSlide(currentIndex);

    // Populate text fields
    modalTitle.textContent = item.title || "";
    modalDesc.textContent = item.description || "";

    // Flavours (if any)
    modalFlavours.innerHTML = "";
    if (item.flavour && Array.isArray(item.flavour)) {
      item.flavour.forEach(f => {
        const span = document.createElement("span");
        span.textContent = f;
        modalFlavours.appendChild(span);
      });
    }

    modal.style.display = "flex";
    document.body.style.overflow = "hidden"; // prevent background scroll
  }

  // === Close Modal ===
  function closeModal() {
    modal.style.display = "none";
    document.body.style.overflow = "";
    slides = [];
    currentIndex = 0;
  }

  // === Show slide ===
  function showSlide(index) {
    if (!slides || slides.length === 0) return;
    currentIndex = (index + slides.length) % slides.length; // wrap around
    modalImg.src = `images/${slides[currentIndex]}`;
  }

  // === Slideshow controls ===
  prevBtn.addEventListener("click", () => showSlide(currentIndex - 1));
  nextBtn.addEventListener("click", () => showSlide(currentIndex + 1));

  // === Close events ===
  closeBtn.addEventListener("click", closeModal);
  window.addEventListener("click", (e) => {
    if (e.target === modal) closeModal();
  });
  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeModal();
    if (e.key === "ArrowLeft") showSlide(currentIndex - 1);
    if (e.key === "ArrowRight") showSlide(currentIndex + 1);
  });

  // === Favourite button ===
  favBtn.addEventListener("click", () => {
    if (!currentItem) return;
    favBtn.textContent = favBtn.textContent.includes("❤️")
      ? "💔 Remove from Favourites"
      : "❤️ Add to Favourites";
    // 🔮 Future: save to localStorage
  });

  // === Hook clickable items ===
  // Assumes elements with `.card` or `.hero-wrapper` trigger the modal
  document.querySelectorAll(".card, .hero-wrapper").forEach(el => {
    el.addEventListener("click", () => {
      const data = {
        title: el.dataset.title || "Untitled",
        description: el.dataset.description || "",
        flavour: el.dataset.flavour ? el.dataset.flavour.split(";") : [],
        image: el.dataset.image || "coming-soon.jpg",
        images: el.dataset.images ? el.dataset.images.split(";") : []
      };
      openModal(data);
    });
  });
});
