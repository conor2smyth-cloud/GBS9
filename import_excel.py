import pandas as pd
import json
import os
import shutil

def backup_file(filepath):
    """Create a backup of the JSON file if it exists"""
    if os.path.exists(filepath):
        backup_path = filepath.replace(".json", "_backup.json")
        shutil.copy(filepath, backup_path)
        print(f"📦 Backup created: {backup_path}")

def sheet_to_list(sheet):
    """Convert a DataFrame into a list of dicts formatted for listings"""
    items = []
    sheet = sheet.where(pd.notnull(sheet), None)  # Replace NaN with None

    for _, row in sheet.iterrows():
        item = {
            "name": str(row.get("Name")).strip() if row.get("Name") else None,
            "base": row.get("Base"),
            "glass": row.get("Glass"),
            "image": row.get("Image"),
            "ingredients": [i.strip() for i in str(row.get("Ingredients")).split(".") if i.strip()] if row.get("Ingredients") else [],
            "short": row.get("Short"),
            "flavours": [f.strip() for f in str(row.get("Flavours")).split(",")] if row.get("Flavours") else [],
            "kegged": row.get("Kegged"),
            "type": sheet.name.lower() if hasattr(sheet, "name") else "misc"
        }

        # Skip empty rows
        if not item["name"]:
            continue

        items.append(item)

    # Remove duplicates by "name"
    seen = set()
    unique_items = []
    for item in items:
        if item["name"] not in seen:
            unique_items.append(item)
            seen.add(item["name"])
    return unique_items

def generate_from_excel():
    xls = pd.ExcelFile("cocktails.xlsx")
    data = {}

    for sheet_name in xls.sheet_names:
        sheet = xls.parse(sheet_name)
        sheet.name = sheet_name
        data[sheet_name.lower()] = sheet_to_list(sheet)

    # Back up before overwrite
    backup_file("data/cocktails.json")
    backup_file("data/drinks.json")

    # Save cocktails.json (only cocktails)
    with open("data/cocktails.json", "w", encoding="utf-8") as f:
        json.dump({"cocktails": data.get("cocktails", [])}, f, indent=2, ensure_ascii=False)

    # Save drinks.json (everything)
    with open("data/drinks.json", "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2, ensure_ascii=False)

    print("✅ Export complete: cocktails.json and drinks.json updated")

if __name__ == "__main__":
    generate_from_excel()

