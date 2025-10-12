<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Design Your Menu | GBS9</title>
  <link href="https://fonts.googleapis.com/css2?family=Merriweather:wght@400;700&family=Montserrat:wght@600&display=swap" rel="stylesheet">
  <style>
    body {
      margin: 0;
      font-family: 'Merriweather', serif;
      background: linear-gradient(135deg, #2b1d1a, #1a0f0d);
      color: #f5f5f5;
      overflow-x: hidden;
    }

    /* === Navbar === */
    nav {
      position: fixed;
      top: 0; left: 0; right: 0;
      background: linear-gradient(90deg, #4b2e2a, #2b1d1a);
      display: flex; align-items: center; justify-content: space-between;
      padding: 0.8rem 2rem;
      z-index: 1000;
      box-shadow: 0 2px 5px rgba(0,0,0,0.5);
    }

    nav img {
      height: 40px;
    }

    nav ul {
      list-style: none;
      display: flex;
      gap: 1.5rem;
      margin: 0; padding: 0;
    }

    nav li a {
      font-family: 'Montserrat', sans-serif;
      font-weight: 600;
      color: #f5f5f5;
      position: relative;
    }

    nav li a::after {
      content: '';
      position: absolute; left: 0; bottom: -4px;
      width: 0; height: 2px;
      background: #d4a373;
      transition: width 0.3s;
    }

    nav li a:hover::after { width: 100%; }

    /* === Tinder Section === */
    .swipe-section {
      padding-top: 6rem;
      text-align: center;
    }

    .card-stack {
      position: relative;
      width: 300px;
      height: 420px;
      margin: 2rem auto;
    }

    .card {
      position: absolute;
      width: 100%;
      height: 100%;
      background: rgba(255,255,255,0.05);
      border-radius: 20px;
      overflow: hidden;
      box-shadow: 0 8px 20px rgba(0,0,0,0.6);
      display: flex;
      flex-direction: column;
      justify-content: flex-end;
      padding: 1rem;
      cursor: grab;
      transition: transform 0.3s ease, opacity 0.3s ease;
    }

    .card img {
      position: absolute;
      top: 0; left: 0;
      width: 100%; height: 100%;
      object-fit: cover;
      border-radius: 20px;
      z-index: -1;
      filter: brightness(0.9) contrast(1.05);
    }

    .card h3 {
      font-family: 'Montserrat', sans-serif;
      margin: 0;
      font-size: 1.4rem;
    }

    .card p {
      font-size: 0.9rem;
      margin: 0.3rem 0 0;
    }

    .buttons {
      margin-top: 1rem;
      display: flex;
      justify-content: center;
      gap: 2rem;
    }

    .buttons button {
      width: 60px; height: 60px;
      border-radius: 50%;
      border: none;
      font-size: 1.5rem;
      cursor: pointer;
      transition: transform 0.2s;
    }

    .buttons button:hover {
      transform: scale(1.1);
    }

    .dislike { background: #b23b3b; color: white; }
    .like { background: #3bb259; color: white; }

    /* === Menu Results === */
    .menu-results {
      padding: 2rem;
      background: rgba(0,0,0,0.3);
      margin-top: 2rem;
    }

    .menu-results h2 {
      font-family: 'Montserrat', sans-serif;
      margin-bottom: 1rem;
      text-align: center;
    }

    .menu-item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      background: rgba(255,255,255,0.05);
      padding: 0.8rem 1rem;
      border-radius: 10px;
      margin-bottom: 1rem;
      box-shadow: 0 3px 8px rgba(0,0,0,0.5);
    }

    .menu-item img {
      height: 50px;
      width: 50px;
      object-fit: cover;
      border-radius: 8px;
      margin-left: 1rem;
    }
  </style>
</head>
<body>
  <!-- Navbar -->
  <nav>
    <img src="images/logo2.png" alt="GBS Logo">
    <ul>
      <li><a href="index.html">Home</a></li>
      <li><a href="menu.html">Menu</a></li>
      <li><a href="premium-listings.html">Premium Listings</a></li>
      <li><a href="lookbook.html">Lookbook</a></li>
      <li><a href="services.html">Services</a></li>
      <li><a href="tonights-event.html">Events</a></li>
      <li><a href="contact.html">Contact</a></li>
      <li><a href="admin.html">Admin</a></li>
    </ul>
  </nav>

  <section class="swipe-section">
    <h1>Design Your Menu</h1>
    <div class="card-stack" id="cardStack"></div>
    <div class="buttons">
      <button class="dislike" onclick="dislike()">✖</button>
      <button class="like" onclick="like()">❤</button>
    </div>
  </section>

  <section class="menu-results">
    <h2>Your Menu</h2>
    <div id="menuList"></div>
  </section>

  <script>
    let cocktails = [];
    let currentIndex = 0;
    let liked = [];

    async function loadCocktails() {
      const res = await fetch("data/cocktails.json");
      cocktails = await res.json();
      renderCard();
    }

    function renderCard() {
      const stack = document.getElementById("cardStack");
      stack.innerHTML = "";
      if (currentIndex < cocktails.length) {
        const c = cocktails[currentIndex];
        const card = document.createElement("div");
        card.className = "card";
        card.innerHTML = `
          <img src="images/cocktails/${c.image}" alt="${c.name}">
          <h3>${c.name}</h3>
          <p>${c.short}</p>
        `;
        stack.appendChild(card);
      } else {
        stack.innerHTML = "<p>No more cocktails! 🍸</p>";
      }
    }

    function like() {
      if (currentIndex < cocktails.length) {
        liked.push(cocktails[currentIndex]);
        updateMenu();
        currentIndex++;
        renderCard();
      }
    }

    function dislike() {
      if (currentIndex < cocktails.length) {
        currentIndex++;
        renderCard();
      }
    }

    function updateMenu() {
      const menu = document.getElementById("menuList");
      menu.innerHTML = "";
      liked.forEach(c => {
        const item = document.createElement("div");
        item.className = "menu-item";
        item.innerHTML = `
          <span>${c.name} — ${c.short}</span>
          <img src="images/cocktails/${c.image}" alt="${c.name}">
        `;
        menu.appendChild(item);
      });
    }

    loadCocktails();
  </script>
</body>
</html>
