import pandas as pd
import json
import os

# === CONFIG ===
EXCEL_FILE = "data/drinks.xlsx"   # Input Excel file
OUTPUT_FILE = "data/drinks.json" # Output JSON file

def sheet_to_list(sheet):
    """Convert a DataFrame sheet into a list of dicts for JSON"""
    items = []
    for _, row in sheet.iterrows():
        name = str(row.get("Name", "")).strip()
        if not name:  # skip empty rows
            continue

        # Ingredients → always an array
        raw_ingredients = str(row.get("Ingredients", "")).strip()
        ingredients = [i.strip() for i in raw_ingredients.split(";") if i.strip()] if raw_ingredients else []

        # Flavour → array if multiple values
        raw_flavour = str(row.get("Flavour", "")).strip()
        flavour = [f.strip() for f in raw_flavour.split(";") if f.strip()] if raw_flavour else []

        item = {
            "name": name,
            "base": str(row.get("Base Spirit", "")).strip(),
            "glass": str(row.get("Glass", "")).strip(),
            "ingredients": ingredients,
            "short": str(row.get("Method / Blurb", "")).strip(),
            "image": str(row.get("Image Filename", "")).strip(),
            "kegged": str(row.get("Kegged", "")).strip(),
            "type": str(row.get("Type", "cocktails")).strip().lower(),
            "flavour": flavour
        }
        items.append(item)
    return items

def generate_combined_json():
    if not os.path.exists(EXCEL_FILE):
        raise FileNotFoundError(f"Excel file not found: {EXCEL_FILE}")

    # Load workbook
    xls = pd.ExcelFile(EXCEL_FILE)

    # Extract sheets if they exist
    cocktails = sheet_to_list(pd.read_excel(xls, "Cocktails")) if "Cocktails" in xls.sheet_names else []
    beer = sheet_to_list(pd.read_excel(xls, "Beer")) if "Beer" in xls.sheet_names else []
    equipment = sheet_to_list(pd.read_excel(xls, "Equipment")) if "Equipment" in xls.sheet_names else []
    misc = sheet_to_list(pd.read_excel(xls, "Misc")) if "Misc" in xls.sheet_names else []

    # Build structured JSON
    combined = {
        "cocktails": cocktails,
        "beer": beer,
        "equipment": equipment,
        "misc": misc
    }

    # Save JSON
    with open(OUTPUT_FILE, "w", encoding="utf-8") as f:
        json.dump(combined, f, indent=2, ensure_ascii=False)

    print(f"✅ Exported {len(cocktails)} cocktails, {len(beer)} beers, {len(equipment)} equipment items, {len(misc)} misc to {OUTPUT_FILE}")

if __name__ == "__main__":
    generate_combined_json()
