document.addEventListener("DOMContentLoaded", async () => {
  try {
    const res = await fetch("data/heroes.json");
    const heroes = await res.json();

    const page = document.body.dataset.page;

    heroes
      .filter(h => h.page === page)
      .forEach(h => {
        const heroEl = document.querySelector(`.hero[data-section="${h.section}"]`);
        if (!heroEl) return;

        heroEl.style.height = h.height;
        heroEl.innerHTML = `
          <img src="images/heroes/${h.image}" alt="${h.header}">
          <h2>${h.header}</h2>
        `;

        if (h.filter) heroEl.classList.add("with-filter");
      });
  } catch (err) {
    console.error("Error loading heroes.json", err);
  }
});
