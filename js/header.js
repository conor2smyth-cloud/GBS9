// js/header.js

document.addEventListener("DOMContentLoaded", () => {
  const header = document.getElementById("site-header");

  header.innerHTML = `
    <div class="navbar">
      <a href="index.html" class="logo">
        <img src="images/logo2.png" alt="GBS Logo">
      </a>
      <button class="hamburger" id="hamburgerBtn">&#9776;</button>
    </div>

    <div class="overlay" id="overlayMenu">
      <button class="close-overlay" id="closeOverlay">&times;</button>
      <ul>
        <li style="--i:1"><a href="index.html">Home</a></li>
        <li style="--i:2"><a href="services.html">Services</a></li>
        <li style="--i:3"><a href="premium-listings.html">Premium Listings</a></li>
        <li style="--i:4"><a href="menu.html">Design Your Menu</a></li>
        <li style="--i:5"><a href="lookbook.html">Lookbook</a></li>
        <li style="--i:6"><a href="tonights-event.html">Tonight’s Event</a></li>
        <li style="--i:7"><a href="admin.html" class="highlight">Admin</a></li>
      </ul>
    </div>
  `;

  const hamburgerBtn = document.getElementById("hamburgerBtn");
  const overlayMenu = document.getElementById("overlayMenu");
  const closeOverlay = document.getElementById("closeOverlay");

  hamburgerBtn.addEventListener("click", () => {
    overlayMenu.classList.add("active");
  });

  closeOverlay.addEventListener("click", () => {
    overlayMenu.classList.remove("active");
  });

  // Also close overlay if user clicks outside the menu list
  overlayMenu.addEventListener("click", (e) => {
    if (e.target === overlayMenu) {
      overlayMenu.classList.remove("active");
    }
  });
});

