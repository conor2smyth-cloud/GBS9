import os, json

# Folder paths
RAW_COCKTAILS = "images/_raw/cocktails"
RAW_BEER = "images/_raw/beer"
RAW_EQUIP = "images/_raw/equipment"

# Output JSONs
OUTPUT_COCKTAILS = "data/cocktails.json"
OUTPUT_BEER = "data/beer.json"
OUTPUT_EQUIP = "data/equipment.json"


def make_entries(src_folder, category):
    entries = []
    if not os.path.exists(src_folder):
        print(f"⚠️ Missing folder: {src_folder}")
        return entries

    for filename in os.listdir(src_folder):
        if filename.lower().endswith((".jpg", ".jpeg", ".png")):
            # Generate name from filename
            name = filename.replace("-", " ").replace(".jpg", "").replace(".jpeg", "").replace(".png", "").title()

            entry = {
                "name": name,
                "image": filename,
                "short": f"A {category} item: {name}."
            }

            # Add category-specific defaults
            if category == "cocktail":
                entry.update({
                    "base": "TBD",
                    "glass": "TBD",
                    "status": "available",
                    "kegged": "no"
                })
            elif category == "beer":
                entry.update({
                    "type": "lager",  # default type
                    "abv": "TBD"
                })
            elif category == "equipment":
                entry.update({
                    "usage": "bar setup",
                    "status": "in stock"
                })

            entries.append(entry)
    return entries


def main():
    cocktails = make_entries(RAW_COCKTAILS, "cocktail")
    beers = make_entries(RAW_BEER, "beer")
    equipment = make_entries(RAW_EQUIP, "equipment")

    os.makedirs("data", exist_ok=True)

    with open(OUTPUT_COCKTAILS, "w") as f:
        json.dump(cocktails, f, indent=2)
    with open(OUTPUT_BEER, "w") as f:
        json.dump(beers, f, indent=2)
    with open(OUTPUT_EQUIP, "w") as f:
        json.dump(equipment, f, indent=2)

    print(f"✅ Wrote {len(cocktails)} cocktails, {len(beers)} beers, {len(equipment)} equipment entries")


if __name__ == "__main__":
    main()
