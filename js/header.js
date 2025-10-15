document.addEventListener("DOMContentLoaded", () => {
  const header = document.getElementById("site-header");
  header.innerHTML = `
    <div class="navbar">
      <a href="index.html" class="logo"><img src="images/logo.png" alt="GBS9 Logo"></a>
      <button class="hamburger" onclick="toggleOverlay()">☰</button>
      <div class="overlay" id="overlayMenu">
        <button class="close-overlay" onclick="toggleOverlay()">×</button>
        <ul>
          <li><a href="index.html">Home</a></li>
          <li><a href="premium-listings.html">Premium Listings</a></li>
          <li><a href="menu.html">Design Your Menu</a></li>
          <li><a href="services.html">Services</a></li>
          <li><a href="plan-your-event.html">Plan Your Event</a></li>
          <li><a href="tonights-event.html">Tonight’s Event</a></li>
          <li><a href="contact.html">Contact</a></li>
        </ul>
      </div>
    </div>
  `;
});

function toggleOverlay() {
  document.getElementById("overlayMenu").classList.toggle("active");
}
