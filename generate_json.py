import os
import json

# Directories
RAW_DIRS = {
    "cocktails": "images/_raw/cocktails",
    "beer": "images/_raw/beer",
    "equipment": "images/_raw/equipment"
}
OUTPUT_JSON = "data/cocktails.json"

def generate_entries():
    data = {"cocktails": [], "beer": [], "equipment": []}

    for category, folder in RAW_DIRS.items():
        if not os.path.exists(folder):
            print(f"⚠️ Skipping missing folder: {folder}")
            continue

        for filename in os.listdir(folder):
            if filename.lower().endswith((".jpg", ".jpeg", ".png")):
                name = os.path.splitext(filename)[0].replace("-", " ").title()
                entry = {
                    "name": name,
                    "base": "Unknown" if category == "cocktails" else None,
                    "glass": "Unknown" if category == "cocktails" else None,
                    "image": filename,
                    "ingredients": [],
                    "short": f"{name} – coming soon!",
                    "kegged": "No" if category in ["cocktails", "beer"] else None,
                    "type": category
                }
                data[category].append(entry)

    return data

if __name__ == "__main__":
    data = generate_entries()
    os.makedirs(os.path.dirname(OUTPUT_JSON), exist_ok=True)

    with open(OUTPUT_JSON, "w") as f:
        json.dump(data, f, indent=2)

    print(f"✅ cocktails.json regenerated with {sum(len(v) for v in data.values())} entries")
