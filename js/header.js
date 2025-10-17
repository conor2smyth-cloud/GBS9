document.addEventListener("DOMContentLoaded", () => {
  const header = document.querySelector("header");
  if (!header) return; // exit if page has no <header>

  // ✅ Inject header HTML
  header.innerHTML = `
    <div class="navbar">
      <div class="logo">
        <a href="index.html"><img src="images/logo.png" alt="Logo"></a>
      </div>
      <nav>
        <ul class="desktop-nav">
          <li><a href="index.html">Home</a></li>
          <li><a href="services.html">Services</a></li>
          <li><a href="tonights-event.html">Tonight's Event</a></li>
          <li><a href="premium-listings.html">Premium Listings</a></li>
          <li><a href="design-your-menu.html">Design Your Menu</a></li>
        </ul>
      </nav>
      <button class="hamburger" id="hamburger">&#9776;</button>
    </div>

    <div class="overlay" id="overlay">
      <button class="close-overlay" id="closeOverlay">&times;</button>
      <ul>
        <li style="--i:0"><a href="index.html">Home</a></li>
        <li style="--i:1"><a href="services.html">Services</a></li>
        <li style="--i:2"><a href="tonights-event.html">Tonight's Event</a></li>
        <li style="--i:3"><a href="premium-listings.html">Premium Listings</a></li>
        <li style="--i:4"><a href="menu.html">Design Your Menu</a></li>
      </ul>
    </div>
  `;

  // ✅ Overlay toggle logic
  const hamburger = document.getElementById("hamburger");
  const overlay = document.getElementById("overlay");
  const closeOverlay = document.getElementById("closeOverlay");

  if (hamburger && overlay && closeOverlay) {
    hamburger.addEventListener("click", () => {
      overlay.classList.add("active");
    });

    closeOverlay.addEventListener("click", () => {
      overlay.classList.remove("active");
    });

    // Close overlay when a nav link is clicked
    overlay.querySelectorAll("a").forEach(link => {
      link.addEventListener("click", () => {
        overlay.classList.remove("active");
      });
    });
  }
});
