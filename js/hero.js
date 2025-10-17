// hero.js
// Renders hero/banner sections with optional accordions + buttons

document.addEventListener("DOMContentLoaded", async () => {
  const page = document.body.dataset.page || "";
  try {
    const response = await fetch("data/heroes.json");
    const heroes = await response.json();

    document.querySelectorAll("[data-hero]").forEach(el => {
      const id = el.dataset.hero;
      const hero = heroes.find(h => h.id === id && (h.page === page || h.page === "global"));
      if (hero) renderHero(hero, el);
    });
  } catch (err) {
    console.error("Error loading heroes.json:", err);
  }
});

// Escape unsafe text
function escapeHtml(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function renderHero(hero, el) {
  const styleClass = hero.style_class || "";
  const inlineHeight = hero.height ? `height:${escapeHtml(hero.height)};` : "";
  const gradient = hero.gradient ? `${hero.gradient}, ` : "";

  el.innerHTML = `
    <div class="hero-wrapper ${escapeHtml(styleClass)}" 
         style="background-image:${gradient}url('images/hero/${escapeHtml(hero.image)}'); ${inlineHeight}">
      <div class="hero-content">
        <h2>${escapeHtml(hero.title)}</h2>
        ${hero.subtitle ? `<p>${escapeHtml(hero.subtitle)}</p>` : ""}
      </div>
    </div>
  `;

  if (hero.accordion) {
    const item = el.closest(".accordion-item");
    if (item) {
      const body = item.querySelector(".accordion-body");
      if (body) {
        let buttonHtml = "";
        if (hero.button_enabled && hero.button_text && hero.button_link) {
          buttonHtml = `
            <a href="${encodeURIComponent(hero.button_link)}" class="btn">
              ${escapeHtml(hero.button_text)}
            </a>
          `;
        }

        // Build accordion background style
        let bgStyle = "";
        if (hero.accordion_bg && hero.accordion_color) {
          bgStyle = `background: linear-gradient(${escapeHtml(hero.accordion_color)}, ${escapeHtml(hero.accordion_color)}), url('images/hero/${escapeHtml(hero.accordion_bg)}'); background-size: cover;`;
        } else if (hero.accordion_bg) {
          bgStyle = `background-image: url('images/hero/${escapeHtml(hero.accordion_bg)}'); background-size: cover;`;
        } else if (hero.accordion_color) {
          bgStyle = `background:${escapeHtml(hero.accordion_color)};`;
        }

        body.innerHTML = `
          <div class="accordion-inner" style="${bgStyle}">
            <p>${escapeHtml(hero.description || "")}</p>
            ${buttonHtml}
          </div>
        `;
      }

      el.addEventListener("click", (e) => {
        if (e.target.tagName.toLowerCase() === "a") return; 
        const open = item.classList.contains("open");
        document.querySelectorAll(".accordion-item").forEach(i => i.classList.remove("open"));
        if (!open) item.classList.add("open");
      });
    }
  }
}


