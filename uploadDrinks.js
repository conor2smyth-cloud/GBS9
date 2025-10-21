/**
 * uploadDrinks.js
 * Force lowercase collection names when uploading drinks.json into Firestore
 */

const admin = require("firebase-admin");
const fs = require("fs");
const path = require("path");

// Load service account
const serviceAccount = require("./gbs9-service-key.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

// Path to drinks.json
const drinksPath = path.join(__dirname, "data", "drinks.json");

// Read drinks.json
const drinksData = JSON.parse(fs.readFileSync(drinksPath, "utf8"));

// Collections to upload (map Excel -> Firestore lowercase)
const collections = {
  cocktails: drinksData.cocktails || [],
  beer: drinksData.beer || [],
  spirits: drinksData.spirits || [],
  mixers: drinksData.mixers || [],
  misc: drinksData.misc || [],
  equipment: drinksData.equipment || [],
  glasses: drinksData.glasses || [],
  snacks: drinksData.snacks || [],
};

(async () => {
  let total = 0;

  for (const [collectionName, items] of Object.entries(collections)) {
    if (!Array.isArray(items) || items.length === 0) {
      console.log(`⚠️ No items for ${collectionName}`);
      continue;
    }

    const colRef = db.collection(collectionName.toLowerCase()); // ✅ force lowercase

    // Clear old docs
    const snapshot = await colRef.get();
    const batch = db.batch();
    snapshot.forEach(doc => batch.delete(doc.ref));
    await batch.commit();

    // Upload new docs
    for (const item of items) {
      // normalise keys (capitalisation safe)
      const normalised = {};
      for (let [key, value] of Object.entries(item)) {
        normalised[key.toLowerCase().replace(/\s+/g, "_")] = value;
      }
      await colRef.add(normalised);
      total++;
    }

    console.log(`[OK] Synced ${items.length} drinks into '${collectionName.toLowerCase()}'`);
  }

  console.log(`🎉 Finished uploading. Total drinks: ${total}`);
})();
