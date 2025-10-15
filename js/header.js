document.addEventListener("DOMContentLoaded", () => {
  const header = document.getElementById("site-header");

  header.innerHTML = `
    <div class="navbar">
      <div class="logo">
        <a href="index.html"><img src="images/logo2.png" alt="GBS Logo"></a>
      </div>
      <button class="hamburger" onclick="toggleMenu()">☰</button>
      <nav class="overlay" id="overlayMenu">
        <button class="close-overlay" onclick="toggleMenu()">×</button>
        <ul>
          <li><a href="index.html">Home</a></li>
          <li><a href="services.html">Services</a></li>
          <li><a href="premium-listings.html">Premium Listings</a></li>
          <li><a href="menu.html">Design Your Menu</a></li>
          <li><a href="plan-your-event.html">Plan Your Event</a></li>
          <li><a href="tonights-event.html">Tonight’s Event</a></li>
          <li><a href="contact.html">Contact</a></li>
          <li><a href="admin.html" class="highlight">Admin</a></li>
        </ul>
      </nav>
    </div>
  `;
});

function toggleMenu() {
  document.getElementById("overlayMenu").classList.toggle("active");
}
