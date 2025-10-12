document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("footer").innerHTML = `
    <footer class="site-footer">
      <p>&copy; ${new Date().getFullYear()} GBS9. All rights reserved.</p>
    </footer>
  `;
});
