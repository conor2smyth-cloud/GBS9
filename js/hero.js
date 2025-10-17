// hero.js
// Renders hero/banner sections with optional accordions + buttons

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

// Escape HTML to prevent broken markup or script injection
function escapeHtml(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function renderHero(hero, el) {
  // Hero banner
  el.innerHTML = `
    <div class="hero-wrapper ${escapeHtml(hero.style_class || "")}" 
         style="background-image:url('images/hero/${escapeHtml(hero.image)}'); height:${escapeHtml(hero.height)}">
      <div class="hero-content">
        <h2>${escapeHtml(hero.title)}</h2>
        ${hero.subtitle ? `<p>${escapeHtml(hero.subtitle)}</p>` : ""}
      </div>
    </div>
  `;

  // Accordion body (hidden until click)
  if (hero.accordion) {
    const item = el.closest(".accordion-item");
    if (item) {
      const body = item.querySelector(".accordion-body");
      if (body) {
        let buttonHtml = "";
        if (
          hero.button_enabled &&
          hero.button_text &&
          hero.button_link
        ) {
          buttonHtml = `
            <a href="${encodeURIComponent(hero.button_link)}" class="btn">
              ${escapeHtml(hero.button_text)}
            </a>
          `;
        }

        body.innerHTML = `
          <p>${escapeHtml(hero.description || "")}</p>
          ${buttonHtml}
        `;
      }

      // Toggle accordion on hero click
      el.addEventListener("click", (e) => {
        if (e.target.tagName.toLowerCase() === "a") return; // don’t toggle if clicking button
        const open = item.classList.contains("open");

        // Close all accordions
        document.querySelectorAll(".accordion-item").forEach(i => i.classList.remove("open"));

        // Reopen current
        if (!open) item.classList.add("open");
      });
    }
  }
}


