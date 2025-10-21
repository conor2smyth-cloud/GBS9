document.addEventListener("DOMContentLoaded", async () => {
  try {
    const drinksRes = await fetch("data/drinks.json");
    const drinksData = await drinksRes.json();

    // Load saved tonight.json if exists
    let tonightData = {};
    try {
      const tonightRes = await fetch("data/tonight.json");
      tonightData = await tonightRes.json();
    } catch (e) {
      console.log("No tonight.json yet, starting fresh");
    }

    const container = document.getElementById("tonight-setup");
    if (!container) return;

    // Render each category with checkboxes
    const categories = ["cocktails", "beer", "spirits", "mixers"];
    categories.forEach(cat => {
      if (!drinksData[cat]) return;

      const section = document.createElement("div");
      section.classList.add("admin-section");

      const title = document.createElement("h3");
      title.textContent = cat.charAt(0).toUpperCase() + cat.slice(1);
      section.appendChild(title);

      drinksData[cat].forEach(item => {
        const label = document.createElement("label");
        label.classList.add("admin-checkbox");

        const input = document.createElement("input");
        input.type = "checkbox";
        input.value = item.name;
        input.checked = tonightData[cat]?.includes(item.name) || false;

        label.appendChild(input);
        label.append(` ${item.name}`);
        section.appendChild(label);
      });

      container.appendChild(section);
    });

    // Save button
    document.getElementById("saveTonightBtn").addEventListener("click", () => {
      const newTonight = {};
      categories.forEach(cat => {
        newTonight[cat] = [];
        const checkboxes = container.querySelectorAll(`.admin-section:nth-child(${categories.indexOf(cat) + 1}) input[type=checkbox]`);
        checkboxes.forEach(cb => {
          if (cb.checked) newTonight[cat].push(cb.value);
        });
      });

      // Save to localStorage for now
      localStorage.setItem("tonight.json", JSON.stringify(newTonight, null, 2));
      alert("Tonight's Event saved! (saved to localStorage for now)");
    });

    // Print button
    document.getElementById("printTonightBtn").addEventListener("click", () => {
      window.open("print-menu.html", "_blank");
    });

  } catch (err) {
    console.error("Error loading admin setup:", err);
  }
});


document.addEventListener("DOMContentLoaded", () => {
  const tabs = document.querySelectorAll(".tab-btn");
  const contents = document.querySelectorAll(".tab-content");

  // Tab switching
  tabs.forEach(tab => {
    tab.addEventListener("click", () => {
      tabs.forEach(t => t.classList.remove("active"));
      contents.forEach(c => c.classList.remove("active"));

      tab.classList.add("active");
      document.getElementById(tab.dataset.tab).classList.add("active");
    });
  });

  // Load drinks.json + tonight's event
  Promise.all([
    fetch("data/drinks.json").then(r => r.json()),
    JSON.parse(localStorage.getItem("tonight") || "{}")
  ]).then(([drinks, tonight]) => {
    tonight.sip = tonight.sip || [];

    function renderDrinks(type, containerId) {
      const container = document.getElementById(containerId);
      const filtered = drinks[type] || [];
      container.innerHTML = `
        <div class="checkbox-grid">
          ${filtered.map(drink => {
            const checked = tonight.sip.find(d => d.name === drink.name) ? "checked" : "";
            return `
              <label>
                <input type="checkbox" data-name="${drink.name}" data-type="${type}" ${checked}>
                ${drink.name}
              </label>
            `;
          }).join("")}
        </div>
      `;
    }

    renderDrinks("cocktails", "cocktails");
    renderDrinks("beer", "beer");
    renderDrinks("spirits", "spirits");
    renderDrinks("mixers", "mixers");

    // Event listener for checkboxes
    document.querySelectorAll("input[type=checkbox]").forEach(cb => {
      cb.addEventListener("change", () => {
        const name = cb.dataset.name;
        const type = cb.dataset.type;
        if (cb.checked) {
          tonight.sip.push({ name, type });
        } else {
          tonight.sip = tonight.sip.filter(d => d.name !== name);
        }
        localStorage.setItem("tonight", JSON.stringify(tonight));
      });
    });
  });
});


