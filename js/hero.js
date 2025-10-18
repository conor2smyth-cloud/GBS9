document.addEventListener("DOMContentLoaded", async () => {
  try {
    const res = await fetch("data/heroes.json");
    const heroes = await res.json();

    heroes.forEach(hero => {
      const wrapper = document.querySelector(`[data-hero="${hero.id}"]`);
      if (!wrapper) return;

      // --- Hero Header ---
      wrapper.classList.add("hero-wrapper");
      if (hero.image) {
        wrapper.style.backgroundImage = `url('images/hero/${hero.image}')`;
      }

      if (hero.gradient) {
        wrapper.style.setProperty("--hero-gradient", hero.gradient);
        wrapper.classList.add("with-gradient");
      }

      if (hero.style_class) {
        wrapper.classList.add(hero.style_class);
      }

      // Insert Hero Title only (subtitles go inside accordion)
      wrapper.innerHTML = `
        <div class="hero-content">
          <h2>${hero.title}</h2>
        </div>
      `;

      // --- Accordion Body ---
      const parentItem = wrapper.closest(".accordion-item");
      if (!parentItem) return;

      const body = parentItem.querySelector(".accordion-body");

      if (body) {
        // Build subtitle block
        let subtitles = "";
        [hero.subtitle_1, hero.subtitle_2, hero.subtitle_3].forEach(s => {
          if (s) subtitles += `<p class="subtitle">${s}</p>`;
        });

        // Build button block
        let buttons = "";
        if (hero.button_enabled) {
          if (hero.button_text_1 && hero.button_link_1) {
            buttons += `<a href="${hero.button_link_1}" class="btn">${hero.button_text_1}</a>`;
          }
          if (hero.button_text_2 && hero.button_link_2) {
            buttons += `<a href="${hero.button_link_2}" class="btn">${hero.button_text_2}</a>`;
          }
          if (buttons) {
            buttons = `<div class="button-row">${buttons}</div>`;
          }
        }

        body.innerHTML = `
          <div class="accordion-inner" style="
            ${hero.accordion_bg ? `background-image:url('images/hero/${hero.accordion_bg}');` : ""}
            ${hero.accordion_color ? `background-color:${hero.accordion_color};` : ""}
          ">
            ${hero.description ? `<p>${hero.description}</p>` : ""}
            ${subtitles}
            ${buttons}
          </div>
        `;
      }
    });
  } catch (err) {
    console.error("Error loading heroes.json", err);
  }

  // --- Accordion toggle with dynamic height ---
  document.querySelectorAll(".accordion-item .hero-wrapper").forEach(header => {
    header.addEventListener("click", () => {
      const item = header.closest(".accordion-item");
      const body = item.querySelector(".accordion-body");

      if (item.classList.contains("open")) {
        // Collapse
        body.style.maxHeight = body.scrollHeight + "px"; // lock current height
        setTimeout(() => {
          body.style.maxHeight = "0px";
        }, 10);
        item.classList.remove("open");
      } else {
        // Expand
        body.style.maxHeight = body.scrollHeight + "px";
        item.classList.add("open");
      }
    });
  });
});
