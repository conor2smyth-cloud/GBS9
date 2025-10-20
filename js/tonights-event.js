document.addEventListener("DOMContentLoaded", () => {
  const tabButtons = document.querySelectorAll(".tab-btn");
  const tabPanels = document.querySelectorAll(".tab-panel");

  tabButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      // Reset buttons
      tabButtons.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");

      // Reset panels
      tabPanels.forEach(panel => panel.classList.remove("active"));
      const target = document.getElementById(btn.dataset.tab);
      target.classList.add("active");

      // Reset cascade animations
      const cascades = target.querySelectorAll(".cascade");
      cascades.forEach((el, i) => {
        el.style.animation = "none";
        void el.offsetWidth; // force reflow
        el.style.animation = `cascadeDown 0.6s ease forwards ${i * 0.2}s`;
      });
    });
  });
});
