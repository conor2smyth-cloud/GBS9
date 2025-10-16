// 🌍 Global Modal Logic
document.addEventListener("DOMContentLoaded", () => {
  const modal = document.getElementById("globalModal");
  const modalImg = document.getElementById("modalImg");
  const modalTitle = document.getElementById("modalTitle");
  const modalDesc = document.getElementById("modalDesc");
  const closeBtn = modal.querySelector(".close");

  // Open modal on trigger
  document.body.addEventListener("click", e => {
    if (e.target.classList.contains("modal-trigger")) {
      modalImg.src = e.target.dataset.modalImg || "";
      modalTitle.textContent = e.target.dataset.modalTitle || "";
      modalDesc.textContent = e.target.dataset.modalDesc || "";
      modal.style.display = "flex";
    }
  });

  // Close modal
  closeBtn.addEventListener("click", () => modal.style.display = "none");
  window.addEventListener("click", e => {
    if (e.target === modal) modal.style.display = "none";
  });
});
