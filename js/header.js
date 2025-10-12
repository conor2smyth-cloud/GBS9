document.addEventListener("DOMContentLoaded", () => {
  const html = `
  <header class="site-header">
    <nav class="nav-container">
      <button class="nav-burger" aria-label="Toggle navigation">☰</button>

      <ul class="nav-left nav-links">
        <li><a href="index.html">Home</a></li>
        <li><a href="services.html">Services</a></li>
        <li><a href="premium-listings.html">Premium Listings</a></li>
      </ul>

      <div class="logo">
        <a href="index.html">
          <img src="images/logos/logo2.png" alt="GBS9 Logo" onerror="this.src='images/logos/logo.png'">
        </a>
      </div>

      <ul class="nav-right nav-links">
        <li><a href="menu.html">Design Your Menu</a></li>
        <li><a href="lookbook.html">Lookbook</a></li>
        <li><a href="contact.html">Contact</a></li>
        <li><a class="btn-mini" href="tonights-event.html">Tonight’s Event</a></li>
      </ul>
    </nav>
  </header>`;
  const mount = document.getElementById("site-header") || document.getElementById("header");
  if (mount) mount.innerHTML = html;

  const burger = document.querySelector(".nav-burger");
  const left = document.querySelector(".nav-left");
  const right = document.querySelector(".nav-right");
  if (burger) {
    burger.addEventListener("click", () => {
      left?.classList.toggle("show");
      right?.classList.toggle("show");
    });
  }
});
