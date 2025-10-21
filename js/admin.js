document.addEventListener("DOMContentLoaded", () => {
  const containerCocktails = document.getElementById("cocktails");
  const containerBeer = document.getElementById("beer");
  const containerSpirits = document.getElementById("spirits");
  const containerMixers = document.getElementById("mixers");

  // Load tonight’s saved state from localStorage (or Firestore if you wire that in)
  const tonight = JSON.parse(localStorage.getItem("tonight") || "{}");
  tonight.sip = tonight.sip || [];

  fetch("data/drinks.json")
    .then(res => res.json())
    .then(data => {
      renderCategory(data.cocktails || [], "Cocktails", containerCocktails);
      renderCategory(data.beer || [], "Beer", containerBeer);
      renderCategory(data.spirits || [], "Spirits", containerSpirits);
      renderCategory(data.misc || [], "Mixers", containerMixers);
    });

  function renderCategory(drinks, type, container) {
    if (!container) return;

    container.innerHTML = `
      <div class="checkbox-grid">
        ${drinks.map(drink => {
          const name = drink.name || drink.Name || "Unnamed";
          const image = drink.image || drink.Image || "";
          const short = drink.short || drink.Short || "";
          const checked = tonight.sip.find(d => d.name === name) ? "checked" : "";
          return `
            <label class="${checked ? "checked" : ""}">
              <input type="checkbox" data-name="${name}" data-type="${type.toLowerCase()}" ${checked}>
              ${image ? `<img src="images/${image}" alt="${name}" style="height:30px;width:auto;">` : ""}
              <span>${name}</span>
            </label>
          `;
        }).join("")}
      </div>
    `;

    // Add toggle behavior
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
});



