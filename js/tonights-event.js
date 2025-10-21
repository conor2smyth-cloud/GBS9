// tonights-event.js
// db already initialized in HTML

async function loadTonightMenu() {
  const menuDiv = document.getElementById("menu");
  menuDiv.innerHTML = "<p>Loading menu...</p>";

  try {
    // get selected items
    const snapshot = await db.collection("tonightMenu").get();

    if (snapshot.empty) {
      menuDiv.innerHTML = "<p>No menu has been set yet. Please check back later!</p>";
      return;
    }

    // group by category
    const grouped = {};
    for (const doc of snapshot.docs) {
      const { category, drinkId } = doc.data();

      if (!grouped[category]) grouped[category] = [];

      // fetch drink details from correct collection
      const drinkDoc = await db.collection(category).doc(drinkId).get();
      if (drinkDoc.exists) {
        grouped[category].push(drinkDoc.data().name || "Unnamed");
      }
    }

    // render menu
    menuDiv.innerHTML = Object.entries(grouped).map(([cat, drinks]) => `
      <h2>${cat.charAt(0).toUpperCase() + cat.slice(1)}</h2>
      <ul>
        ${drinks.map(d => `<li>${d}</li>`).join("")}
      </ul>
    `).join("");

  } catch (err) {
    console.error("Error loading tonight’s menu:", err);
    menuDiv.innerHTML = "<p>⚠️ Failed to load menu.</p>";
  }
}

document.addEventListener("DOMContentLoaded", loadTonightMenu);

