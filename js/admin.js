// admin.js
// relies on firebase + db already initialized in admin.html

async function loadCategory(category) {
  const container = document.getElementById(category);
  container.innerHTML = "<p>Loading...</p>";

  try {
    const snapshot = await db.collection(category).get();
    container.innerHTML = snapshot.docs.map(doc => {
      const data = doc.data();
      return `
        <label class="drink-option">
          <input type="checkbox" value="${doc.id}" data-category="${category}">
          ${data.name || "Unnamed"}
        </label>
      `;
    }).join("");
  } catch (err) {
    container.innerHTML = `<p>Error: ${err.message}</p>`;
  }
}

async function saveMenu() {
  try {
    const selected = Array.from(document.querySelectorAll("input[type=checkbox]:checked"))
      .map(cb => ({
        category: cb.dataset.category,
        drinkId: cb.value
      }));

    const tonightRef = db.collection("tonightMenu");

    // clear old menu first
    const docs = await tonightRef.get();
    for (const doc of docs.docs) {
      await doc.ref.delete();
    }

    // save new
    for (const item of selected) {
      await tonightRef.add(item);
    }

    alert("✅ Tonight’s menu saved!");
  } catch (err) {
    console.error("Error saving menu:", err);
    alert("❌ Failed to save menu.");
  }
}

document.addEventListener("DOMContentLoaded", () => {
  ["cocktails", "beer", "spirits", "misc"].forEach(loadCategory);
  document.getElementById("saveMenu").addEventListener("click", saveMenu);
});

