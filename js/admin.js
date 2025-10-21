document.addEventListener("DOMContentLoaded", async () => {
  // DOM references
  const tabs = document.querySelectorAll(".tab-btn");
  const contents = document.querySelectorAll(".tab-content");
  const saveBtn = document.getElementById("saveTonightBtn");
  const loginBox = document.getElementById("authBox");
  const signInBtn = document.getElementById("signInBtn");
  const signOutBtn = document.getElementById("signOutBtn");
  const whoami = document.getElementById("whoami");

  // --- Tabs handling ---
  tabs.forEach(tab => {
    tab.addEventListener("click", () => {
      tabs.forEach(t => t.classList.remove("active"));
      contents.forEach(c => c.classList.remove("active"));
      tab.classList.add("active");
      document.getElementById(tab.dataset.tab).classList.add("active");
    });
  });

  // --- Load drinks dynamically ---
  try {
    const res = await fetch("data/drinks.json");
    const data = await res.json();

    const categories = {
      cocktails: data.cocktails || [],
      beer: data.beer || [],
      spirits: data.spirits || [],
      mixers: data.misc || [] // map misc → mixers
    };

    Object.keys(categories).forEach(cat => {
      const container = document.getElementById(cat);
      if (!container) return;

      container.innerHTML = categories[cat].map(d => `
        <label class="drink-label">
          <input type="checkbox" data-name="${d.name}" data-type="${cat}">
          ${d.name}
        </label>
      `).join("");
    });
  } catch (err) {
    console.error("Error loading drinks:", err);
  }

  // --- Firebase Auth ---
  signInBtn.addEventListener("click", async () => {
    const email = document.getElementById("adminEmail").value;
    const pass = document.getElementById("adminPass").value;
    try {
      await auth.signInWithEmailAndPassword(email, pass);
      whoami.textContent = `Signed in as ${email}`;
      signInBtn.style.display = "none";
      signOutBtn.style.display = "inline-block";
      loginBox.style.display = "none";
      document.getElementById("adminTabs").style.display = "flex";
      document.getElementById("adminActions").style.display = "block";
    } catch (err) {
      alert("Login failed: " + err.message);
    }
  });

  signOutBtn.addEventListener("click", async () => {
    await auth.signOut();
    whoami.textContent = "Signed out";
    signInBtn.style.display = "inline-block";
    signOutBtn.style.display = "none";
    loginBox.style.display = "block";
    document.getElementById("adminTabs").style.display = "none";
    document.getElementById("adminActions").style.display = "none";
  });

  // --- Save Menu ---
  if (saveBtn) {
    saveBtn.addEventListener("click", async () => {
      const selected = [];
      document.querySelectorAll("input[type=checkbox]:checked").forEach(cb => {
        selected.push({
          name: cb.dataset.name,
          type: cb.dataset.type
        });
      });

      try {
        await db.collection("tonight").doc("menu").set({ drinks: selected });
        alert("✅ Tonight’s menu saved!");
      } catch (err) {
        alert("Error saving: " + err.message);
      }
    });
  }
});
