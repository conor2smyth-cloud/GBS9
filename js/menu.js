async function loadMenuBuilder() {
  try {
    const res = await fetch("data/cocktails.json");
    const cocktails = await res.json();

    let index = 0;
    const card = document.getElementById("menu-card");
    const matches = document.getElementById("matches");

    function renderCard() {
      if (index >= cocktails.length) {
        card.innerHTML = "<p>No more cocktails!</p>";
        return;
      }
      const c = cocktails[index];
      card.innerHTML = `
        <img src="images/cocktails/${c.image}" alt="${c.name}">
        <h3>${c.name}</h3>
        <p>${c.short || ""}</p>
        <div class="swipe-buttons">
          <button id="skip">✖</button>
          <button id="like">❤</button>
        </div>
      `;

      document.getElementById("skip").onclick = () => {
        index++;
        renderCard();
      };

      document.getElementById("like").onclick = () => {
        matches.innerHTML += `
          <div class="match-card">
            <img src="images/cocktails/${c.image}" alt="${c.name}">
            <p>${c.name}</p>
          </div>
        `;
        index++;
        renderCard();
      };
    }

    renderCard();
  } catch (err) {
    console.error("Error loading menu builder:", err);
  }
}

document.addEventListener("DOMContentLoaded", loadMenuBuilder);
