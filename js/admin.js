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
