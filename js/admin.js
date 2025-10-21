// js/admin.js

document.addEventListener("DOMContentLoaded", () => {
  const categories = ["cocktails", "beer", "spirits", "misc"];
  const saveBtn = document.getElementById("saveMenuBtn");
  const saveMessage = document.getElementById("saveMessage");

  // Load drinks into toggle lists
  categories.forEach(cat => {
    db.collection(cat).get().then(snapshot => {
      const container = document.getElementById(cat);
      if (!container) return;

      container.innerHTML = `<div class="checkbox-grid">
        ${snapshot.docs.map(doc => {
          const d = doc.data();
          return `
            <label>
              <input type="checkbox" data-cat="${cat}" data-id="${doc.id}">
              ${d.name || "Unnamed"}
            </label>
          `;
        }).join("")}
      </div>`;
    });
  });

  // Save button -> collect all checked boxes into tonightMenu
  saveBtn.addEventListener("click", () => {
    const checkedBoxes = document.querySelectorAll("input[type=checkbox]:checked");
    const batch = db.batch();

    checkedBoxes.forEach(cb => {
      const ref = db.collection("tonightMenu").doc(`${cb.dataset.cat}_${cb.dataset.id}`);
      batch.set(ref, {
        category: cb.dataset.cat,
        id: cb.dataset.id,
        enabled: true
      });
    });

    batch.commit().then(() => {
      saveMessage.classList.remove("hidden");
      setTimeout(() => saveMessage.classList.add("hidden"), 2000);
      console.log("[OK] Tonight's menu updated.");
    }).catch(err => {
      console.error("Error saving menu:", err);
    });
  });
});
