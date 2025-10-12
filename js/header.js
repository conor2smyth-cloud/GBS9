document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("header").innerHTML = `
    <header class="site-header">
      <div class="logo">
        <a href="index.html"><img src="images/logo2.png" alt="GBS9 Logo"></a>
      </div>
      <nav class="nav">
        <button class="nav-toggle">☰</button>
        <ul class="nav-links">
          <li><a href="index.html">Home</a></li>
          <li><a href="premium-listings.html">Premium Listings</a></li>
          <li><a href="menu.html">Design Your Menu</a></li>
          <li><a href="lookbook.html">Lookbook</a></li>
          <li><a href="services.html">Services</a></li>
          <li><a href="contact.html">Contact</a></li>
          <li class="highlight"><a href="tonights-event.html">Tonight’s Event</a></li>
        </ul>
      </nav>
    </header>
  `;

  // mobile nav toggle
  const toggle = document.querySelector(".nav-toggle");
  const links = document.querySelector(".nav-links");
  toggle.addEventListener("click", () => {
    links.classList.toggle("show");
  });
});
