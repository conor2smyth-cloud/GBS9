document.addEventListener("DOMContentLoaded", () => {
  const headerHTML = `
    <header class="site-header">
      <nav class="nav-container">
        <ul class="nav-left">
          <li><a href="index.html">Home</a></li>
          <li><a href="services.html">Services</a></li>
          <li><a href="premium-listings.html">Premium Listings</a></li>
        </ul>

        <div class="logo">
          <a href="index.html"><img src="images/logos/logo2.png" alt="GBS Logo"></a>
        </div>

        <ul class="nav-right">
          <li><a href="menu.html">Design Your Menu</a></li>
          <li><a href="lookbook.html">Lookbook</a></li>
          <li><a href="contact.html">Contact</a></li>
          <li><a href="admin.html">Admin</a></li>
        </ul>

        <div class="hamburger">☰</div>
      </nav>
    </header>
  `;
  document.getElementById("site-header").innerHTML = headerHTML;

  // Mobile menu toggle
  const burger = document.querySelector(".hamburger");
  const nav = document.querySelector(".nav-container");
  burger.addEventListener("click", () => {
    nav.classList.toggle("open");
  });

document.addEventListener("DOMContentLoaded", () => {
  const nav = document.querySelector(".navbar nav ul");
  const hamburger = document.createElement("div");
  hamburger.classList.add("hamburger");
  hamburger.innerHTML = "<div></div><div></div><div></div>";
  document.querySelector(".navbar").appendChild(hamburger);

  hamburger.addEventListener("click", () => {
    nav.classList.toggle("show");
  });
});


});
