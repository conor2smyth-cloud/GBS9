// admin.js

// Firebase setup (uses firebase-config.js for config)
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getFirestore, collection, getDocs, setDoc, doc } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

let currentCategory = "cocktails";

// Force-show admin panel (no login)
function showAdminPanel() {
  document.getElementById("admin-panel").style.display = "block";
  loadDrinks(currentCategory);
}

// Load drinks from Firestore
async function loadDrinks(category) {
  currentCategory = category;
  const container = document.getElementById("drinks-container");
  container.innerHTML = "";

  try {
    const querySnapshot = await getDocs(collection(db, capitalize(category)));
    querySnapshot.forEach(docSnap => {
      const drink = docSnap.data();
      const div = document.createElement("div");
      div.classList.add("drink-item");

      div.innerHTML = `
        <label>
          <input type="checkbox" value="${drink.name}">
          ${drink.name}
        </label>
      `;
      container.appendChild(div);
    });
  } catch (err) {
    console.error("Error loading drinks:", err);
  }
}

// Save tonight’s menu
async function saveTonightsMenu() {
  const selected = Array.from(document.querySelectorAll("#drinks-container input:checked"))
    .map(input => ({ name: input.value, type: currentCategory }));

  try {
    await setDoc(doc(db, "tonight", "menu"), { drinks: selected, updatedAt: new Date() });
    alert("Tonight’s menu saved!");
  } catch (err) {
    console.error("Error saving tonight’s menu:", err);
    alert("Failed to save tonight’s menu.");
  }
}

// Print menu
function printMenu() {
  window.print();
}

// Preview menu (redirect to tonight’s event page)
function previewMenu() {
  window.location.href = "tonights-event.html";
}

// Utility: Capitalize first letter
function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

// Expose functions globally for inline HTML
window.showAdminPanel = showAdminPanel;
window.showCategory = loadDrinks;
window.saveTonightsMenu = saveTonightsMenu;
window.printMenu = printMenu;
window.previewMenu = previewMenu;
