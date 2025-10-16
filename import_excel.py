import pandas as pd
import json
import os

def sheet_to_list(sheet):
    """Convert a DataFrame sheet into a list of dicts formatted for listings"""
    items = []
    for _, row in sheet.iterrows():
        name = str(row["Name"]).strip()
        base = str(row["Base Spirit"]).strip()
        glass = str(row["Glass"]).strip()
        ingredients_raw = str(row["Ingredients"]).strip()
        method = str(row["Method / Blurb"]).strip()
        image_filename = str(row["Image Filename"]).strip()
        kegged = str(row["Kegged"]).strip()
        type_ = str(row["Type"]).strip()
        flavour = str(row["Flavour"]).strip()

        # --- Clean ingredients into list ---
        ingredients = []
        if ingredients_raw and ingredients_raw.lower() != "nan":
            # Split by "." or ";" or "," for safety
            parts = [x.strip() for x in ingredients_raw.replace(";", ".").split(".") if x.strip()]
            ingredients = parts

        # --- Fallback image convention ---
        if not image_filename or image_filename.lower() == "nan":
            # auto-generate from name
            slug = name.lower().replace(" ", "-")
            image_filename = f"cocktail-{slug}.jpg"

        item = {
            "name": name,
            "base": base,
            "glass": glass,
            "image": image_filename,
            "ingredients": ingredients,
            "short": method,       # ✅ this is your blurb
            "kegged": kegged,
            "type": type_,
            "flavour": flavour
        }
        items.append(item)
    return items

def generate_combined_json():
    # Load Excel
    xls = pd.ExcelFile("cocktails.xlsx")

    all_data = {}

    # Each sheet becomes a section
    for sheet_name in xls.sheet_names:
        df = pd.read_excel(xls, sheet_name=sheet_name)
        all_data[sheet_name.lower()] = sheet_to_list(df)

    # Save to combined JSON
    with open("data/drinks.json", "w", encoding="utf-8") as f:
        json.dump(all_data, f, indent=2, ensure_ascii=False)

    print("✅ drinks.json generated successfully!")

if __name__ == "__main__":
    generate_combined_json()

