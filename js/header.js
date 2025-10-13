document.addEventListener("DOMContentLoaded", () => {
  const header = document.getElementById("site-header");
  header.innerHTML = `
    <nav class="navbar">
      <ul>
        <li><a href="index.html">Home</a></li>
        <li><a href="services.html">Services</a></li>
        <li><a href="premium-listings.html">Premium Listings</a></li>
        <li class="logo"><a href="index.html"><img src="images/logo2.png" alt="GBS Logo"></a></li>
        <li><a href="menu.html">Design Your Menu</a></li>
        <li><a href="lookbook.html">Lookbook</a></li>
        <li><a href="tonights-event.html">Tonight’s Event</a></li>
        <li><a href="contact.html">Contact</a></li>
        <li><a href="admin.html" class="highlight">Admin</a></li>
      </ul>
    </nav>
  `;
});
/logo2