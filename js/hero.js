document.addEventListener("DOMContentLoaded", async () => {
  try {
    const res = await fetch("data/heroes.json");
    const heroes = await res.json();

    heroes.forEach(hero => {
      const wrapper = document.querySelector(`[data-hero="${hero.id}"]`);
      if (!wrapper) return;

      // --- Build Hero Header ---
      wrapper.classList.add("hero-wrapper");
      wrapper.style.backgroundImage = `url('images/hero/${hero.image}')`;

      if (hero.gradient) {
        wrapper.style.setProperty("--hero-gradient", hero.gradient);
      }

      if (hero.style_class) wrapper.classList.add(hero.style_class);

      wrapper.innerHTML = `
        <div class="hero-content">
          <h2>${hero.title}</h2>
        </div>
      `;

      // --- Find accordion container ---
      const parentItem = wrapper.closest(".accordion-item");
      if (!parentItem) return;

      const body = parentItem.querySelector(".accordion-body");
      if (!body) return;

      // --- Fill accordion body ---
     if (body) {
  body.innerHTML = `
    <div class="accordion-inner" style="
      ${hero.accordion_bg ? `background-image:url('images/hero/${hero.accordion_bg}');` : ""}
      ${hero.accordion_color ? `background-color:${hero.accordion_color};` : ""}
    ">
      <p>${hero.description || ""}</p>
      ${hero.subtitles && hero.subtitles.length > 0
        ? hero.subtitles.map(s => `<p class="subtitle">${s}</p>`).join("")
        : ""}
      <div class="button-group">
        ${hero.button_enabled && hero.button_text_1 && hero.button_link_1
          ? `<a href="${hero.button_link_1}" class="btn">${hero.button_text_1}</a>`
          : ""}
        ${hero.button_enabled && hero.button_text_2 && hero.button_link_2
          ? `<a href="${hero.button_link_2}" class="btn secondary">${hero.button_text_2}</a>`
          : ""}
      </div>
    
  `;
}

      `;

      // --- Toggle accordion open/close when clicking hero ---
      wrapper.addEventListener("click", () => {
        parentItem.classList.toggle("open");

        if (parentItem.classList.contains("open")) {
          // expanding: set to scrollHeight
          body.style.maxHeight = body.scrollHeight + "px";
        } else {
          // collapsing: reset to 0
          body.style.maxHeight = "0px";
        }
      });

      // --- Adjust height dynamically on window resize ---
      window.addEventListener("resize", () => {
        if (parentItem.classList.contains("open")) {
          body.style.maxHeight = body.scrollHeight + "px";
        }
      });
    });
  } catch (err) {
    console.error("Error loading heroes.json:", err);
  }
});
