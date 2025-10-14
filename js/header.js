document.addEventListener("DOMContentLoaded", () => {
  const header = document.getElementById("site-header");
  if (!header) return;

  header.innerHTML = `
    <nav class="navbar">
      <div class="nav-left">
        <a href="index.html" class="logo"><img src="images/logo2.png" alt="GBS Logo"></a>
      </div>
      <div class="nav-right">
        <button class="hamburger" aria-label="Menu">☰</button>
      </div>
    </nav>
    <div class="overlay" id="navOverlay">
      <button class="close-overlay" aria-label="Close">×</button>
      <ul>
        <li><a href="index.html">Home</a></li>
        <li><a href="services.html">Services</a></li>
        <li><a href="premium-listings.html">Premium Listings</a></li>
        <li><a href="menu.html">Design Your Menu</a></li>
        <li><a href="lookbook.html">Lookbook</a></li>
        <li><a href="tonights-event.html">Tonight’s Event</a></li>
        <li><a href="admin.html">Admin</a></li>
        <li><a href="contact.html">Contact</a></li>
      </ul>
    </div>
  `;

  const overlay = document.getElementById("navOverlay");
  const hamburger = document.querySelector(".hamburger");
  const closeBtn = document.querySelector(".close-overlay");

  hamburger.addEventListener("click", () => {
    overlay.classList.add("active");
  });

  closeBtn.addEventListener("click", () => {
    overlay.classList.remove("active");
  });

  overlay.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", () => overlay.classList.remove("active"));
  });
});
