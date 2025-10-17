// hero.js — clean + auto-height accordion + left image + gradient flow

document.addEventListener("DOMContentLoaded", async () => {
  try {
    const res = await fetch("data/heroes.json");
    const heroes = await res.json();

    heroes.forEach((hero) => {
      const wrapper = document.querySelector(`[data-hero="${hero.id}"]`);
      if (!wrapper) return;

      // --- HERO HEADER (image on left, gradient background)
      wrapper.classList.add("hero-wrapper");

      // Gradient continuity (prefer explicit gradient, else use accordion color)
      if (hero.gradient && hero.gradient.trim()) {
        wrapper.style.setProperty("--hero-gradient", hero.gradient.trim());
      } else if (hero.accordion_color && hero.accordion_color.trim()) {
        wrapper.style.setProperty("--hero-gradient", hero.accordion_color.trim());
      }

      // Build header DOM to avoid template-string pitfalls
      wrapper.innerHTML = "";
      const img = document.createElement("img");
      img.alt = (hero.title || "").toString();
      img.src = `images/hero/${encodeURIComponent(hero.image || "")}`;
      wrapper.appendChild(img);

      const content = document.createElement("div");
      content.className = "hero-content";
      content.innerHTML = `
        <h2>${escapeHtml(hero.title || "")}</h2>
      `;
      wrapper.appendChild(content);

      // --- ACCORDION BODY
      const parentItem = wrapper.closest(".accordion-item");
      if (!parentItem) return;

      const body = parentItem.querySelector(".accordion-body");
      if (body) {
        // Clear and build inner container
        body.innerHTML = "";
        const inner = document.createElement("div");
        inner.className = "accordion-inner";

        // Set background (color +/or image) via style props (safe)
        if (hero.accordion_bg && hero.accordion_bg.trim()) {
          inner.style.backgroundImage = `url('images/hero/${encodeURIComponent(hero.accordion_bg.trim())}')`;
          inner.style.backgroundSize = "cover";
          inner.style.backgroundPosition = "center";
        }
        if (hero.accordion_color && hero.accordion_color.trim()) {
          inner.style.backgroundColor = hero.accordion_color.trim();
          // Keep header gradient visually in sync with accordion color if no explicit gradient
          if (!hero.gradient || !hero.gradient.trim()) {
            wrapper.style.setProperty("--hero-gradient", hero.accordion_color.trim());
          }
        }

        // Description + optional subtitle + optional button
        const parts = [];
        if (hero.description && hero.description.trim()) {
          parts.push(`<p>${escapeHtml(hero.description.trim())}</p>`);
        }
        if (hero.subtitle && hero.subtitle.trim()) {
          parts.push(`<p class="subtitle">${escapeHtml(hero.subtitle.trim())}</p>`);
        }
        if (hero.button_enabled && hero.button_text && hero.button_link) {
          parts.push(
            `<a href="${safeHref(hero.button_link)}" class="btn">${escapeHtml(
              hero.button_text
            )}</a>`
          );
        }
        inner.innerHTML = parts.join("\n");
        body.appendChild(inner);
      }

      // --- SMOOTH AUTO-HEIGHT TOGGLE
     // --- SMOOTH AUTO-HEIGHT TOGGLE
wrapper.addEventListener("click", () => {
  const bodyEl = parentItem.querySelector(".accordion-body");
  if (!bodyEl) return;

  const isOpen = parentItem.classList.contains("open");

  if (isOpen) {
    // collapse
    bodyEl.style.maxHeight = bodyEl.scrollHeight + "px"; // lock height first
    requestAnimationFrame(() => {
      bodyEl.style.maxHeight = "0";
      bodyEl.style.opacity = "0";
    });
    parentItem.classList.remove("open");
  } else {
    // expand
    parentItem.classList.add("open");
    bodyEl.style.maxHeight = bodyEl.scrollHeight + "px";
    bodyEl.style.opacity = "1";

    // after animation → allow natural growth
    const onEnd = () => {
      if (parentItem.classList.contains("open")) {
        bodyEl.style.maxHeight = "none";
      }
      bodyEl.removeEventListener("transitionend", onEnd);
    };
    bodyEl.addEventListener("transitionend", onEnd);
  }
});


          // After the transition, set to 'auto' so it can expand if content wraps/reflows
          const onEnd = () => {
            if (parentItem.classList.contains("open")) {
              bodyEl.style.maxHeight = "none";
            }
            bodyEl.removeEventListener("transitionend", onEnd);
          };
          bodyEl.addEventListener("transitionend", onEnd);
        }
      });
    });
  } catch (err) {
    console.error("Error loading heroes.json", err);
  }
});

// --- helpers ---
function escapeHtml(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

// keep relative links intact, encode spaces/unsafe chars
function safeHref(href) {
  try {
    return encodeURI(String(href));
  } catch {
    return "#";
  }
}
