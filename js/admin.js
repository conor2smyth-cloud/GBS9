document.addEventListener("DOMContentLoaded", () => {
  const containerCocktails = document.getElementById("cocktails");
  const containerBeer = document.getElementById("beer");
  const containerSpirits = document.getElementById("spirits");
  const containerMixers = document.getElementById("mixers");

  const saveBtn = document.getElementById("saveTonightBtn");

if (saveBtn) {
  saveBtn.addEventListener("click", () => {
    localStorage.setItem("tonight", JSON.stringify(tonight));

    // ✅ Show success banner
    const notice = document.getElementById("adminNotice");
    notice.style.display = "block";
    notice.style.opacity = "1";

    setTimeout(() => {
      notice.style.opacity = "0";
      setTimeout(() => (notice.style.display = "none"), 1000);
    }, 2500);
  });
}


  // Load tonight’s saved state
  const tonight = JSON.parse(localStorage.getItem("tonight") || "{}");
  tonight.sip = tonight.sip || [];

  fetch("data/drinks.json")
    .then(res => res.json())
    .then(data => {
      renderCategory(data.cocktails || [], "Cocktail", containerCocktails);
      renderCategory(data.beer || [], "Beer", containerBeer);
      renderCategory(data.spirits || [], "Spirit", containerSpirits);
      renderCategory(data.misc || [], "Mixer", containerMixers);
    });

  function renderCategory(drinks, type, container) {
    if (!container) return;

    container.innerHTML = `
      <div class="checkbox-grid">
        ${drinks.map(drink => {
          const name = drink.name || drink.Name || "Unnamed";
          const checked = tonight.sip.find(d => d.name === name) ? "checked" : "";
          return `
            <label class="${checked ? "checked" : ""}">
              <input type="checkbox" data-name="${name}" data-type="${type.toLowerCase()}" ${checked}>
              <span>${name}</span>
            </label>
          `;
        }).join("")}
      </div>
    `;

    // Checkbox behaviour
    container.querySelectorAll("input[type=checkbox]").forEach(cb => {
      cb.addEventListener("change", e => {
        const name = e.target.dataset.name;
        const type = e.target.dataset.type;
        if (e.target.checked) {
          tonight.sip.push({ name, type });
        } else {
          tonight.sip = tonight.sip.filter(d => d.name !== name);
        }
        localStorage.setItem("tonight", JSON.stringify(tonight));
      });
    });
  }

  // Save button
  if (saveBtn) {
    saveBtn.addEventListener("click", () => {
      localStorage.setItem("tonight", JSON.stringify(tonight));
      alert("✅ Tonight’s menu has been saved!");
    });
  }
});



