// tonights-event.js
document.addEventListener("DOMContentLoaded", () => {
  const db = firebase.firestore();
  const menuList = document.getElementById("menuList");

  // Listen for real-time updates
  db.collection("tonightMenu").doc("current").onSnapshot(async (doc) => {
    if (!doc.exists) {
      menuList.innerHTML = "<p>No drinks selected yet.</p>";
      return;
    }

    const tonightData = doc.data();
    menuList.innerHTML = "";

    // Loop categories
    for (const [cat, ids] of Object.entries(tonightData)) {
      if (!ids.length) continue;

      const catDiv = document.createElement("div");
      catDiv.innerHTML = `<h3 style="margin-top:1rem;">${cat.toUpperCase()}</h3>`;

      // Fetch each selected drink
      for (const id of ids) {
        const dSnap = await db.collection(cat).doc(id).get();
        if (!dSnap.exists) continue;

        const d = dSnap.data();
        const item = document.createElement("div");
        item.className = "menu-item";
        item.innerHTML = `
          <strong>${d.name}</strong><br>
          <em>${d.ingredients?.join(", ") || ""}</em><br>
          <span>${d.short || ""}</span>
        `;
        catDiv.appendChild(item);
      }

      menuList.appendChild(catDiv);
    }
  });
});

