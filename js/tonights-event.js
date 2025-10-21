// js/tonights-event.js
import { db } from "./firebase.js";
import { collection, onSnapshot, getDoc, doc } 
  from "https://www.gstatic.com/firebasejs/9.6.11/firebase-firestore.js";

const eventMenu = document.getElementById("eventMenu");

function renderMenu(drinks) {
  eventMenu.innerHTML = "";
  drinks.forEach(drink => {
    const card = document.createElement("div");
    card.className = "drink-card";
    card.innerHTML = `
      <img src="./assets/drinks/${drink.image}" alt="${drink.name}" />
      <h3>${drink.name}</h3>
      <p>${drink.blurb || ""}</p>
    `;
    eventMenu.appendChild(card);
  });
}

async function loadMenu() {
  const tonightMenuRef = collection(db, "tonightMenu");
  onSnapshot(tonightMenuRef, async (snapshot) => {
    const drinks = [];
    for (const docSnap of snapshot.docs) {
      const drinkId = docSnap.id;
      const collections = ["cocktails", "beer", "spirits", "misc"];
      for (const col of collections) {
        const dRef = doc(db, col, drinkId);
        const dSnap = await getDoc(dRef);
        if (dSnap.exists()) {
          drinks.push(dSnap.data());
          break;
        }
      }
    }
    renderMenu(drinks);
  });
}

window.addEventListener("DOMContentLoaded", loadMenu);
