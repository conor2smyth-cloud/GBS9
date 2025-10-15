import pandas as pd
import json
import os

def sheet_to_list(sheet):
    """Convert a DataFrame into a list of dicts formatted for listings"""
    items = []
    for _, row in sheet.iterrows():
        ingredients = []
        if pd.notna(row.get("Ingredients")):
            ingredients = [i.strip() for i in str(row["Ingredients"]).split(";") if i.strip()]

        item = {
            "name": str(row.get("Name", "")).strip(),
            "base": str(row.get("Base Spirit", "")).strip(),
            "glass": str(row.get("Glass", "")).strip(),
            "ingredients": ingredients,
            "short": str(row.get("Method / Blurb", "")).strip(),
            "image": str(row.get("Image Filename", "coming-soon.jpg")).strip(),
            "kegged": str(row.get("Kegged", "No")).strip(),
            "type": str(row.get("Type", "cocktails")).strip()
        }
        items.append(item)
    return items

def import_excel_to_json(
    excel_file="cocktails.xlsx",
    json_file="data/cocktails.json"
):
    # Load Excel workbook with multiple sheets
    xls = pd.ExcelFile(excel_file)

    cocktails = sheet_to_list(pd.read_excel(xls, "cocktails")) if "cocktails" in xls.sheet_names else []
    beer = sheet_to_list(pd.read_excel(xls, "beer")) if "beer" in xls.sheet_names else []
    equipment = sheet_to_list(pd.read_excel(xls, "equipment")) if "equipment" in xls.sheet_names else []

    data = {
        "cocktails": cocktails,
        "beer": beer,
        "equipment": equipment
    }

    os.makedirs(os.path.dirname(json_file), exist_ok=True)
    with open(json_file, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2, ensure_ascii=False)

    print(f"✅ Exported {len(cocktails)} cocktails, {len(beer)} beer, {len(equipment)} equipment → {json_file}")

if __name__ == "__main__":
    import_excel_to_json()

