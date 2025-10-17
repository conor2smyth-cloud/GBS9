document.addEventListener("DOMContentLoaded", async () => {
  try {
    const res = await fetch("data/heroes.json");
    const heroes = await res.json();

    heroes.forEach(hero => {
      const wrapper = document.querySelector(`[data-hero="${hero.id}"]`);
      if (!wrapper) return;

      // Build Hero Header
      wrapper.classList.add("hero-wrapper");
      wrapper.style.backgroundImage = `url('images/hero/${hero.image}')`;

      if (hero.gradient) {
        wrapper.style.setProperty("--hero-gradient", hero.gradient);
        wrapper.classList.add("with-gradient");
      }

      if (hero.style_class) wrapper.classList.add(hero.style_class);

      // Inner hero content
      wrapper.innerHTML = `
        <div class="hero-content">
          <h2>${hero.title}</h2>
          ${hero.subtitle ? `<p>${hero.subtitle}</p>` : ""}
          ${
            hero.button_enabled
              ? `<a href="${hero.button_link}" class="btn">${hero.button_text}</a>`
              : ""
          }
        </div>
      `;

      // Build Accordion Body
      const parentItem = wrapper.closest(".accordion-item");
      if (!parentItem) return;

      const body = parentItem.querySelector(".accordion-body");
      if (body) {
        body.innerHTML = `
          <div class="accordion-inner" style="
            ${hero.accordion_bg ? `background-image:url('images/hero/${hero.accordion_bg}');` : ""}
            ${hero.accordion_color ? `background-color:${hero.accordion_color};` : ""}
          ">
            <p>${hero.description || ""}</p>
          </div>
        `;
      }

      // Click handler → toggle accordion
      wrapper.addEventListener("click", () => {
        parentItem.classList.toggle("open");
      });
    });
  } catch (err) {
    console.error("Error loading heroes:", err);
  }
});