// /js/admin.js
document.addEventListener("DOMContentLoaded", async () => {
  const { auth, adminSignIn, adminSignOut, loadTonightMenu, saveTonightMenu } = window.FirebaseAPI;

  const emailEl = document.getElementById("adminEmail");
  const passEl  = document.getElementById("adminPass");
  const signInBtn = document.getElementById("signInBtn");
  const signOutBtn = document.getElementById("signOutBtn");
  const whoami = document.getElementById("whoami");

  const tabsBar = document.getElementById("adminTabs");
  const actions = document.getElementById("adminActions");

  const tabBtns = document.querySelectorAll(".tab-btn");
  const panes = document.querySelectorAll(".tab-content");

  // Tab switching
  tabBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      tabBtns.forEach(b => b.classList.remove("active"));
      panes.forEach(p => p.classList.remove("active"));
      btn.classList.add("active");
      document.getElementById(btn.dataset.tab).classList.add("active");
    });
  });

  // Sign in/out
  signInBtn.addEventListener("click", async () => {
    try {
      const user = await adminSignIn(emailEl.value.trim(), passEl.value.trim());
      whoami.textContent = `Signed in as ${user.email} (UID: ${user.uid})`;
      console.log("Your UID – use this in Firestore rules:", user.uid);
      afterAuth();
    } catch (e) {
      alert(e.message);
    }
  });
  signOutBtn.addEventListener("click", async () => {
    await adminSignOut();
    location.reload();
  });

  auth.onAuthStateChanged(user => {
    if (user) {
      whoami.textContent = `Signed in as ${user.email} (UID: ${user.uid})`;
      signInBtn.style.display = "none";
      signOutBtn.style.display = "inline-block";
      emailEl.style.display = passEl.style.display = "none";
      tabsBar.style.display = "flex";
      actions.style.display = "block";
      afterAuth();
    } else {
      whoami.textContent = "";
    }
  });

  let drinksData = null;
  let tonight = { cocktails: [], beer: [], spirits: [], mixers: [] };

  async function afterAuth() {
    // Load full catalog
    if (!drinksData) {
      const res = await fetch("data/drinks.json");
      drinksData = await res.json();
    }
    // Load live doc
    tonight = await loadTonightMenu();

    // Render each category
    renderGrid("cocktails", drinksData.cocktails || []);
    renderGrid("beer",      drinksData.beer || []);
    renderGrid("spirits",   drinksData.spirits || []);
    renderGrid("mixers",    drinksData.mixers || []);

    // Buttons
    document.getElementById("saveTonightBtn").onclick = async () => {
      await saveTonightMenu(tonight);
      alert("Saved to Firestore.");
    };
    document.getElementById("printMenuBtn").onclick = () => window.open("print-menu.html","_blank");
    document.getElementById("previewMenuBtn").onclick = () => window.open("tonights-event.html#sip","_blank");
  }

  function renderGrid(type, items) {
    const pane = document.getElementById(type);
    pane.innerHTML = `
      <div class="checkbox-grid">
        ${items.map(item => {
          const checked = (tonight[type] || []).includes(item.name) ? "checked" : "";
          return `
            <label class="${checked ? "checked" : ""}">
              <input type="checkbox" data-type="${type}" data-name="${item.name}" ${checked}>
              <span>${item.name}</span>
            </label>
          `;
        }).join("")}
      </div>
    `;

    // interactions
    pane.querySelectorAll('input[type="checkbox"]').forEach(cb => {
      cb.addEventListener("change", e => {
        const name = e.target.dataset.name;
        const cat = e.target.dataset.type;
        const label = e.target.closest("label");
        tonight[cat] = tonight[cat] || [];
        if (e.target.checked) {
          if (!tonight[cat].includes(name)) tonight[cat].push(name);
          label.classList.add("checked");
        } else {
          tonight[cat] = tonight[cat].filter(n => n !== name);
          label.classList.remove("checked");
        }
      });
    });
  }
});

