import pandas as pd
import json
import os

def sheet_to_list(sheet):
    """Convert a DataFrame into a list of dicts formatted for listings"""
    items = []
    for _, row in sheet.iterrows():
        if pd.isna(row["Name"]):
            continue

        # Safe values
        name = str(row["Name"]).strip()
        base = str(row.get("Base Spirit", "")).strip()
        glass = str(row.get("Glass", "")).strip()
        ingredients = []
        if not pd.isna(row.get("Ingredients")):
            ingredients = [i.strip() for i in str(row["Ingredients"]).split(".") if i.strip()]

        method = str(row.get("Method / Blurb", "")).strip()
        image = str(row.get("Image Filename", "")).strip()
        kegged = str(row.get("Kegged", "No")).strip()
        flavour = str(row.get("Flavour", "")).strip()

        # Detect type based on image filename
        if image.lower().startswith("beer-"):
            type_val = "beer"
        elif image.lower().startswith("equipment-"):
            type_val = "equipment"
        else:
            type_val = "cocktails"

        # Build record
        item = {
            "name": name,
            "type": type_val,
            "base": base,
            "glass": glass,
            "ingredients": ingredients,
            "short": method,
            "image": image,
            "kegged": kegged,
            "flavour": flavour
        }
        items.append(item)

    return items


def generate_combined_json(excel_file="cocktails.xlsx", output_file="data/drinks.json"):
    xls = pd.ExcelFile(excel_file)
    data = {
        "cocktails": [],
        "beer": [],
        "equipment": []
    }

    # Loop over all sheets
    for sheet_name in xls.sheet_names:
        df = pd.read_excel(xls, sheet_name=sheet_name)
        items = sheet_to_list(df)

        for item in items:
            if item["type"] == "beer":
                data["beer"].append(item)
            elif item["type"] == "equipment":
                data["equipment"].append(item)
            else:
                data["cocktails"].append(item)

    # Save to JSON
    with open(output_file, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2, ensure_ascii=False)

    print(f"✅ Successfully wrote {output_file}")


if __name__ == "__main__":
    generate_combined_json()


