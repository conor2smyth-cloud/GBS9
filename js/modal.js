const modal = document.getElementById("modal");
const closeBtn = modal.querySelector(".close");

closeBtn.onclick = () => modal.style.display = "none";
window.onclick = e => { if (e.target === modal) modal.style.display = "none"; };

function openModal(item) {
  document.getElementById("modalImg").src = `images/cocktails/${item.image}`;
  document.getElementById("modalTitle").textContent = item.name;
  document.getElementById("modalDesc").textContent = item.short || "";
  document.getElementById("modalGlass").textContent = item.glass || "N/A";

  const ingList = document.getElementById("modalIngredients");
  ingList.innerHTML = "";
  (item.ingredients || []).forEach(i => {
    const li = document.createElement("li");
    li.textContent = i;
    ingList.appendChild(li);
  });

  document.getElementById("modalFlavours").textContent = item.flavour || "None";

  modal.style.display = "flex";
}
