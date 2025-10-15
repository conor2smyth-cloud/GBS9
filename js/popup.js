let globalImages = [];
let globalIndex = 0;
let globalItem = null;

function openPopup({ title, desc, images = [], flavours = [], favourite = false }) {
  globalItem = { title, desc, images, flavours };
  globalImages = images;
  globalIndex = 0;
  updateGlobalSlideshow();

  document.getElementById("globalModalTitle").textContent = title;
  document.getElementById("globalModalDesc").textContent = desc || "";
  document.getElementById("globalModalFlavours").innerHTML =
    (flavours && flavours.length)
      ? flavours.map(f => `<span>${f}</span>`).join("")
      : "";

  const favBtn = document.getElementById("globalAddToFavBtn");
  favBtn.style.display = favourite ? "inline-block" : "none";
  favBtn.onclick = () => addToFavourites(globalItem);

  const modal = document.getElementById("globalModal");
  modal.style.display = "flex";

  document.querySelector("#globalModal .close").onclick = () => modal.style.display = "none";
  window.onclick = e => { if (e.target === modal) modal.style.display = "none"; };
  document.querySelector("#globalModal .prev").onclick = () => changeGlobalImage(-1);
  document.querySelector("#globalModal .next").onclick = () => changeGlobalImage(1);
}

function updateGlobalSlideshow() {
  if (globalImages.length > 0) {
    document.getElementById("globalModalImg").src = globalImages[globalIndex];
  }
}

function changeGlobalImage(step) {
  globalIndex = (globalIndex + step + globalImages.length) % globalImages.length;
  updateGlobalSlideshow();
}

function addToFavourites(item) {
  let favs = JSON.parse(localStorage.getItem("favourites")) || [];
  if (!favs.find(f => f.title === item.title)) {
    favs.push(item);
    localStorage.setItem("favourites", JSON.stringify(favs));
    alert(`${item.title} added to favourites!`);
  }
}
