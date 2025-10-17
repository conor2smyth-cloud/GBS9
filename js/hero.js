document.addEventListener("DOMContentLoaded", async () => {
  try {
    const res = await fetch("data/heroes.json");
    const heroes = await res.json();

    heroes.forEach(hero => {
      const wrapper = document.querySelector(`[data-hero="${hero.id}"]`);
      if (!wrapper) return;

      // Hero setup
      wrapper.classList.add("hero-wrapper");
      wrapper.style.setProperty("--hero-gradient", hero.gradient || "#1a1a1a");
      wrapper.style.backgroundImage = hero.image ? `url('images/hero/${hero.image}')` : "none";

      wrapper.innerHTML = `
        <div class="hero-content">
          <h2>${hero.title}</h2>
        </div>
      `;

      // Accordion body
      const parentItem = wrapper.closest(".accordion-item");
      const body = parentItem.querySelector(".accordion-body");
      if (body) {
        body.querySelector(".accordion-inner").innerHTML = `
          ${hero.subtitle ? `<p class="subtitle">${hero.subtitle}</p>` : ""}
          ${hero.description ? `<p>${hero.description}</p>` : ""}
          ${
            hero.button_enabled
              ? `<a href="${hero.button_link}" class="btn">${hero.button_text}</a>`
              : ""
          }
        `;
      }

      // Toggle
      wrapper.addEventListener("click", () => {
        const isOpen = parentItem.classList.contains("open");

        if (isOpen) {
          body.style.maxHeight = body.scrollHeight + "px";
          requestAnimationFrame(() => {
            body.style.maxHeight = "0";
            body.style.opacity = "0";
          });
          parentItem.classList.remove("open");
        } else {
          parentItem.classList.add("open");
          body.style.maxHeight = body.scrollHeight + "px";
          body.style.opacity = "1";

          const onEnd = () => {
            if (parentItem.classList.contains("open")) {
              body.style.maxHeight = "none"; // natural height
            }
            body.removeEventListener("transitionend", onEnd);
          };
          body.addEventListener("transitionend", onEnd);
        }
      });
    });
  } catch (err) {
    console.error("Failed to load heroes.json", err);
  }
});
