// --- Firebase Init ---
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}
const db = firebase.firestore();

// --- Render menu ---
async function renderMenu() {
  const container = document.getElementById("menuContainer");
  if (!container) return;

  container.innerHTML = "<p>Loading menu...</p>";

  try {
    // Get tonight’s selected drinks
    const tonightSnapshot = await db.collection("tonightMenu").get();
    if (tonightSnapshot.empty) {
      container.innerHTML = "<p>No menu set yet. Please check back later.</p>";
      return;
    }

    // Group drinks by category
    const grouped = {};
    for (const doc of tonightSnapshot.docs) {
      const { category, drinkId } = doc.data();

      if (!grouped[category]) grouped[category] = [];

      // Fetch drink details from the category collection
      const drinkDoc = await db.collection(category).doc(drinkId).get();
      if (drinkDoc.exists) {
        grouped[category].push(drinkDoc.data());
      }
    }

    // Render grouped menu
    container.innerHTML = Object.keys(grouped).map(cat => {
      return `
        <section class="menu-section">
          <h2>${cat.charAt(0).toUpperCase() + cat.slice(1)}</h2>
          <div class="menu-grid">
            ${grouped[cat].map(drink => `
              <div class="menu-item">
                ${drink.image ? `<img src="assets/drinks/${drink.image}" alt="${drink.name}">` : ""}
                <h3>${drink.name || "Unnamed"}</h3>
                ${drink.blurb ? `<p>${drink.blurb}</p>` : ""}
              </div>
            `).join("")}
          </div>
        </section>
      `;
    }).join("");

  } catch (err) {
    console.error("Error rendering menu:", err);
    container.innerHTML = "<p>⚠️ Error loading menu. Please try again later.</p>";
  }
}

// --- Run ---
document.addEventListener("DOMContentLoaded", renderMenu);
