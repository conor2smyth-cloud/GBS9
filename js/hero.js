document.addEventListener("DOMContentLoaded", async () => {
  try {
    const res = await fetch("data/heroes.json");
    const heroes = await res.json();

    heroes.forEach(hero => {
      const wrapper = document.querySelector(`[data-hero="${hero.id}"]`);
      if (!wrapper) return;

      // Hero header
      wrapper.classList.add("hero-wrapper");
      wrapper.style.backgroundImage = `url('images/hero/${hero.image}')`;

      if (hero.gradient) {
        wrapper.style.setProperty("--hero-gradient", hero.gradient);
        wrapper.classList.add("with-gradient");
      }
      if (hero.style_class) wrapper.classList.add(hero.style_class);

      wrapper.innerHTML = `
        <div class="hero-content">
          <h2>${hero.title}</h2>
        </div>
      `;

      // Accordion body
      const parentItem = wrapper.closest(".accordion-item");
      if (!parentItem) return;

      const body = parentItem.querySelector(".accordion-body");
      if (body) {
        let subtitlesHTML = "";
        if (Array.isArray(hero.subtitles) && hero.subtitles.length > 0) {
          subtitlesHTML = hero.subtitles
            .map(s => `<p class="subtitle">${s}</p>`)
            .join("");
        }

        let buttonsHTML = "";
        if (hero.button_enabled) {
          const btns = [];
          if (hero.button_text_1 && hero.button_link_1) {
            btns.push(
              `<a href="${hero.button_link_1}" class="btn">${hero.button_text_1}</a>`
            );
          }
          if (hero.button_text_2 && hero.button_link_2) {
            btns.push(
              `<a href="${hero.button_link_2}" class="btn">${hero.button_text_2}</a>`
            );
          }
          if (btns.length > 0) {
            buttonsHTML = `<div class="btn-row">${btns.join("")}</div>`;
          }
        }

        body.innerHTML = `
          <div class="accordion-inner"
            style="
              ${hero.accordion_bg ? `background-image:url('images/hero/${hero.accordion_bg}');` : ""}
              ${hero.accordion_color ? `background-color:${hero.accordion_color};` : ""}
            "
          >
            <p>${hero.description || ""}</p>
            ${subtitlesHTML}
            ${buttonsHTML}
          </div>
        `;
      }
    });

    // Accordion open/close logic
    document.querySelectorAll(".accordion-item .hero-wrapper").forEach(wrapper => {
      wrapper.addEventListener("click", () => {
        const item = wrapper.closest(".accordion-item");
        item.classList.toggle("open");

        const body = item.querySelector(".accordion-body");
        if (item.classList.contains("open")) {
          body.style.maxHeight = body.scrollHeight + "px";
        } else {
          body.style.maxHeight = null;
        }
      });
    });
  } catch (err) {
    console.error("Error loading heroes.json:", err);
  }
});
