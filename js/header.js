// header.js
document.addEventListener("DOMContentLoaded", () => {
  const headerEl = document.querySelector("header");
  if (!headerEl) {
    console.warn("header.js: No <header> element found on this page.");
    return;
  }

  headerEl.innerHTML = `
    <div class="navbar">
      <div class="logo">
        <a href="index.html"><img src="images/logo.png" alt="GBS9 Logo"></a>
      </div>
      <nav>
        <ul>
          <li><a href="tonights-event.html">Tonight's Event</a></li>
          <li><a href="premium-listings.html">Premium Listings</a></li>
          <li><a href="services.html">Services</a></li>
          <li><a href="plan-your-event.html">Plan Your Event</a></li>
        </ul>
      </nav>
    </div>
  `;
const header = document.querySelector("header");
if (!header) {
  // no header on this page, just exit silently
  return;
}


});
