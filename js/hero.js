document.addEventListener("DOMContentLoaded", async () => {
  const page = document.body.dataset.page || "";
  try {
    const response = await fetch("data/heroes.json");
    const heroes = await response.json();

    // Find all hero placeholders
    document.querySelectorAll("[data-hero]").forEach(el => {
      const id = el.dataset.hero;
      const hero = heroes.find(h => h.id === id && (h.page === page || h.page === "global"));
      if (hero) renderHero(hero, el);
    });
  } catch (err) {
    console.error("Error loading heroes.json:", err);
  }
});

function renderHero(hero, el) {
  // Hero banner
  el.innerHTML = `
    <div class="hero-wrapper ${String(hero.style_class || "")}" 
         style="background-image:url('images/hero/${String(hero.image)}'); height:${String(hero.height)}">
      <div class="hero-content">
        <h2>${String(hero.title)}</h2>
        ${hero.subtitle ? `<p>${String(hero.subtitle)}</p>` : ""}
      </div>
    </div>
  `;

  // Accordion body (hidden until click)
  if (hero.accordion) {
    const item = el.closest(".accordion-item");
    if (item) {
      const body = item.querySelector(".accordion-body");
      if (body) {
        body.innerHTML = `
          <p>${String(hero.description || "")}</p>
          ${hero.button_enabled ? `
            <a href="${String(hero.button_link)}" class="btn">${String(hero.button_text)}</a>
          ` : ""}
        `;
      }

      // Toggle on hero click
      el.addEventListener("click", (e) => {
        if (e.target.tagName.toLowerCase() === "a") return; // don’t close if clicking button
        const open = item.classList.contains("open");

        // Close all
        document.querySelectorAll(".accordion-item").forEach(i => i.classList.remove("open"));

        // Reopen if not already open
        if (!open) item.classList.add("open");
      });
    }
  }
}

