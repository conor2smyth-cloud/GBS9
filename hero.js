// hero.js
fetch('heroes_schema.json')
  .then(res => res.json())
  .then(data => {
    const page = document.body.dataset.page;

    data.filter(hero => hero.page === page).forEach(hero => {
      const el = document.querySelector(`[data-hero="${hero.id}"]`);
      if (!el) return;

      // Background (image + gradient + fallback)
      let bgParts = [];
      if (hero.image_filename) {
        bgParts.push(`url('images/hero/${hero.image_filename}')`);
      }
      if (hero.gradient) {
        bgParts.push(hero.gradient);
      }
      if (bgParts.length === 0) {
        bgParts.push("linear-gradient(135deg, #444, #222)");
      }
      el.style.backgroundImage = bgParts.join(",");

      // Classes
      el.classList.add("hero-wrapper");
      if (hero.style_class) el.classList.add(hero.style_class);

      // Content
      el.innerHTML = `
        <div class="hero-content">
          <h1>${hero.title || "Untitled"}</h1>
          ${hero.subtitle ? `<p>${hero.subtitle}</p>` : ""}
          ${hero.button_text && hero.button_link ? 
            `<a href="${hero.button_link}" class="btn">${hero.button_text}</a>` : ""}
        </div>
      `;

      // Accordion toggle
      if (hero.accordion === "yes") {
        el.classList.add("accordion-header");
        el.addEventListener("click", () => {
          const item = el.closest(".accordion-item");
          const open = item.classList.contains("open");

          // Close others
          document.querySelectorAll(".accordion-item").forEach(i => i.classList.remove("open"));

          // Toggle current
          if (!open) item.classList.add("open");
        });
      }
    });
  });

